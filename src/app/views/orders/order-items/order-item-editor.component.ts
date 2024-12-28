/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { ArrayLibrary, FormatLibrary, FormHelper, sendEvent } from '@app/shared/utils';

import { ContractsDataService, ProductsDataService, SearcherAPIS } from '@app/data-services';

import { BudgetAccountsForProductQuery, Order, OrderItem, OrderItemFields, EmptyOrder, EmptyOrderItem,
         ProductSearch, OrderTypeConfig, EmptyOrderTypeConfig, ObjectTypes, PayableOrderItem,
         ContractOrderItem, ContractOrderItemFields, PayableOrderItemFields, PayableOrder, ContractOrder,
         ContractItem } from '@app/models';


export enum OrderItemEditorEventType {
  CLOSE_BUTTON_CLICKED = 'OrderItemEditorComponent.Event.CloseButtonClicked',
  ADD_ITEM             = 'OrderItemEditorComponent.Event.AddItem',
  UPDATE_ITEM          = 'OrderItemEditorComponent.Event.UpdateItem',
}

interface OrderItemFormModel extends FormGroup<{
  contractItemUID: FormControl<string>;
  requestedByUID: FormControl<string>;
  productUID: FormControl<string>;
  budgetAccountUID: FormControl<string>;
  productUnitUID: FormControl<string>;
  unitPrice: FormControl<number>;
  quantity: FormControl<number>;
  discount: FormControl<number>;
  total: FormControl<number>;
  projectUID: FormControl<string>;
  description: FormControl<string>;
}> { }

@Component({
  selector: 'emp-ng-order-item-editor',
  templateUrl: './order-item-editor.component.html',
})
export class OrderItemEditorComponent implements OnChanges, OnInit, OnDestroy {

  @Input() config: OrderTypeConfig = EmptyOrderTypeConfig;

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

  contractItemsList: ContractItem[] = [];

  productUnitsList: Identifiable[] = [];

  budgetAccountsList: Identifiable[] = [];

  productsAPI = SearcherAPIS.products;

  projectsAPI = SearcherAPIS.projects;


  constructor(private uiLayer: PresentationLayer,
              private productsData: ProductsDataService,
              private contractData: ContractsDataService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnInit() {
    this.loadDataLists();
    this.validateLoadContractItems();
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


  get contractItemFieldRequired(): boolean {
    return this.config.orderType === ObjectTypes.CONTRACT_ORDER;
  }


  get payableFieldsRequired(): boolean {
    return [ObjectTypes.PURCHASE_ORDER,
            ObjectTypes.EXPENSE].includes(this.config.orderType);
  }


  get title(): string {
    if (!this.isSaved) return `Agregar concepto`;
    return `${this.canUpdate ? 'Editar' : 'Detalle del '} concepto`;
  }


  get selectionPlaceholder(): string {
    return this.isSaved && !this.canUpdate ? 'No proporcionado' : 'Seleccionar';
  }


  get contractItemPlaceholder(): string {
    return this.contractItemFieldRequired ? 'Seleccione el concepto del contrato' : 'No definido';
  }


  onContractItemChanges(item: ContractItem) {
    if (!isEmpty(item)) {
      this.form.controls.unitPrice.reset(item.unitPrice);
      this.form.controls.productUID.reset(item.product.uid);
      this.form.controls.productUnitUID.reset(item.productUnit.uid);
      this.form.controls.requestedByUID.reset(item.requesterOrgUnit.uid);
      this.form.controls.budgetAccountUID.reset(item.budgetAccount.uid);
    } else {
      this.form.controls.unitPrice.reset();
      this.form.controls.productUID.reset();
      this.form.controls.productUnitUID.reset();
      this.form.controls.requestedByUID.reset();
      this.form.controls.budgetAccountUID.reset();
    }

    this.onTotalChanges();
  }


  onTotalChanges() {
    if (this.payableFieldsRequired || this.contractItemFieldRequired) {
      const rawValues = this.form.getRawValue();

      const quantity = rawValues.quantity ?? 0;
      const unitPrice = rawValues.unitPrice ?? 0;
      const discount = rawValues.discount ?? 0;
      const total = (quantity * unitPrice) - discount;

      this.form.controls.total.reset(total);
    }
  }


  onRequestedByChanges(orgUnit: Identifiable) {
    this.form.controls.budgetAccountUID.reset();
    this.budgetAccountsList = [];
    this.validateSearchBudgetAccounts();
  }


  onProductChanges(product: ProductSearch) {
    this.form.controls.productUnitUID.reset(isEmpty(product.baseUnit) ? null : product.baseUnit.uid);
    this.form.controls.budgetAccountUID.reset(null);
    this.productUnitsList = isEmpty(product.baseUnit) ? [] : [product.baseUnit];
    this.budgetAccountsList = [];

    if (!isEmpty(product)) {
      this.validateSearchBudgetAccounts();
    }
  }


  onCloseButtonClicked() {
    sendEvent(this.orderItemEditorEvent, OrderItemEditorEventType.CLOSE_BUTTON_CLICKED);
  }


  onSubmitButtonClicked() {
    if (FormHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.isSaved ? OrderItemEditorEventType.UPDATE_ITEM :
        OrderItemEditorEventType.ADD_ITEM;

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

    FormHelper.setDisableForm(this.form, !this.canUpdate);
  }


  private validateFieldsRequired() {
    if (!this.isSaved || (this.isSaved && this.canUpdate)) {
      this.validateControlRequired(this.form.controls.contractItemUID, this.contractItemFieldRequired);

      this.validateControlRequired(this.form.controls.productUID, this.payableFieldsRequired);
      this.validateControlRequired(this.form.controls.productUnitUID, this.payableFieldsRequired);
      this.validateControlRequired(this.form.controls.requestedByUID, this.payableFieldsRequired);
      this.validateControlRequired(this.form.controls.budgetAccountUID, this.payableFieldsRequired);
      this.validateControlRequired(this.form.controls.unitPrice, this.payableFieldsRequired);

      FormHelper.setDisableControl(this.form.controls.productUID, this.contractItemFieldRequired);
      FormHelper.setDisableControl(this.form.controls.productUnitUID, this.contractItemFieldRequired);
      FormHelper.setDisableControl(this.form.controls.budgetAccountUID, this.contractItemFieldRequired);
      FormHelper.setDisableControl(this.form.controls.unitPrice, this.contractItemFieldRequired);
      FormHelper.setDisableControl(this.form.controls.requestedByUID, this.contractItemFieldRequired);
      FormHelper.setDisableControl(this.form.controls.projectUID, this.contractItemFieldRequired);
      FormHelper.setDisableControl(this.form.controls.total);
    }
  }


  private validateControlRequired(control, required: boolean) {
    FormHelper.setDisableControl(control, !required);

    if (required) {
      FormHelper.setControlValidators(control, Validators.required);
    } else {
      FormHelper.clearControlValidators(control);
    }
  }


  private loadDataLists() {
    this.isLoading = true;

    this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS,
      { requestsList: this.config.requestsList })
      .firstValue()
      .then(x => this.orgUnitsList = x)
      .finally(() => this.isLoading = false)
  }


  private validateLoadContractItems() {
    if (this.contractItemFieldRequired && !this.isSaved) {
      const contractOrder = this.order as ContractOrder;
      this.getContractItemsToOrder(contractOrder.contract.uid);
    }
  }


  private getContractItemsToOrder(contractUID: string)  {
    this.isLoadingContractItems = true;

    this.contractData.getContractItemsToOrder(contractUID)
      .firstValue()
      .then(x => this.setContratItems(x))
      .finally(() => this.isLoadingContractItems = false);
  }


  private setContratItems(items: ContractItem[]) {
    items.forEach(x => x.name = this.returnContractItemName(x));
    this.contractItemsList = items;
  }


  private returnContractItemName(item: ContractItem): string {
    if (!!item.name) {
      return item.name;
    }

    const total = FormatLibrary.numberWithCommas(item.unitPrice, '1.2-2');

    return `${item.product?.name.toUpperCase()} (${item.productUnit?.name.toUpperCase()}) ` +
           `${item.budgetAccount?.name} | ${item.periodicityType?.name} | ${total}`
  }


  private validateSearchBudgetAccounts(budgetAccountsDefault?: Identifiable) {
    if (this.payableFieldsRequired) {
      const payableOrder = this.order as PayableOrder;

      const budgetTypeUID = payableOrder.budgetType.uid;
      const orgUnitUID = this.form.getRawValue().requestedByUID;
      const productUID = this.form.getRawValue().productUID;

      if (!!budgetTypeUID && !!orgUnitUID && !!productUID) {
        const query: BudgetAccountsForProductQuery = { budgetTypeUID, orgUnitUID, productUID };
        this.searchBudgetAccounts(productUID, query, budgetAccountsDefault);
      } else {
        this.setBudgetAccountsList([], budgetAccountsDefault);
      }
    }
  }


  private searchBudgetAccounts(productUID: string,
                               query: BudgetAccountsForProductQuery,
                               budgetAccountsDefault?: Identifiable) {
    this.isLoadingBudgetAccounts = true;

    this.productsData.searchBudgetAccountsForProduct(productUID, query)
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
      contractItemUID: [''],
      productUID: [''],
      requestedByUID: [''],
      budgetAccountUID: [''],
      productUnitUID: [''],
      unitPrice: [null as number],
      quantity: [null as number, Validators.required],
      discount: [null as number],
      total: [null as number],
      projectUID: [''],
      description: [''],
    });
  }


  private setFormData() {
    setTimeout(() => {
      const payableOrderItem = this.item as PayableOrderItem;
      const quantity = payableOrderItem.quantity >= 0 ? payableOrderItem.quantity : null;
      const discount = payableOrderItem.discount >= 0 ? payableOrderItem.discount : null;
      const total = payableOrderItem.total >= 0 ? payableOrderItem.total : null;

      this.form.reset({
        quantity,
        discount,
        total,

        projectUID: isEmpty(this.item.project) ? null : this.item.project.uid,
        description: this.item.description,
      });

      this.validateSetOrderItemFields();
      this.validateSearchBudgetAccounts(payableOrderItem.budgetAccount ?? null);
      this.validateSetDataList();
    });
  }


  private validateSetOrderItemFields() {
    if (this.contractItemFieldRequired) {
      const contractOrderItem = this.item as ContractOrderItem;
      const contractItemUID = isEmpty(contractOrderItem.contractItem) ? null : contractOrderItem.contractItem.uid;
      this.form.controls.contractItemUID.reset(contractItemUID);
    }

    if (this.payableFieldsRequired || this.contractItemFieldRequired) {
      const payableOrderItem = this.item as PayableOrderItem;
      const unitPrice = payableOrderItem.unitPrice >= 0 ? payableOrderItem.unitPrice : null;
      this.setControlUIDValue(this.form.controls.productUID, payableOrderItem.product);
      this.setControlUIDValue(this.form.controls.productUnitUID, payableOrderItem.productUnit);
      this.setControlUIDValue(this.form.controls.requestedByUID, payableOrderItem.requestedBy);
      this.setControlUIDValue(this.form.controls.budgetAccountUID, payableOrderItem.budgetAccount);
      this.form.controls.unitPrice.reset(unitPrice);
    }
  }


  private validateSetDataList() {
    if (this.contractItemFieldRequired) {
      const contractOrderItem = this.item as ContractOrderItem;
      const contractItem = isEmpty(contractOrderItem.contractItem) ? null : contractOrderItem.contractItem;
      this.setContratItems(ArrayLibrary.insertIfNotExist(this.contractItemsList ?? [], contractItem, 'uid'));
    }

    if (this.payableFieldsRequired || this.contractItemFieldRequired) {
      const payableOrderItem = this.item as PayableOrderItem;
      this.productUnitsList =
        ArrayLibrary.insertIfNotExist(this.productUnitsList ?? [], payableOrderItem.productUnit, 'uid');
    }
  }


  private setControlUIDValue(control: FormControl<any>, value: Identifiable) {
    control.reset(isEmpty(value) ? null : value.uid);
  }


  private validateGetOrderItemFields(): OrderItemFields {
    switch (this.config.orderType) {
      case ObjectTypes.CONTRACT_ORDER:
      case ObjectTypes.PURCHASE_ORDER:
      case ObjectTypes.EXPENSE:
        if (this.contractItemFieldRequired) return this.getContractOrderItemFields();
        if (this.payableFieldsRequired) return this.getPayableOrderItemFields();
        return this.getOrderItemFields();
      default:
        throw Assertion.assertNoReachThisCode(`Unhandled order type: ${this.config.orderType}.`);
    }
  }


  private getContractOrderItemFields(): ContractOrderItemFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const data: ContractOrderItemFields = {
      ...this.getPayableOrderItemFields(),
      ...
      {
        contractItemUID: this.form.getRawValue().contractItemUID ?? null,
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
        unitPrice: formValues.unitPrice ?? 0,
        discount: formValues.discount ?? 0,
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
      description: formValues.description ?? '',
    };

    return data;
  }

}
