/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { combineLatest } from 'rxjs';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { BudgetingStateSelector,
         CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { ArrayLibrary, FormHelper, sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { OrdersDataService, SearcherAPIS, SuppliersDataService } from '@app/data-services';

import { OrderActions, Order, OrderFields, EmptyOrderActions, EmptyOrder, Priority, PriorityList,
         OrderTypeConfig, EmptyOrderTypeConfig, ObjectTypes, PayableOrder, PayableOrderFields, BudgetType,
         ContractOrder, ContractOrderFields, Contract } from '@app/models';


export enum OrderHeaderEventType {
  CREATE   = 'OrderHeaderComponent.Event.CreateOrder',
  UPDATE   = 'OrderHeaderComponent.Event.UpdateOrder',
  DELETE   = 'OrderHeaderComponent.Event.DeleteOrder',
  ACTIVATE = 'OrderHeaderComponent.Event.ActivateOrder',
  SUSPEND  = 'OrderHeaderComponent.Event.SuspendOrder',
}

interface OrderFormModel extends FormGroup<{
  categoryUID: FormControl<string>;
  priority: FormControl<Priority>;
  responsibleUID: FormControl<string>;
  requestedByUID: FormControl<string>;
  beneficiaryUID: FormControl<string>;
  providerUID: FormControl<string>;
  isForMultipleBeneficiaries: FormControl<boolean>;
  projectUID: FormControl<string>;
  identificators: FormControl<string[]>;
  tags: FormControl<string[]>;
  description: FormControl<string>;
  budgetTypeUID: FormControl<string>;
  budgetUID: FormControl<string>;
  currencyUID: FormControl<string>;
  contractUID: FormControl<string>;
}> { }

@Component({
  selector: 'emp-ng-order-header',
  templateUrl: './order-header.component.html',
})
export class OrderHeaderComponent implements OnChanges, OnDestroy {

  @Input() config: OrderTypeConfig = EmptyOrderTypeConfig;

  @Input() isSaved = false;

  @Input() order: Order = EmptyOrder;

  @Input() actions: OrderActions = EmptyOrderActions;

  @Output() orderHeaderEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: OrderFormModel;

  formHelper = FormHelper;

  eventTypes = OrderHeaderEventType;

  editionMode = false;

  isLoading = false;

  isContractsLoading = false;

  orgUnitsList: Identifiable[] = [];

  categoriesList: Identifiable[] = [];

  prioritiesList: Identifiable[] = PriorityList;

  budgetTypesList: BudgetType[] = [];

  budgetsList: Identifiable[] = [];

  currenciesList: Identifiable[] = [];

  contractsList: Contract[] = [];

  providersAPI = SearcherAPIS.suppliers;

  projectsAPI = SearcherAPIS.projects;

  Priority = Priority;


  constructor(private uiLayer: PresentationLayer,
              private ordersData: OrdersDataService,
              private suppliersData: SuppliersDataService,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
    this.enableEditor(true);
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.config) {
      this.loadDataLists();
    }

    if (changes.order && this.isSaved) {
      this.enableEditor(false);
    }

    this.validateFieldsRequired();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get hasActions(): boolean {
    return this.actions.canUpdate || this.actions.canDelete ||
           this.actions.canActivate || this.actions.canSuspend;
  }


  get contractFieldsRequired(): boolean {
    return this.config.orderType === ObjectTypes.CONTRACT_ORDER;
  }


  get payableFieldsRequired(): boolean {
    return [ObjectTypes.PURCHASE_ORDER,
            ObjectTypes.EXPENSE].includes(this.config.orderType);
  }


  get budgetPlaceholder(): string {
    if (this.contractFieldsRequired) {
      return this.form.controls.contractUID.invalid ? 'Seleccione el contrato' : 'Seleccionar'
    } else {
      return this.form.controls.budgetTypeUID.invalid ? 'Seleccione el tipo de presupuesto' : 'Seleccionar'
    }
  }


  onContractChanges(item: Contract) {
    if (!isEmpty(item)) {
      this.form.controls.budgetTypeUID.reset(item.budgetType.uid ?? null);
      this.form.controls.currencyUID.reset(item.currency.uid ?? null);
    } else {
      this.form.controls.budgetTypeUID.reset();
      this.form.controls.currencyUID.reset();
    }

    const budgetType = this.budgetTypesList.find(x => x.uid === item.budgetType.uid) ?? null;
    this.onBudgetTypeChanged(budgetType);
  }


  onBudgetTypeChanged(budgetType: BudgetType) {
    this.form.controls.budgetUID.reset();
    this.budgetsList = budgetType?.budgets ?? [];
  }


  onProviderChanges(provider: Identifiable) {
    this.form.controls.contractUID.reset();
    this.validateGetContracts();
  }


  onSubmitButtonClicked() {
    if (FormHelper.isFormReadyAndInvalidate(this.form)) {
      let eventType = OrderHeaderEventType.CREATE;

      if (this.isSaved) {
        eventType = OrderHeaderEventType.UPDATE;
      }

      sendEvent(this.orderHeaderEvent, eventType, { dataFields: this.validateGetOrderFields() });
    }
  }


  onEventButtonClicked(eventType: OrderHeaderEventType) {
    this.showConfirmMessage(eventType);
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;

    if (!this.editionMode && this.isSaved) {
      this.setFormData();
    }

    this.validateFormDisabled();
  }


  private loadDataLists() {
    if (!this.config.requestsList) {
      this.orgUnitsList = [];
      return;
    }

    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS,
        { requestsList: this.config.requestsList }),
      this.ordersData.getOrderCategories(this.config.orderType),
      this.helper.select<BudgetType[]>(BudgetingStateSelector.BUDGET_TYPES),
      this.helper.select<Identifiable[]>(CataloguesStateSelector.CURRENCIES),
    ])
    .subscribe(([a, b, c, d]) => {
      this.orgUnitsList = a;
      this.categoriesList = b;
      this.budgetTypesList = c;
      this.currenciesList = d;
      this.validateSetBudgetsList();
      this.isLoading = false;
    });
  }


  private getContracts(providerUID: string, initData: boolean = false) {
    this.isContractsLoading = true;
    this.suppliersData.getSupplierContractsToOrder(providerUID)
      .firstValue()
      .then(x => this.setContractsList(x, initData))
      .finally(() => this.isContractsLoading = false);
  }


  private setContractsList(data: Contract[], initData: boolean = false) {
    if (initData) {
      const contractOrder = this.order as ContractOrder;
      const contract = isEmpty(contractOrder.contract) ? null : contractOrder.contract;
      this.contractsList = ArrayLibrary.insertIfNotExist(data, contract, 'uid');
      return;
    }

    this.contractsList = data;
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      categoryUID: ['', Validators.required],
      priority: [null as Priority, Validators.required],
      responsibleUID: ['', Validators.required],
      requestedByUID: ['', Validators.required],
      beneficiaryUID: ['', Validators.required],
      providerUID: ['', Validators.required],
      isForMultipleBeneficiaries: [false],
      projectUID: [''],
      identificators: [null],
      tags: [null],
      description: ['', Validators.required],
      budgetTypeUID: [''],
      budgetUID: [''],
      currencyUID: [''],
      contractUID: [''],
    });
  }


  private setFormData() {
    setTimeout(() => {
      this.form.reset({
        categoryUID: isEmpty(this.order.category) ? null : this.order.category.uid,
        priority: isEmpty(this.order.priority) ? null : this.order.priority.uid as Priority,
        responsibleUID: isEmpty(this.order.responsible) ? null : this.order.responsible.uid,
        requestedByUID: isEmpty(this.order.requestedBy) ? null : this.order.requestedBy.uid,
        beneficiaryUID: isEmpty(this.order.beneficiary) ? null : this.order.beneficiary.uid,
        providerUID: isEmpty(this.order.provider) ? null : this.order.provider.uid,
        isForMultipleBeneficiaries: this.order.isForMultipleBeneficiaries,
        projectUID: isEmpty(this.order.project) ? null : this.order.project.uid,
        identificators: this.order.identificators ?? null,
        tags: this.order.tags ?? null,
        description: this.order.description ?? null,
      });

      this.validateSetOrderFields();
      this.validateSetDataLists();
    });
  }


  private validateSetOrderFields() {
    if (this.contractFieldsRequired) {
      const contractOrder = this.order as ContractOrder;
      const contract = isEmpty(contractOrder.contract) ? null : contractOrder.contract;
      this.setControlUIDValue(this.form.controls.contractUID, contract);
    }

    if (this.payableFieldsRequired || this.contractFieldsRequired) {
      const payableOrder = this.order as PayableOrder;
      this.setControlUIDValue(this.form.controls.budgetTypeUID, payableOrder.budgetType);
      this.setControlUIDValue(this.form.controls.budgetUID, payableOrder.budget);
      this.setControlUIDValue(this.form.controls.currencyUID, payableOrder.currency);
    }
  }


  private setControlUIDValue(control: FormControl<any>, value: Identifiable) {
    control.reset(isEmpty(value) ? null : value.uid);
  }


  private validateFieldsRequired() {
    this.validateFieldRequired(this.form.controls.contractUID, this.contractFieldsRequired);

    this.validateFieldRequired(this.form.controls.budgetTypeUID, this.payableFieldsRequired);
    this.validateFieldRequired(this.form.controls.budgetUID, this.payableFieldsRequired || this.contractFieldsRequired);
    this.validateFieldRequired(this.form.controls.currencyUID, this.payableFieldsRequired);

    this.validateFormDisabled();

    setTimeout(() => {
      FormHelper.markControlsAsUntouched(this.form.controls.contractUID);
      FormHelper.markControlsAsUntouched(this.form.controls.providerUID);
    });
  }


  private validateFieldRequired(control: FormControl<any>, required: boolean) {
    if (required) {
      FormHelper.setControlValidators(control, [Validators.required]);
    } else {
      FormHelper.clearControlValidators(control);
    }
  }


  private validateFormDisabled() {
    const disable = this.isSaved && (!this.editionMode || !this.actions.canUpdate);
    FormHelper.setDisableForm(this.form, disable);
    FormHelper.setDisableControl(this.form.controls.budgetTypeUID, disable || this.contractFieldsRequired);
    FormHelper.setDisableControl(this.form.controls.currencyUID, disable || this.contractFieldsRequired);
  }


  private validateGetOrderFields(): OrderFields {
    switch (this.config.orderType) {
      case ObjectTypes.CONTRACT_ORDER:
        return this.getContractOrderFields();
      case ObjectTypes.PURCHASE_ORDER:
      case ObjectTypes.EXPENSE:
        return this.getPayableOrderFields();
      default:
        return this.getOrderFields();
    }
  }


  private validateSetDataLists() {
    this.validateGetContracts(true);
    this.validateSetBudgetsList();
  }


  private validateGetContracts(initData: boolean = false) {
    if (this.contractFieldsRequired && !!this.form.value.providerUID) {
      this.getContracts(this.form.value.providerUID, initData);
    } else {
      this.contractsList = [];
    }
  }


  private validateSetBudgetsList() {
    if (this.isSaved && (this.payableFieldsRequired || this.contractFieldsRequired)) {
      const payableOrder = this.order as PayableOrder;
      const budgetType = this.budgetTypesList.find(x => x.uid === payableOrder.budgetType?.uid);
      this.budgetsList = budgetType?.budgets ?? [];
    }
  }


  private getContractOrderFields(): ContractOrderFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formValues = this.form.getRawValue();

    const data: ContractOrderFields = {
      ...this.getPayableOrderFields(),
      ...
      {
        contractUID: formValues.contractUID ?? null,
      }
    };

    return data;
  }


  private getPayableOrderFields(): PayableOrderFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formValues = this.form.getRawValue();

    const data: PayableOrderFields = {
      ...this.getOrderFields(),
      ...
      {
        budgetUID: formValues.budgetUID ?? null,
        currencyUID: formValues.currencyUID ?? null,
      }
    };

    return data;
  }


  private getOrderFields(): OrderFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formValues = this.form.getRawValue();

    const data: OrderFields = {
      orderTypeUID: this.config.orderType,
      categoryUID: formValues.categoryUID ?? null,
      description: formValues.description ?? null,
      identificators: formValues.identificators ?? [],
      tags: formValues.tags ?? [],
      responsibleUID: formValues.responsibleUID ?? null,
      beneficiaryUID: formValues.beneficiaryUID ?? null,
      isForMultipleBeneficiaries: formValues.isForMultipleBeneficiaries,
      providerUID: formValues.providerUID ?? null,
      requestedByUID: formValues.requestedByUID ?? null,
      projectUID: formValues.projectUID ?? null,
      priority: formValues.priority ?? null,
    };

    return data;
  }


  private showConfirmMessage(eventType: OrderHeaderEventType) {
    const confirmType = this.getConfirmType(eventType);
    const title = this.getConfirmTitle(eventType);
    const message = this.getConfirmMessage(eventType);

    this.messageBox.confirm(message, title, confirmType)
      .firstValue()
      .then(x => this.validateAndSendEvent(eventType, x));
  }


  private getConfirmType(eventType: OrderHeaderEventType): 'AcceptCancel' | 'DeleteCancel' {
    switch (eventType) {
      case OrderHeaderEventType.DELETE:
      case OrderHeaderEventType.SUSPEND:
        return 'DeleteCancel';
      case OrderHeaderEventType.ACTIVATE:
      default:
        return 'AcceptCancel';
    }
  }


  private getConfirmTitle(eventType: OrderHeaderEventType): string {
    switch (eventType) {
      case OrderHeaderEventType.DELETE: return `Eliminar ${this.config.orderNameSingular}`;
      case OrderHeaderEventType.SUSPEND: return `Suspender ${this.config.orderNameSingular}`;
      case OrderHeaderEventType.ACTIVATE: return `Reactivar ${this.config.orderNameSingular}`;
      default: return '';
    }
  }


  private getConfirmMessage(eventType: OrderHeaderEventType): string {
    const orderTypeName = `${this.config.orderPronounSingular} ${this.config.orderNameSingular}`;
    const orderNo = !this.order.orderNo ? '' : `${this.order.orderNo}: `;
    const provider = isEmpty(this.order.provider) ? '' :
      `del proveedor <strong>${this.order.provider.name}</strong>`;

    switch (eventType) {
      case OrderHeaderEventType.DELETE:
        return `Esta operación eliminará ${orderTypeName} <strong>${orderNo}</strong>
                (${this.order.category.name}) ${provider}.
                <br><br>¿Elimino ${orderTypeName}?`;

      case OrderHeaderEventType.SUSPEND:
        return `Esta operación suspenderá ${orderTypeName} <strong>${orderNo}</strong>
                (${this.order.category.name}) ${provider}.
                <br><br>¿Suspendo ${orderTypeName}?`;

      case OrderHeaderEventType.ACTIVATE:
        return `Esta operación reactivará ${orderTypeName} <strong>${orderNo}</strong>
                (${this.order.category.name}) ${provider}.
                <br><br>¿Reactivo ${orderTypeName}?`;

      default: return '';
    }
  }


  private validateAndSendEvent(eventType: OrderHeaderEventType, send: boolean) {
    if (send) {
      sendEvent(this.orderHeaderEvent, eventType, { orderUID: this.order.uid });
    }
  }

}
