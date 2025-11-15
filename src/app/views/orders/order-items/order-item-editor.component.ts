/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges,
         ViewChild } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { combineLatest } from 'rxjs';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { CataloguesStateSelector, ProductsStateSelector } from '@app/presentation/exported.presentation.types';

import { SelectBoxTypeaheadComponent } from '@app/shared/form-controls';

import { ArrayLibrary, FormHelper, sendEvent } from '@app/shared/utils';

import { BudgetTransactionsDataService, OrdersDataService, SearcherAPIS } from '@app/data-services';

import { BudgetAccountsForProductQuery, Order, OrderItem, OrderItemFields, EmptyOrder, EmptyOrderItem,
         ProductSearch, OrderExplorerTypeConfig, EmptyOrderExplorerTypeConfig, ObjectTypes, PayableOrderItem,
         ContractOrderItem, ContractOrderItemFields, PayableOrderItemFields, PayableOrder,
         RequisitionOrderItem, RequisitionOrder, RequisitionOrderItemFields } from '@app/models';


export enum OrderItemEditorEventType {
  CLOSE_BUTTON_CLICKED = 'OrderItemEditorComponent.Event.CloseButtonClicked',
  ADD_ITEM             = 'OrderItemEditorComponent.Event.AddItem',
  UPDATE_ITEM          = 'OrderItemEditorComponent.Event.UpdateItem',
}

interface OrderItemFormModel extends FormGroup<{
  linkedItemUID: FormControl<string>;
  requestedByUID: FormControl<string>;
  description: FormControl<string>;
  productUID: FormControl<string>;
  budgetUID: FormControl<string>;
  budgetAccountUID: FormControl<string>;
  productUnitUID: FormControl<string>;
  unitPrice: FormControl<number>;
  quantity: FormControl<number>;
  discount: FormControl<number>;
  total: FormControl<number>;
  projectUID: FormControl<string>;
  justification: FormControl<string>;
}> { }

@Component({
  selector: 'emp-ng-order-item-editor',
  templateUrl: './order-item-editor.component.html',
})
export class OrderItemEditorComponent implements OnChanges, OnInit, OnDestroy {

  @ViewChild('productSearcher') productSearcher: SelectBoxTypeaheadComponent;

  @Input() config: OrderExplorerTypeConfig<ObjectTypes> = EmptyOrderExplorerTypeConfig;

  @Input() order: Order = EmptyOrder;

  @Input() item: OrderItem = EmptyOrderItem;

  @Input() canUpdate = false;

  @Output() orderItemEditorEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: OrderItemFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  isLoadingBudgetAccounts = false;

  isLoadingContractItems = false;

  orgUnitsList: Identifiable[] = [];

  availableItemsList: OrderItem[] = [];

  productUnitsList: Identifiable[] = [];

  budgetsList: Identifiable[] = [];

  budgetAccountsList: Identifiable[] = [];

  productsAPI = SearcherAPIS.products;

  projectsAPI = SearcherAPIS.projects;


  constructor(private uiLayer: PresentationLayer,
              private ordersData: OrdersDataService,
              private budgetData: BudgetTransactionsDataService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnInit() {
    this.loadDataLists();
    this.validateLoadOrderAvailableItems();
    this.setBudgetsList();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (this.isSaved && changes.item) {
      this.enableEditor();
    }

    this.validateFieldsRequired();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get isSaved(): boolean {
    return !isEmpty(this.item);
  }


  get isRequisition(): boolean {
    return [ObjectTypes.REQUISITION].includes(this.config.type);
  }


  get isPurchaseOrder(): boolean {
    return [ObjectTypes.PURCHASE_ORDER].includes(this.config.type);
  }


  get isExpense(): boolean {
    return [ObjectTypes.EXPENSE].includes(this.config.type);
  }

  get isContractOrder(): boolean {
    return [ObjectTypes.CONTRACT_ORDER].includes(this.config.type);
  }


  get requestedByFieldRequired(): boolean {
    return this.isRequisition && this.order.isForMultipleBeneficiaries;
  }


  get title(): string {
    const orderTypeName = `${this.config.pronounSingular} ${this.config.nameSingular}`;
    if (!this.isSaved) return `Agregar concepto a ${orderTypeName}`;
    return `${this.canUpdate ? 'Editar' : 'Detalle del '} concepto de ${orderTypeName}`;
  }


  onAvailableItemChanges(item: OrderItem) {
    this.form.controls.productUID.reset(FormHelper.getUIDValueValid(item?.product));
    this.form.controls.unitPrice.reset(FormHelper.getNumberValueValid(item?.unitPrice));
    this.form.controls.quantity.reset(FormHelper.getNumberValueValid(item?.quantity));
    this.form.controls.productUnitUID.reset(FormHelper.getUIDValueValid(item?.productUnit));
    this.onTotalChanges();
    this.resetProductByItem(item?.product);
  }


  onTotalChanges() {
    const { quantity = 0, unitPrice = 0, discount = 0 } = this.form.getRawValue();
    const total = quantity * unitPrice - discount;
    this.form.controls.total.reset(total);
  }


  onRequestedByChanges(orgUnit: Identifiable) {
    this.form.controls.budgetAccountUID.reset();
    this.budgetAccountsList = [];
    this.validateSearchBudgetAccounts();
  }


  onBudgetChanges(budget: Identifiable) {
    this.form.controls.budgetAccountUID.reset();
    this.budgetAccountsList = [];
    this.validateSearchBudgetAccounts();
  }


  onProductChanges(product: ProductSearch) {
    this.form.controls.budgetAccountUID.reset();
    this.budgetAccountsList = [];
    this.validateSearchBudgetAccounts();
    this.validateDescriptionRequired();
  }


  onCloseButtonClicked() {
    sendEvent(this.orderItemEditorEvent, OrderItemEditorEventType.CLOSE_BUTTON_CLICKED);
  }


  onSubmitButtonClicked() {
    if (FormHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.isSaved ? OrderItemEditorEventType.UPDATE_ITEM : OrderItemEditorEventType.ADD_ITEM;

      const payload = {
        orderUID: this.order.uid,
        orderItemUID: this.isSaved ? this.item.uid : null,
        dataFields: this.validateGetOrderItemFields()
      };

      sendEvent(this.orderItemEditorEvent, eventType, payload);
    }
  }


  private enableEditor() {
    this.editionMode = this.canUpdate;

    if (this.isSaved) {
      this.setFormData();
    }

    this.validateFormDisabled();
  }


  private validateFieldsRequired() {
    if (!this.isSaved || (this.isSaved && this.canUpdate)) {
      this.validateControlRequired(this.form.controls.linkedItemUID, this.isPurchaseOrder || this.isExpense || this.isContractOrder);
      this.validateControlRequired(this.form.controls.requestedByUID, this.requestedByFieldRequired);
      this.validateControlRequired(this.form.controls.productUID, this.isPurchaseOrder || this.isExpense || this.isContractOrder);
      this.validateControlRequired(this.form.controls.productUnitUID, this.isRequisition || this.isPurchaseOrder || this.isExpense || this.isContractOrder);
      this.validateControlRequired(this.form.controls.budgetAccountUID, this.isRequisition);
      this.validateControlRequired(this.form.controls.budgetUID, this.isRequisition);
      this.validateControlRequired(this.form.controls.unitPrice, this.isRequisition || this.isPurchaseOrder || this.isExpense || this.isContractOrder);
      this.validateDescriptionRequired();

      FormHelper.setDisableControl(this.form.controls.unitPrice, this.isContractOrder);
      FormHelper.setDisableControl(this.form.controls.linkedItemUID, this.isSaved && !this.isRequisition);
      FormHelper.setDisableControl(this.form.controls.total);
    }
  }


  private validateControlRequired(control, required: boolean) {
    required ? FormHelper.setControlValidators(control, Validators.required) :
      FormHelper.clearControlValidators(control);
  }


  private validateDescriptionRequired() {
    const required = this.isRequisition && !this.form.getRawValue().productUID;

    required ? FormHelper.setControlValidators(this.form.controls.description, Validators.required) :
      FormHelper.clearControlValidators(this.form.controls.description);
  }


  private validateFormDisabled() {
    FormHelper.setDisableForm(this.form, !this.canUpdate);
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS,
        { requestsList: this.config.requestsList }),
      this.helper.select<Identifiable[]>(ProductsStateSelector.PRODUCT_UNITS),
    ])
    .subscribe(([a, b]) => {
      this.orgUnitsList = a;
      this.productUnitsList = b;
      this.isLoading = false;
    });
  }


  private validateLoadOrderAvailableItems() {
    if (!this.isSaved && (this.isPurchaseOrder || this.isExpense || this.isContractOrder)) {
      this.getOrderAvailableItems(this.order.uid);
    }
  }


  private getOrderAvailableItems(orderUID: string)  {
    this.isLoadingContractItems = true;

    this.ordersData.getOrderAvailableItems(orderUID)
      .firstValue()
      .then(x => this.setAvailableItemsList(x))
      .finally(() => this.isLoadingContractItems = false);
  }


  private setAvailableItemsList(items: OrderItem[]) {
    this.availableItemsList = items;
  }


  private validateSearchBudgetAccounts(budgetAccountsDefault?: Identifiable) {
    if (this.isRequisition) {
      const { budgetUID = null, requestedByUID = null, productUID = null } = this.form.getRawValue();
      const order = this.order as PayableOrder;
      const operationType = 'procurement';
      const baseBudgetUID = this.isRequisition ? budgetUID : order.budget.uid;
      const basePartyUID = this.requestedByFieldRequired ? requestedByUID : order.requestedBy.uid;
      if (!!baseBudgetUID && !!basePartyUID) {
        const query: BudgetAccountsForProductQuery = { operationType, baseBudgetUID, basePartyUID, productUID };
        this.searchBudgetAccounts(query, budgetAccountsDefault);
      } else {
        this.setBudgetAccountsList([], budgetAccountsDefault);
      }
    }
  }


  private searchBudgetAccounts(query: BudgetAccountsForProductQuery,
                               budgetAccountsDefault?: Identifiable) {
    this.isLoadingBudgetAccounts = true;

    this.budgetData.searchBudgetAccounts(query)
    .firstValue()
      .then(x => this.setBudgetAccountsList(x, budgetAccountsDefault))
      .finally(() => this.isLoadingBudgetAccounts = false);
  }


  private setBudgetAccountsList(dataList: Identifiable[], budgetAccountsDefault?: Identifiable) {
    this.budgetAccountsList = isEmpty(budgetAccountsDefault) ?
      dataList :
      ArrayLibrary.insertIfNotExist(dataList, budgetAccountsDefault, 'uid');
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      linkedItemUID: [''],
      requestedByUID: [''],
      description: [''],
      productUID: [''],
      budgetUID: [''],
      budgetAccountUID: [''],
      productUnitUID: [''],
      unitPrice: [null as number],
      quantity: [null as number, Validators.required],
      discount: [null as number],
      total: [null as number],
      projectUID: [''],
      justification: [''],
    });
  }


  private setFormData() {
    setTimeout(() => {
      this.form.reset({
        requestedByUID: FormHelper.getUIDValueValid(this.item.requestedBy),
        projectUID: FormHelper.getUIDValueValid(this.item.project),
        productUID: FormHelper.getUIDValueValid(this.item.product),
        productUnitUID: FormHelper.getUIDValueValid(this.item.productUnit),
        quantity: FormHelper.getNumberValueValid(this.item.quantity),
        unitPrice: FormHelper.getNumberValueValid(this.item.unitPrice),
        total: FormHelper.getNumberValueValid(this.item.total),
        description: this.item.description,
        justification: this.item.justification,
      });
      this.validateSetOrderItemFields();
      this.validateSearchBudgetAccounts(this.getBudgetAccountDefault());
      this.validateSetDataList();
    });
  }


  private getBudgetAccountDefault(): Identifiable {
    switch (this.config.type) {
      case ObjectTypes.EXPENSE:
      case ObjectTypes.PURCHASE_ORDER:
      case ObjectTypes.REQUISITION:
        return (this.item as PayableOrderItem | RequisitionOrderItem)?.budgetAccount ?? null;
      default:
        return null;
    }
  }


  private validateSetOrderItemFields() {
    switch (this.config.type) {
      case ObjectTypes.CONTRACT_ORDER: {
        const item = this.item as ContractOrderItem;
        this.form.controls.linkedItemUID.reset(FormHelper.getUIDValueValid(item.contractItem));
        this.form.controls.budgetAccountUID.reset(FormHelper.getUIDValueValid(item.budgetAccount));
        this.form.controls.discount.reset(FormHelper.getNumberValueValid(item.discount));
        break;
      }
      case ObjectTypes.EXPENSE:
      case ObjectTypes.PURCHASE_ORDER: {
        const item = this.item as PayableOrderItem;
        this.form.controls.linkedItemUID.reset(FormHelper.getUIDValueValid(item.requisitionItem));
        this.form.controls.budgetAccountUID.reset(FormHelper.getUIDValueValid(item.budgetAccount));
        this.form.controls.discount.reset(FormHelper.getNumberValueValid(item.discount));
        break;
      }
      case ObjectTypes.REQUISITION: {
        const item = this.item as RequisitionOrderItem;
        this.form.controls.budgetUID.reset(FormHelper.getUIDValueValid(item.budget));
        this.form.controls.budgetAccountUID.reset(FormHelper.getUIDValueValid(item.budgetAccount));
        break;
      }
    }
  }


  private validateSetDataList() {
    switch (this.config.type) {
      case ObjectTypes.CONTRACT_ORDER: {
        const item = this.item as ContractOrderItem;
        const contractItem = isEmpty(item.contractItem) ? null : item.contractItem;
        this.setAvailableItemsList(ArrayLibrary.insertIfNotExist(this.availableItemsList ?? [], contractItem as any, 'uid'));
        this.setProductUnitsList(item.productUnit);
        break;
      }
      case ObjectTypes.EXPENSE:
      case ObjectTypes.PURCHASE_ORDER: {
        const item = this.item as PayableOrderItem;
        this.setAvailableItemsList(ArrayLibrary.insertIfNotExist(this.availableItemsList ?? [], item.requisitionItem, 'uid'));
        this.setProductUnitsList(item.productUnit);
        break;
      }
      case ObjectTypes.REQUISITION: {
        const item = this.item as RequisitionOrderItem;
        this.setBudgetsList();
        this.setProductUnitsList(item.productUnit);
        break;
      }
    }
  }


  private resetProductByItem(product: Identifiable) {
    if (!isEmpty(product)) {
      this.productSearcher.resetListWithOption(product);
    }
  }


  private setBudgetsList() {
    if (this.isRequisition) {
      const order = this.order as RequisitionOrder;
      this.budgetsList = order.budgets;
    }
  }


  private setProductUnitsList(productUnit: Identifiable) {
    this.productUnitsList = ArrayLibrary.insertIfNotExist(this.productUnitsList ?? [], productUnit, 'uid');
  }


  private validateGetOrderItemFields(): OrderItemFields {
    switch (this.config.type) {
      case ObjectTypes.CONTRACT_ORDER:
        return this.getContractOrderItemFields();
      case ObjectTypes.EXPENSE:
      case ObjectTypes.PURCHASE_ORDER:
        return this.getPayableOrderItemFields();
      case ObjectTypes.REQUISITION:
        return this.getRequisitionOrderItemFields();
      default:
        return this.getOrderItemFields();
    }
  }


  private getRequisitionOrderItemFields(): RequisitionOrderItemFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formValues = this.form.getRawValue();

    const data: RequisitionOrderItemFields = {
      ...this.getOrderItemFields(),
      ...
      {
        budgetUID: formValues.budgetUID ?? null,
        budgetAccountUID: formValues.budgetAccountUID ?? null,
      }
    };

    return data;
  }


  private getContractOrderItemFields(): ContractOrderItemFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const data: ContractOrderItemFields = {
      ...this.getPayableOrderItemFields(),
      ...
      {
        contractItemUID: this.form.getRawValue().linkedItemUID ?? null,
      }
    };

    return data;
  }


  private getPayableOrderItemFields(): PayableOrderItemFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formValues = this.form.getRawValue();

    const data: PayableOrderItemFields = {
      ...this.getOrderItemFields(),
      ...
      {
        budgetAccountUID: formValues.budgetAccountUID ?? null,
        discount: formValues.discount ?? 0,
        requisitionItemUID: formValues.linkedItemUID ?? null,
      }
    };

    return data;
  }


  private getOrderItemFields(): OrderItemFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formValues = this.form.getRawValue();

    const data: OrderItemFields = {
      productUID: formValues.productUID ?? null,
      productUnitUID: formValues.productUnitUID ?? null,
      requestedByUID: formValues.requestedByUID ?? null,
      projectUID: formValues.projectUID ?? '',
      quantity: formValues.quantity ?? 0,
      unitPrice: formValues.unitPrice ?? 0,
      total: formValues.total ?? 0,
      description: formValues.description ?? '',
      justification: formValues.justification ?? '',
    };

    return data;
  }

}
