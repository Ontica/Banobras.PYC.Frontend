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
         OrderExplorerTypeConfig, EmptyOrderExplorerTypeConfig, ObjectTypes, PayableOrder, PayableOrderFields,
         BudgetType, ContractOrder, ContractOrderFields, Contract, RequisitionOrderFields,
         RequisitionOrder } from '@app/models';


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
  justification: FormControl<string>;
  budgetTypeUID: FormControl<string>;
  budgetUID: FormControl<string>;
  budgets: FormControl<string[]>;
  currencyUID: FormControl<string>;
  contractUID: FormControl<string>;
}> { }

@Component({
  selector: 'emp-ng-order-header',
  templateUrl: './order-header.component.html',
})
export class OrderHeaderComponent implements OnChanges, OnDestroy {

  @Input() config: OrderExplorerTypeConfig<ObjectTypes> = EmptyOrderExplorerTypeConfig;

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
    return [ObjectTypes.CONTRACT_ORDER].includes(this.config.type);
  }


  get payableFieldsRequired(): boolean {
    return [ObjectTypes.EXPENSE,
            ObjectTypes.PURCHASE_ORDER].includes(this.config.type);
  }


  get requisitionFieldsRequired(): boolean {
    return [ObjectTypes.REQUISITION].includes(this.config.type);
  }


  get budgetPlaceholder(): string {
    if (this.isSaved && !this.editionMode) {
      return 'No determinado';
    }

    if (this.contractFieldsRequired) {
      return this.form.controls.contractUID.invalid ? 'Seleccione contrato' : 'Seleccionar'
    } else {
      return this.form.controls.budgetTypeUID.invalid ? 'Seleccione tipo de presupuesto' : 'Seleccionar'
    }
  }


  onContractChanges(item: Contract) {
    this.form.controls.budgetTypeUID.reset(FormHelper.getUIDValueValid(item?.budgetType));
    this.form.controls.currencyUID.reset(FormHelper.getUIDValueValid(item?.currency));
    this.form.controls.budgetUID.reset();
    this.form.controls.budgets.reset();
    this.budgetsList = item?.budgets ?? [];
  }


  onBudgetTypeChanged(budgetType: BudgetType) {
    this.form.controls.budgetUID.reset();
    this.form.controls.budgets.reset();
    this.budgetsList = budgetType?.budgets ?? [];
  }


  onProviderChanges(provider: Identifiable) {
    this.form.controls.contractUID.reset();
    this.validateGetContracts();
  }


  onSubmitButtonClicked() {
    if (FormHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.isSaved ? OrderHeaderEventType.UPDATE : OrderHeaderEventType.CREATE;
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
      this.ordersData.getOrderCategories(this.config.type),
      this.helper.select<BudgetType[]>(BudgetingStateSelector.BUDGET_TYPES),
      this.helper.select<Identifiable[]>(CataloguesStateSelector.CURRENCIES),
    ])
    .subscribe(([a, b, c, d]) => {
      this.orgUnitsList = a;
      this.categoriesList = b;
      this.budgetTypesList = c;
      this.currenciesList = d;
      this.validateInitDataList();
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
      priority: [null],
      requestedByUID: ['', Validators.required],
      responsibleUID: [''],
      beneficiaryUID: [''],
      providerUID: [''],
      isForMultipleBeneficiaries: [false],
      projectUID: [''],
      identificators: [null],
      tags: [null],
      description: ['', Validators.required],
      justification: [''],
      budgetTypeUID: [''],
      budgetUID: [''],
      budgets: [null],
      currencyUID: [''],
      contractUID: [''],
    });
  }


  private setFormData() {
    setTimeout(() => {
      this.form.reset({
        categoryUID: FormHelper.getUIDValueValid(this.order.category),
        priority: FormHelper.getUIDValueValid(this.order.priority) as Priority,
        responsibleUID: FormHelper.getUIDValueValid(this.order.responsible),
        requestedByUID: FormHelper.getUIDValueValid(this.order.requestedBy),
        beneficiaryUID: FormHelper.getUIDValueValid(this.order.beneficiary),
        providerUID: FormHelper.getUIDValueValid(this.order.provider),
        projectUID: FormHelper.getUIDValueValid(this.order.project),
        isForMultipleBeneficiaries: this.order.isForMultipleBeneficiaries,
        identificators: this.order.identificators ?? null,
        tags: this.order.tags ?? null,
        description: this.order.description ?? null,
        justification: this.order.justification ?? null,
      });

      this.validateSetOrderFields();
      this.validateSetDataLists();
    });
  }


  private validateSetOrderFields() {
    switch (this.config.type) {
      case ObjectTypes.CONTRACT_ORDER: {
        const order = this.order as ContractOrder;
        const contract = isEmpty(order.contract) ? null : order.contract;
        this.form.controls.contractUID.reset(FormHelper.getUIDValueValid(contract));
        this.form.controls.budgetTypeUID.reset(FormHelper.getUIDValueValid(order.budgetType));
        this.form.controls.budgetUID.reset(FormHelper.getUIDValueValid(order.budget));
        this.form.controls.currencyUID.reset(FormHelper.getUIDValueValid(order.currency));
        break;
      }
      case ObjectTypes.EXPENSE:
      case ObjectTypes.PURCHASE_ORDER: {
        const order = this.order as PayableOrder;
        this.form.controls.budgetTypeUID.reset(FormHelper.getUIDValueValid(order.budgetType));
        this.form.controls.budgetUID.reset(FormHelper.getUIDValueValid(order.budget));
        this.form.controls.currencyUID.reset(FormHelper.getUIDValueValid(order.currency));
        break;
      }
      case ObjectTypes.REQUISITION: {
        const order = this.order as RequisitionOrder;
        this.form.controls.budgetTypeUID.reset(FormHelper.getUIDValueValid(order.budgetType));
        this.form.controls.budgets.reset(order.budgets?.map(x => x.uid) ?? []);
        break;
      }
    }
  }


  private validateFieldsRequired() {
    this.validateFieldRequired(this.form.controls.priority, !this.requisitionFieldsRequired);
    this.validateFieldRequired(this.form.controls.providerUID, !this.requisitionFieldsRequired);
    this.validateFieldRequired(this.form.controls.contractUID, this.contractFieldsRequired);
    this.validateFieldRequired(this.form.controls.budgetTypeUID, this.payableFieldsRequired || this.requisitionFieldsRequired);
    this.validateFieldRequired(this.form.controls.budgetUID, this.payableFieldsRequired || this.contractFieldsRequired);
    this.validateFieldRequired(this.form.controls.budgets, this.requisitionFieldsRequired);
    this.validateFieldRequired(this.form.controls.currencyUID, this.payableFieldsRequired);

    this.validateFormDisabled();

    setTimeout(() => {
      FormHelper.markControlsAsUntouched(this.form.controls.contractUID);
      FormHelper.markControlsAsUntouched(this.form.controls.providerUID);
    });
  }


  private validateFieldRequired(control: FormControl<any>, required: boolean) {
    if (required) FormHelper.setControlValidators(control, [Validators.required]);
    else FormHelper.clearControlValidators(control);
  }


  private validateFormDisabled() {
    const disable = this.isSaved && (!this.editionMode || !this.actions.canUpdate);
    FormHelper.setDisableForm(this.form, disable);
  }


  private validateGetOrderFields(): OrderFields {
    switch (this.config.type) {
      case ObjectTypes.CONTRACT_ORDER:
        return this.getContractOrderFields();
      case ObjectTypes.EXPENSE:
      case ObjectTypes.PURCHASE_ORDER:
        return this.getPayableOrderFields();
      case ObjectTypes.REQUISITION:
        return this.getRequisitionOrderFields();
      default:
        return this.getOrderFields();
    }
  }


  private validateSetDataLists() {
    this.validateInitDataList();
    this.validateGetContracts(true);
    this.validateSetBudgetsList();
  }


  private validateInitDataList() {
    if (this.isSaved) {
      this.categoriesList = ArrayLibrary.insertIfNotExist(this.categoriesList ?? [], this.order.category, 'uid');
      this.orgUnitsList = ArrayLibrary.insertIfNotExist(this.orgUnitsList ?? [], this.order.requestedBy, 'uid');
      this.orgUnitsList = ArrayLibrary.insertIfNotExist(this.orgUnitsList ?? [], this.order.beneficiary, 'uid');
      this.orgUnitsList = ArrayLibrary.insertIfNotExist(this.orgUnitsList ?? [], this.order.responsible, 'uid');
    }
  }


  private validateGetContracts(initData: boolean = false) {
    if (this.contractFieldsRequired && !!this.form.value.providerUID) {
      this.getContracts(this.form.value.providerUID, initData);
    } else {
      this.contractsList = [];
    }
  }


  private validateSetBudgetsList() {
    if (!this.isSaved) {
      return;
    }

    if (this.contractFieldsRequired) {
      const order = this.order as ContractOrder;
      this.budgetsList = order?.contract.budgets ?? [];
    }

    if (this.payableFieldsRequired || this.requisitionFieldsRequired) {
      const order = this.order as PayableOrder | RequisitionOrder;
      const budgetType = this.budgetTypesList.find(x => x.uid === order.budgetType?.uid) ?? order.budgetType as BudgetType;
      this.budgetTypesList = ArrayLibrary.insertIfNotExist(this.budgetTypesList ?? [], budgetType, 'uid');
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


  private getRequisitionOrderFields(): RequisitionOrderFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formValues = this.form.getRawValue();

    const data: RequisitionOrderFields = {
      ...this.getOrderFields(),
      ...
      {
        budgets: formValues.budgets ?? [],
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
      orderTypeUID: this.config.type,
      categoryUID: formValues.categoryUID ?? null,
      description: formValues.description ?? null,
      justification: formValues.justification ?? null,
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
      case OrderHeaderEventType.DELETE: return `Eliminar ${this.config.nameSingular}`;
      case OrderHeaderEventType.SUSPEND: return `Suspender ${this.config.nameSingular}`;
      case OrderHeaderEventType.ACTIVATE: return `Reactivar ${this.config.nameSingular}`;
      default: return '';
    }
  }


  private getConfirmMessage(eventType: OrderHeaderEventType): string {
    const orderTypeName = `${this.config.pronounSingular} ${this.config.nameSingular}`;
    const orderNo = !this.order.orderNo ? '' : `${this.order.orderNo}: `;
    const provider = isEmpty(this.order.provider) ? '' :
      ` del proveedor <strong>${this.order.provider.name}</strong>`;

    switch (eventType) {
      case OrderHeaderEventType.DELETE:
        return `Esta operación eliminará ${orderTypeName} <strong>${orderNo}</strong>
                (${this.order.category.name})${provider}.
                <br><br>¿Elimino ${orderTypeName}?`;

      case OrderHeaderEventType.SUSPEND:
        return `Esta operación suspenderá ${orderTypeName} <strong>${orderNo}</strong>
                (${this.order.category.name})${provider}.
                <br><br>¿Suspendo ${orderTypeName}?`;

      case OrderHeaderEventType.ACTIVATE:
        return `Esta operación reactivará ${orderTypeName} <strong>${orderNo}</strong>
                (${this.order.category.name})${provider}.
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
