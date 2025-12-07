/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { combineLatest } from 'rxjs';

import { Assertion, DateString, EventInfo, Identifiable, Validate, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { BudgetingStateSelector,
         CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { ArrayLibrary, FormHelper, sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { OrdersDataService, SearcherAPIS } from '@app/data-services';

import { OrderActions, Order, OrderFields, EmptyOrderActions, EmptyOrder, Priority, PriorityList,
         OrderExplorerTypeConfig, EmptyOrderExplorerTypeConfig, ObjectTypes, PayableOrder, PayableOrderFields,
         BudgetType, ContractOrder, ContractOrderFields, Contract, RequisitionOrderFields, RequisitionOrder,
         OrderForEdition, DateRange, EmptyDateRange, ContractFields } from '@app/models';


export enum OrderHeaderEventType {
  CREATE   = 'OrderHeaderComponent.Event.CreateOrder',
  UPDATE   = 'OrderHeaderComponent.Event.UpdateOrder',
  DELETE   = 'OrderHeaderComponent.Event.DeleteOrder',
  ACTIVATE = 'OrderHeaderComponent.Event.ActivateOrder',
  SUSPEND  = 'OrderHeaderComponent.Event.SuspendOrder',
}

interface OrderFormModel extends FormGroup<{
  requestedByUID: FormControl<string>;
  linkedOrderUID: FormControl<string>;
  categoryUID: FormControl<string>;
  contractNo: FormControl<string>;
  name: FormControl<string>;
  datePeriod: FormControl<DateRange>;
  signDate: FormControl<DateString>;
  estimatedMonths: FormControl<number>;
  priority: FormControl<Priority>;
  responsibleUID: FormControl<string>;
  beneficiaryUID: FormControl<string>;
  providerUID: FormControl<string>;
  isForMultipleBeneficiaries: FormControl<boolean>;
  projectUID: FormControl<string>;
  budgetTypeUID: FormControl<string>;
  budgetUID: FormControl<string>;
  budgets: FormControl<string[]>;
  currencyUID: FormControl<string>;
  identificators: FormControl<string[]>;
  tags: FormControl<string[]>;
  description: FormControl<string>;
  justification: FormControl<string>;
  observations: FormControl<string>;
  guaranteeNotes: FormControl<string>;
  penaltyNotes: FormControl<string>;
  deliveryNotes: FormControl<string>;
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

  orgUnitsList: Identifiable[] = [];

  categoriesList: Identifiable[] = [];

  prioritiesList: Identifiable[] = PriorityList;

  budgetTypesList: BudgetType[] = [];

  budgetsList: Identifiable[] = [];

  currenciesList: Identifiable[] = [];

  providersAPI = SearcherAPIS.provider;

  projectsAPI = SearcherAPIS.projects;

  requisitionsAPI = SearcherAPIS.requisitions;

  Priority = Priority;


  constructor(private uiLayer: PresentationLayer,
              private ordersData: OrdersDataService,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
    this.enableEditor(true);
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.config && !!this.config.requestsList) {
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


  get budgetPlaceholder(): string {
    if (this.isSaved && !this.editionMode) {
      return 'No determinado';
    }

    switch (this.config.type) {
      case ObjectTypes.CONTRACT_ORDER:
        return !this.form.value.linkedOrderUID ? 'Seleccione contrato' : 'Seleccionar'
      case ObjectTypes.CONTRACT:
      case ObjectTypes.EXPENSE:
      case ObjectTypes.PURCHASE:
        return !this.form.value.linkedOrderUID ? 'Seleccione requisición' : 'Seleccionar'
      case ObjectTypes.REQUISITION:
        return !this.form.value.budgetTypeUID ? 'Seleccione tipo de presupuesto' : 'Seleccionar'
      default:
        return 'Seleccionar';
    }
  }


  get orderLinked(): OrderForEdition {
    switch (this.config.type) {
      case ObjectTypes.CONTRACT:
        return (this.order as Contract).requisition ?? null;
      case ObjectTypes.CONTRACT_ORDER:
        return (this.order as ContractOrder).contract ?? null;
      case ObjectTypes.EXPENSE:
      case ObjectTypes.PURCHASE:
        return (this.order as PayableOrder).requisition ?? null;
      case ObjectTypes.REQUISITION:
      default:
        return null;
    }
  }


  onRequestedByChanges(item: Identifiable) {
    this.validateLinkedOrderFieldDisabled();
  }


  onRequisitionChanges(item: OrderForEdition) {
    this.form.controls.budgetUID.reset();
    this.form.controls.budgets.reset();
    this.budgetsList = item?.budgets ?? [];
  }


  onBudgetTypeChanged(budgetType: BudgetType) {
    this.form.controls.budgetUID.reset();
    this.form.controls.budgets.reset();
    this.budgetsList = budgetType?.budgets ?? [];
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
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS, { requestsList: this.config.requestsList }),
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


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      requestedByUID: ['', Validators.required],
      linkedOrderUID: [''],
      categoryUID: [''],
      contractNo: [''],
      name: ['', Validators.required],
      datePeriod: [EmptyDateRange],
      signDate: [null],
      estimatedMonths: [null],
      priority: [null],
      responsibleUID: [''],
      beneficiaryUID: [''],
      providerUID: [''],
      isForMultipleBeneficiaries: [false],
      projectUID: [''],
      budgetTypeUID: [''],
      budgetUID: [''],
      budgets: [null],
      currencyUID: [''],
      identificators: [null],
      tags: [null],
      description: [''],
      justification: [''],
      observations: [''],
      guaranteeNotes: [''],
      penaltyNotes: [''],
      deliveryNotes: [''],
    });
  }


  private setFormData() {
    setTimeout(() => {
      this.form.reset({
        categoryUID: FormHelper.getUIDValueValid(this.order.category),
        name: this.order.name ?? null,
        datePeriod: { fromDate: this.order.startDate ?? null, toDate: this.order.endDate ?? null },
        priority: FormHelper.getUIDValueValid(this.order.priority) as Priority,
        responsibleUID: FormHelper.getUIDValueValid(this.order.responsible),
        requestedByUID: FormHelper.getUIDValueValid(this.order.requestedBy),
        beneficiaryUID: FormHelper.getUIDValueValid(this.order.beneficiary),
        providerUID: FormHelper.getUIDValueValid(this.order.provider),
        projectUID: FormHelper.getUIDValueValid(this.order.project),
        currencyUID: FormHelper.getUIDValueValid(this.order.currency),
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
      case ObjectTypes.CONTRACT: {
        const order = this.order as Contract;
        this.form.controls.linkedOrderUID.reset(FormHelper.getUIDValueValid(order.requisition));
        this.form.controls.budgets.reset(order.budgets?.map(x => x.uid) ?? []);
        this.form.controls.signDate.reset(order.signDate);
        this.form.controls.contractNo.reset(order.contractNo);
        break;
      }
      case ObjectTypes.CONTRACT_ORDER: {
        const order = this.order as ContractOrder;
        const contract = isEmpty(order.contract) ? null : order.contract;
        this.form.controls.linkedOrderUID.reset(FormHelper.getUIDValueValid(contract));
        this.form.controls.budgetUID.reset(FormHelper.getUIDValueValid(order.budget));
        break;
      }
      case ObjectTypes.EXPENSE:
      case ObjectTypes.PURCHASE: {
        const order = this.order as PayableOrder;
        this.form.controls.linkedOrderUID.reset(FormHelper.getUIDValueValid(order.requisition));
        this.form.controls.budgetUID.reset(FormHelper.getUIDValueValid(order.budget));
        break;
      }
      case ObjectTypes.REQUISITION: {
        const order = this.order as RequisitionOrder;
        this.form.controls.budgetTypeUID.reset(FormHelper.getUIDValueValid(order.budgetType));
        this.form.controls.budgets.reset(order.budgets?.map(x => x.uid) ?? []);
        this.form.controls.estimatedMonths.reset(FormHelper.getNumberValueValid(order.estimatedMonths));
        this.form.controls.observations.reset(order.observations);
        this.form.controls.guaranteeNotes.reset(order.guaranteeNotes);
        this.form.controls.penaltyNotes.reset(order.penaltyNotes);
        this.form.controls.deliveryNotes.reset(order.deliveryNotes);
        break;
      }
    }
  }


  private validateFieldsRequired() {
    const controls = this.form.controls;

    this.validateControlRequired(controls.linkedOrderUID, this.isContract || this.isContractOrder || this.isPurchase || this.isExpense);
    this.validateControlRequired(controls.categoryUID, this.isRequisition || this.isContract || this.isExpense);
    this.validateControlRequired(controls.budgetTypeUID, this.isRequisition);
    this.validateControlRequired(controls.budgetUID, this.isContractOrder || this.isPurchase || this.isExpense);
    this.validateControlRequired(controls.budgets, this.isRequisition || this.isContract);
    this.validateControlRequired(controls.providerUID, this.isContract || this.isPurchase);
    this.validateControlRequired(controls.currencyUID, this.isContract || this.isPurchase || this.isExpense);
    this.validateControlRequired(controls.datePeriod, this.isRequisition || this.isContract, [Validators.required, Validate.periodRequired]);
    this.validateControlRequired(controls.justification, this.isRequisition);

    this.validateFormDisabled();

    setTimeout(() => {
      FormHelper.markControlsAsUntouched(controls.linkedOrderUID);
      FormHelper.markControlsAsUntouched(controls.providerUID);
    });
  }


  private validateControlRequired(control: FormControl<any>, required: boolean, validators = [Validators.required]) {
    required ? FormHelper.setControlValidators(control, validators) :
      FormHelper.clearControlValidators(control);
  }


  private validateFormDisabled() {
    setTimeout(() => {
      const disable = this.isSaved && (!this.editionMode || !this.actions.canUpdate);
      FormHelper.setDisableForm(this.form, disable);
      this.validateLinkedOrderFieldDisabled(disable);
    });
  }


  private validateLinkedOrderFieldDisabled(formDisabled: boolean = false) {
    if (this.isContract || this.isContractOrder || this.isPurchase || this.isExpense) {
      const disabled = formDisabled || !this.form.value.requestedByUID;
      FormHelper.setDisableControl(this.form.controls.linkedOrderUID, disabled);
    }
  }


  private validateGetOrderFields(): OrderFields {
    switch (this.config.type) {
      case ObjectTypes.CONTRACT:
        return this.getContractFields();
      case ObjectTypes.CONTRACT_ORDER:
        return this.getContractOrderFields();
      case ObjectTypes.EXPENSE:
      case ObjectTypes.PURCHASE:
        return this.getPayableOrderFields();
      case ObjectTypes.REQUISITION:
        return this.getRequisitionOrderFields();
      default:
        return this.getOrderFields();
    }
  }


  private validateSetDataLists() {
    this.validateInitDataList();
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


  private validateSetBudgetsList() {
    if (!this.isSaved) {
      return;
    }

    switch (this.config.type) {
      case ObjectTypes.CONTRACT: {
        const order = this.order as Contract;
        this.budgetsList = order?.requisition.budgets ?? [];
        break;
      }
      case ObjectTypes.CONTRACT_ORDER: {
        const order = this.order as ContractOrder;
        this.budgetsList = order?.contract.budgets ?? [];
        break;
      }
      case ObjectTypes.EXPENSE:
      case ObjectTypes.PURCHASE: {
        const order = this.order as PayableOrder;
        this.budgetsList = order.requisition?.budgets ?? [];
        break;
      }
      case ObjectTypes.REQUISITION: {
        const order = this.order as RequisitionOrder;
        const budgetType = this.budgetTypesList.find(x => x.uid === order.budgetType?.uid) ?? order.budgetType as BudgetType;
        this.budgetTypesList = ArrayLibrary.insertIfNotExist(this.budgetTypesList ?? [], budgetType, 'uid');
        this.budgetsList = budgetType?.budgets ?? [];
        break;
      }
    }
  }


  private getRequisitionOrderFields(): RequisitionOrderFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formValues = this.form.getRawValue();

    const data: RequisitionOrderFields = {
      ...this.getOrderFields(),
      ...
      {
        budgets: formValues.budgets ?? [],
        estimatedMonths: formValues.estimatedMonths ?? null,
        observations: formValues.observations ?? '',
        guaranteeNotes: formValues.guaranteeNotes ?? '',
        penaltyNotes: formValues.penaltyNotes ?? '',
        deliveryNotes: formValues.deliveryNotes ?? '',
      }
    };

    return data;
  }


  private getContractFields(): ContractFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formValues = this.form.getRawValue();

    const data: ContractFields = {
      ...this.getOrderFields(),
      ...
      {
        requisitionUID: formValues.linkedOrderUID ?? null,
        contractNo: formValues.contractNo ?? null,
        budgets: formValues.budgets ?? [],
        signDate: formValues.signDate ?? null,
      }
    };

    return data;
  }


  private getContractOrderFields(): ContractOrderFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formValues = this.form.getRawValue();

    const data: ContractOrderFields = {
      ...this.getOrderFields(),
      ...
      {
        contractUID: formValues.linkedOrderUID ?? null,
        budgetUID: formValues.budgetUID ?? null,
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
        requisitionUID: formValues.linkedOrderUID ?? null,
        budgetUID: formValues.budgetUID ?? null,
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
      name: formValues.name ?? null,
      startDate: !formValues.datePeriod.fromDate ? null : formValues.datePeriod.fromDate,
      endDate: !formValues.datePeriod.toDate ? null : formValues.datePeriod.toDate,
      priority: formValues.priority ?? null,
      description: formValues.description ?? null,
      justification: formValues.justification ?? null,
      identificators: formValues.identificators ?? [],
      tags: formValues.tags ?? [],
      responsibleUID: formValues.responsibleUID ?? null,
      beneficiaryUID: formValues.beneficiaryUID ?? null,
      isForMultipleBeneficiaries: formValues.isForMultipleBeneficiaries,
      providerUID: formValues.providerUID ?? null,
      currencyUID: formValues.currencyUID ?? null,
      requestedByUID: formValues.requestedByUID ?? null,
      projectUID: formValues.projectUID ?? null,
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
