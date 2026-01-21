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

import { BudgetAccountsForProductQuery, ContractItem, ContractItemFields, ContractOrderItem,
         ContractOrderItemFields, DateRange, DefaultProductUnit, EmptyDateRange, EmptyOrder,
         EmptyOrderExplorerTypeConfig, EmptyOrderItem, ObjectTypes, Order, OrderExplorerTypeConfig, OrderItem,
         OrderItemFields, PayableOrder, PayableOrderItem, PayableOrderItemFields, ProductSearch,
         RequisitionOrder, RequisitionOrderItem, RequisitionOrderItemFields } from '@app/models';


export enum OrderItemEditorEventType {
  CLOSE_BUTTON_CLICKED = 'OrderItemEditorComponent.Event.CloseButtonClicked',
  ADD_ITEM             = 'OrderItemEditorComponent.Event.AddItem',
  UPDATE_ITEM          = 'OrderItemEditorComponent.Event.UpdateItem',
}

interface OrderItemFormModel extends FormGroup<{
  linkedItemUID: FormControl<string>;
  beneficiaryUID: FormControl<string>;
  datePeriod: FormControl<DateRange>;
  description: FormControl<string>;
  productUID: FormControl<string>;
  productUnitUID: FormControl<string>;
  budgetUID: FormControl<string>;
  budgetAccountUID: FormControl<string>;
  originCountryUID: FormControl<string>;
  unitPrice: FormControl<number>;
  quantity: FormControl<number>;
  minQuantity: FormControl<number>;
  maxQuantity: FormControl<number>;
  discount: FormControl<number>;
  penaltyDiscount: FormControl<number>;
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

  countriesList: Identifiable[] = [];

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

    this.validateDefaultFields();
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


  get isContract(): boolean {
    return [ObjectTypes.CONTRACT].includes(this.config.type);
  }


  get isContractOrder(): boolean {
    return [ObjectTypes.CONTRACT_ORDER].includes(this.config.type);
  }


  get isPurchase(): boolean {
    return [ObjectTypes.PURCHASE].includes(this.config.type);
  }


  get isExpense(): boolean {
    return [ObjectTypes.EXPENSE].includes(this.config.type);
  }


  get beneficiaryFieldRequired(): boolean {
    return (this.isRequisition || this.isContract || this.isContractOrder) &&
      this.order.isForMultipleBeneficiaries;
  }


  get title(): string {
    const orderTypeName = `${this.config.pronounSingular} ${this.config.nameSingular}`;
    if (!this.isSaved) return `Agregar concepto a ${orderTypeName}`;
    return `${this.canUpdate ? 'Editar' : 'Detalle del '} concepto de ${orderTypeName}`;
  }


  get numericFieldSize(): string {
    return this.isContractOrder || this.isPurchase ? 'fx-item-fifth' : 'fx-item-quarter';
  }


  onAvailableItemChanges(item: OrderItem) {
    this.form.controls.productUID.reset(FormHelper.getUIDValue(item?.product));
    this.form.controls.productUnitUID.reset(FormHelper.getUIDValue(item?.productUnit));
    this.form.controls.unitPrice.reset(FormHelper.getPositiveNumberValue(item?.unitPrice));
    this.form.controls.description.reset(FormHelper.getStringValue(item.description));
    this.form.controls.beneficiaryUID.reset(FormHelper.getUIDValue(item.beneficiary));
    // this.form.controls.quantity.reset(FormHelper.getPositiveNumberValue(this.isContract ? 0 : item?.quantity));

    if (this.isContract) {
      const contractItem = item as ContractItem;
      this.form.controls.budgetUID.reset(FormHelper.getUIDValue(contractItem?.budget));
      this.form.controls.budgetAccountUID.reset(FormHelper.getUIDValue(contractItem?.budgetAccount));
      this.form.controls.minQuantity.reset(FormHelper.getPositiveNumberValue(contractItem?.quantity));
      this.form.controls.maxQuantity.reset(FormHelper.getPositiveNumberValue(contractItem?.quantity));
      this.setBudgetAccountsList([], contractItem.budgetAccount);
    }

    if (this.isExpense) {
      this.form.controls.total.reset(FormHelper.getPositiveNumberValue(item?.total));
    }

    this.onTotalChanges();
    this.resetProductByItem(item?.product);
  }


  onTotalChanges() {
    if (this.isContractOrder || this.isPurchase) {
      const { quantity = 0, unitPrice = 0, discount = 0, penaltyDiscount = 0 } = this.form.getRawValue();
      const total = quantity * unitPrice - discount - penaltyDiscount;
      this.form.controls.total.reset(total);
    }
  }


  onBeneficiaryChanges(orgUnit: Identifiable) {
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


  private validateDefaultFields() {
    if (!this.isSaved && this.isRequisition) {
      this.form.controls.productUnitUID.reset(DefaultProductUnit);
    }
  }


  private validateFieldsRequired() {
    if (!this.isSaved || (this.isSaved && this.canUpdate)) {
      const controls = this.form.controls;

      this.validateControlRequired(controls.linkedItemUID, this.isContract || this.isContractOrder || this.isPurchase || this.isExpense);
      this.validateControlRequired(controls.beneficiaryUID, this.beneficiaryFieldRequired);
      this.validateControlRequired(controls.budgetAccountUID, this.isRequisition || this.isContract);
      this.validateControlRequired(controls.budgetUID, this.isRequisition || this.isContract);

      this.validateControlRequired(controls.quantity, this.isContractOrder || this.isPurchase);
      this.validateControlRequired(controls.minQuantity, this.isContract);
      this.validateControlRequired(controls.maxQuantity, this.isContract);
      this.validateControlRequired(controls.unitPrice, this.isContract || this.isContractOrder || this.isPurchase);
      this.validateControlRequired(controls.total, this.isRequisition || this.isContractOrder || this.isPurchase || this.isExpense);

      FormHelper.setDisableControl(controls.unitPrice, this.isContractOrder);
      FormHelper.setDisableControl(controls.linkedItemUID, this.isSaved && !this.isRequisition);
      FormHelper.setDisableControl(controls.total, this.isContractOrder || this.isPurchase);
    }
  }


  private validateControlRequired(control, required: boolean, validators = [Validators.required]) {
    required ? FormHelper.setControlValidators(control, validators) :
      FormHelper.clearControlValidators(control);
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
      this.helper.select<Identifiable[]>(CataloguesStateSelector.COUNTRIES),
    ])
    .subscribe(([a, b, c]) => {
      this.orgUnitsList = a;
      this.productUnitsList = b;
      this.countriesList = c;
      this.isLoading = false;
    });
  }


  private validateLoadOrderAvailableItems() {
    if (!this.isSaved && (this.isContract || this.isContractOrder || this.isPurchase || this.isExpense)) {
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
    if (this.isRequisition || this.isContract) {
      const { budgetUID = null, beneficiaryUID = null, productUID = null } = this.form.getRawValue();
      const order = this.order as PayableOrder;
      const operationType = 'procurement';
      const baseBudgetUID = budgetUID;
      const basePartyUID = this.beneficiaryFieldRequired ? beneficiaryUID : order.beneficiary.uid;
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
      beneficiaryUID: [''],
      description: [''],
      datePeriod: [EmptyDateRange],
      budgetUID: [''],
      budgetAccountUID: [''],
      originCountryUID: [''],
      productUID: [''],
      productUnitUID: ['', Validators.required],
      unitPrice: [null as number],
      quantity: [null as number],
      minQuantity: [null as number],
      maxQuantity: [null as number],
      discount: [null as number],
      penaltyDiscount: [null as number],
      total: [null as number],
      projectUID: [''],
      justification: [''],
    });
  }


  private setFormData() {
    setTimeout(() => {
      this.form.reset({
        beneficiaryUID: FormHelper.getUIDValue(this.item.beneficiary),
        projectUID: FormHelper.getUIDValue(this.item.project),
        productUID: FormHelper.getUIDValue(this.item.product),
        productUnitUID: FormHelper.getUIDValue(this.item.productUnit),
        quantity: FormHelper.getPositiveNumberValue(this.item.quantity),
        unitPrice: FormHelper.getPositiveNumberValue(this.item.unitPrice),
        total: FormHelper.getPositiveNumberValue(this.item.total),
        description: FormHelper.getStringValue(this.item.description),
        datePeriod: { fromDate: this.item.startDate ?? null, toDate: this.item.endDate ?? null },
        justification: FormHelper.getStringValue(this.item.justification),
      });
      this.validateSetOrderItemFields();
      this.validateSearchBudgetAccounts(this.getBudgetAccountDefault());
      this.validateSetDataList();
    });
  }


  private getBudgetAccountDefault(): Identifiable {
    switch (this.config.type) {
      case ObjectTypes.REQUISITION:
        return (this.item as RequisitionOrderItem)?.budgetAccount ?? null;
      default:
        return null;
    }
  }


  private validateSetOrderItemFields() {
    switch (this.config.type) {
      case ObjectTypes.REQUISITION: {
        const item = this.item as RequisitionOrderItem;
        this.form.controls.budgetUID.reset(FormHelper.getUIDValue(item.budget));
        this.form.controls.budgetAccountUID.reset(FormHelper.getUIDValue(item.budgetAccount));
        this.form.controls.originCountryUID.reset(FormHelper.getUIDValue(item.originCountry));
        break;
      }
      case ObjectTypes.CONTRACT: {
        const item = this.item as ContractItem;
        this.form.controls.linkedItemUID.reset(FormHelper.getUIDValue(item.requisitionItem));
        this.form.controls.budgetUID.reset(FormHelper.getUIDValue(item.budget));
        this.form.controls.budgetAccountUID.reset(FormHelper.getUIDValue(item.budgetAccount));
        this.form.controls.minQuantity.reset(FormHelper.getPositiveNumberValue(item.minQuantity));
        this.form.controls.maxQuantity.reset(FormHelper.getPositiveNumberValue(item.maxQuantity));
        break;
      }
      case ObjectTypes.CONTRACT_ORDER: {
        const item = this.item as ContractOrderItem;
        this.form.controls.linkedItemUID.reset(FormHelper.getUIDValue(item.contractItem));
        this.form.controls.budgetAccountUID.reset(FormHelper.getUIDValue(item.budgetAccount));
        this.form.controls.discount.reset(FormHelper.getPositiveNumberValue(item.discount));
        this.form.controls.penaltyDiscount.reset(FormHelper.getPositiveNumberValue(item.penaltyDiscount));
        break;
      }
      case ObjectTypes.PURCHASE: {
        const item = this.item as PayableOrderItem;
        this.form.controls.linkedItemUID.reset(FormHelper.getUIDValue(item.requisitionItem));
        this.form.controls.budgetAccountUID.reset(FormHelper.getUIDValue(item.budgetAccount));
        this.form.controls.discount.reset(FormHelper.getPositiveNumberValue(item.discount));
        this.form.controls.penaltyDiscount.reset(FormHelper.getPositiveNumberValue(item.penaltyDiscount));
        break;
      }
      case ObjectTypes.EXPENSE: {
        const item = this.item as PayableOrderItem;
        this.form.controls.linkedItemUID.reset(FormHelper.getUIDValue(item.requisitionItem));
        this.form.controls.budgetAccountUID.reset(FormHelper.getUIDValue(item.budgetAccount));
        break;
      }
    }
  }


  private validateSetDataList() {
    switch (this.config.type) {
      case ObjectTypes.REQUISITION: {
        const item = this.item as RequisitionOrderItem;
        this.setBudgetsList();
        this.setProductUnitsList(item.productUnit);
        break;
      }
      case ObjectTypes.CONTRACT: {
        const item = this.item as ContractItem;
        this.setAvailableItemsList(ArrayLibrary.insertIfNotExist(this.availableItemsList ?? [], item.requisitionItem, 'uid'));
        this.setProductUnitsList(item.productUnit);
        this.setBudgetsList();
        break;
      }
      case ObjectTypes.CONTRACT_ORDER: {
        const item = this.item as ContractOrderItem;
        const contractItem = isEmpty(item.contractItem) ? null : item.contractItem;
        this.setAvailableItemsList(ArrayLibrary.insertIfNotExist(this.availableItemsList ?? [], contractItem as any, 'uid'));
        this.setProductUnitsList(item.productUnit);
        break;
      }
      case ObjectTypes.EXPENSE:
      case ObjectTypes.PURCHASE: {
        const item = this.item as PayableOrderItem;
        this.setAvailableItemsList(ArrayLibrary.insertIfNotExist(this.availableItemsList ?? [], item.requisitionItem, 'uid'));
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
    if (this.isRequisition || this.isContract) {
      const order = this.order as RequisitionOrder;
      this.budgetsList = order.budgets;
    }
  }


  private setProductUnitsList(productUnit: Identifiable) {
    this.productUnitsList = ArrayLibrary.insertIfNotExist(this.productUnitsList ?? [], productUnit, 'uid');
  }


  private validateGetOrderItemFields(): OrderItemFields {
    switch (this.config.type) {
      case ObjectTypes.REQUISITION:
        return this.getRequisitionOrderItemFields();
      case ObjectTypes.CONTRACT:
        return this.getContractItemFields();
      case ObjectTypes.CONTRACT_ORDER:
        return this.getContractOrderItemFields();
      case ObjectTypes.EXPENSE:
      case ObjectTypes.PURCHASE:
        return this.getPayableOrderItemFields();
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
        originCountryUID: formValues.originCountryUID ?? null,
      }
    };

    return data;
  }


  private getContractItemFields(): ContractItemFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formValues = this.form.getRawValue();

    const data: ContractItemFields = {
      ...this.getOrderItemFields(),
      ...
      {
        requisitionItemUID: formValues.linkedItemUID ?? null,
        budgetUID: formValues.budgetUID ?? null,
        budgetAccountUID: formValues.budgetAccountUID ?? null,
        minQuantity: formValues.minQuantity ?? 0,
        maxQuantity: formValues.maxQuantity ?? 0,
        unitPrice: formValues.unitPrice ?? 0,
      }
    };

    return data;
  }


  private getContractOrderItemFields(): ContractOrderItemFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formValues = this.form.getRawValue();

    const data: ContractOrderItemFields = {
      ...this.getOrderItemFields(),
      ...
      {
        contractItemUID: formValues.linkedItemUID ?? null,
        budgetAccountUID: formValues.budgetAccountUID ?? null,
        discount: formValues.discount ?? 0,
        penaltyDiscount: formValues.penaltyDiscount ?? 0,
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
        requisitionItemUID: formValues.linkedItemUID ?? null,
        budgetAccountUID: formValues.budgetAccountUID ?? null,
        discount: formValues.discount ?? 0,
        penaltyDiscount: formValues.penaltyDiscount ?? 0,
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
      beneficiaryUID: formValues.beneficiaryUID ?? null,
      projectUID: formValues.projectUID ?? '',
      quantity: formValues.quantity ?? 0,
      unitPrice: formValues.unitPrice ?? 0,
      total: formValues.total ?? 0,
      description: formValues.description ?? '',
      justification: formValues.justification ?? '',
      startDate: !formValues.datePeriod.fromDate ? null : formValues.datePeriod.fromDate,
      endDate: !formValues.datePeriod.toDate ? null : formValues.datePeriod.toDate,
    };

    return data;
  }

}
