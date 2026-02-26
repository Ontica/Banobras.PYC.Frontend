/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { combineLatest } from 'rxjs';

import { Assertion, DateString, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { STANDALONE_IMPORTS } from '@app/shared/standalone-imports';

import { CataloguesStateSelector, PaymentsStateSelector } from '@app/presentation/exported.presentation.types';

import { MessageBoxService } from '@app/shared/services';

import { ArrayLibrary, FormHelper, sendEvent, sendEventIf } from '@app/shared/utils';

import { SearcherAPIS } from '@app/data-services';

import { BudgetType, EmptyPaymentOrder, EmptyPaymentOrderActions, EmptyPayableEntity, PaymentOrder,
         PaymentOrderActions, PayableEntity, PaymentOrderFields, PaymentAccount, PaymentMethod, RequestsList,
         Priority, PaymentOrderPriorityList } from '@app/models';


export enum PaymentOrderHeaderEventType {
  CREATE  = 'PaymentOrderHeaderComponent.Event.Create',
  UPDATE  = 'PaymentOrderHeaderComponent.Event.Update',
  CANCEL  = 'PaymentOrderHeaderComponent.Event.Cancel',
  SUSPEND = 'PaymentOrderHeaderComponent.Event.Suspend',
  RESET   = 'PaymentOrderHeaderComponent.Event.Reset',
}

interface PayableFormModel extends FormGroup<{
  organizationalUnitUID: FormControl<string>;
  paymentOrderTypeUID: FormControl<string>;
  payableEntityUID: FormControl<string>;
  budgetUID: FormControl<string>;
  payToUID: FormControl<string>;
  total: FormControl<number>;
  exchangeRate: FormControl<number>;
  currencyUID: FormControl<string>;
  paymentMethodUID: FormControl<string>;
  paymentAccountUID: FormControl<string>;
  referenceNumber: FormControl<string>;
  priority: FormControl<Priority>;
  dueTime: FormControl<DateString>;
  debtorUID: FormControl<string>;
  description: FormControl<string>;
  observations: FormControl<string>;
}> { }

@Component({
  selector: 'emp-pmt-payment-order-header',
  templateUrl: './payment-order-header.component.html',
  standalone: true,
  imports: [
    ...STANDALONE_IMPORTS,
  ],
})
export class PaymentOrderHeaderComponent implements OnInit, OnChanges, OnDestroy {

  @Input() isSaved = false;

  @Input() paymentOrder: PaymentOrder = EmptyPaymentOrder;

  @Input() payableEntity: PayableEntity = EmptyPayableEntity;

  @Input() actions: PaymentOrderActions = EmptyPaymentOrderActions;

  @Output() paymentOrderHeaderEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: PayableFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  orgUnitsList: Identifiable[] = [];

  paymentOrderTypesList: Identifiable[] = [];

  paymentMethodsList: PaymentMethod[] = [];

  paymentAccountsList: PaymentAccount[] = [];

  priorityList = PaymentOrderPriorityList;

  selectedPayableEntity: PayableEntity = null;

  accountRelated = false;

  payableEntitiesAPI = SearcherAPIS.payableEntities;

  providersAPI = SearcherAPIS.provider;

  eventTypes = PaymentOrderHeaderEventType;

  Priority = Priority;


  constructor(private uiLayer: PresentationLayer,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
    this.enableEditor(true);
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.paymentOrder && this.isSaved) {
      this.enableEditor(false);
    }
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get hasActions(): boolean {
    return this.actions.canUpdate || this.actions.canCancel || this.actions.canReset ||
      this.actions.canSuspend;
  }


  get payableEntityPlaceholder(): string {
    if (!this.editionMode) {
      return 'No determinado';
    }

    if (!this.form.getRawValue().organizationalUnitUID) {
      return 'Seleccione el área...';
    }

    if (!this.form.getRawValue().paymentOrderTypeUID) {
      return 'Seleccione el tipo de solicitud...';
    }

    return 'Buscar documento...';
  }


  get payableEntityDataPlaceholder(): string {
    if (!this.editionMode) {
      return 'No determinado';
    }

    return isEmpty(this.selectedPayableEntity) ? 'Seleccione el documento...' :
      'El documento no tiene datos asociados...'
  }


  get paymentMethodPlaceholder(): string {
    if (!this.editionMode) {
      return 'No determinado';
    }

    if (!this.form.getRawValue().payableEntityUID) {
      return 'Seleccione el documento...';
    }

    return 'Seleccionar';
  }


  get referenceNumberPlaceholder(): string {
    if (!this.editionMode) {
      return 'No determinado';
    }

    if (!this.form.getRawValue().payableEntityUID) {
      return 'Seleccione el documento...';
    }

    return '';
  }


  get paymentAccountPlaceholder(): string {
    if (!this.editionMode) {
      return this.accountRelated ? 'No determinado' : 'No aplica';
    }

    if (!this.form.getRawValue().payableEntityUID) {
      return 'Seleccione el documento...';
    }

    if (!this.form.getRawValue().paymentMethodUID) {
      return 'Seleccione el método de pago...'
    }

    return this.accountRelated ? 'Seleccionar' : 'No aplica';
  }


  onPayableEntityReset() {
    this.form.controls.payableEntityUID.reset();
    this.validatePayableEntityData(null);
  }


  onPayableEntityChanges(entity: PayableEntity) {
    this.validatePayableEntityData(entity);
  }


  onPaymentMethodChanges(paymentMethod: PaymentMethod) {
    this.accountRelated = isEmpty(paymentMethod) ? false : paymentMethod.accountRelated;
    this.form.controls.paymentAccountUID.reset();
    this.validatePaymentAccountData();
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.isSaved ? PaymentOrderHeaderEventType.UPDATE : PaymentOrderHeaderEventType.CREATE;
      sendEvent(this.paymentOrderHeaderEvent, eventType, { dataFields: this.getFormData() });
    }
  }


  onEventButtonClicked(eventType: PaymentOrderHeaderEventType) {
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
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS,
        { requestsList: RequestsList.payments }),
      this.helper.select<BudgetType[]>(PaymentsStateSelector.PAYMENT_ORDER_TYPES),
    ])
    .subscribe(([a, b]) => {
      this.orgUnitsList = a;
      this.paymentOrderTypesList = b;
      this.isLoading = false;
      this.validateInitDataList();
    });
  }


  private validateInitDataList() {
    if (this.isSaved) {
      this.orgUnitsList = ArrayLibrary.insertIfNotExist(this.orgUnitsList ?? [], this.paymentOrder.requestedBy, 'uid');
      this.paymentOrderTypesList = ArrayLibrary.insertIfNotExist(this.paymentOrderTypesList ?? [], this.paymentOrder.paymentOrderType, 'uid');
    }
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      organizationalUnitUID: ['', Validators.required],
      paymentOrderTypeUID: ['', Validators.required],
      payableEntityUID: ['', Validators.required],
      budgetUID: ['', Validators.required],
      payToUID: ['', Validators.required],
      debtorUID: [''],
      total: [null as number, Validators.required],
      exchangeRate: [null as number, Validators.required],
      paymentMethodUID: ['', Validators.required],
      paymentAccountUID: ['', Validators.required],
      currencyUID: ['', Validators.required],
      referenceNumber: [''],
      priority: [Priority.Normal, Validators.required],
      description: [''],
      observations: [''],
      dueTime: [null as DateString, Validators.required],
    });
  }


  private setFormData() {
    setTimeout(() => {
      this.form.reset({
        organizationalUnitUID: FormHelper.getUIDValue(this.paymentOrder.requestedBy),
        paymentOrderTypeUID: FormHelper.getUIDValue(this.paymentOrder.paymentOrderType),
        payableEntityUID: FormHelper.getUIDValue(this.payableEntity),
        budgetUID: FormHelper.getUIDValue(this.paymentOrder.budget),
        payToUID: FormHelper.getUIDValue(this.paymentOrder.payTo),
        debtorUID: FormHelper.getUIDValue(this.paymentOrder.debtor),
        total: FormHelper.getPositiveNumberValue(this.paymentOrder.total),
        exchangeRate: FormHelper.getPositiveNumberValue(this.paymentOrder.exchangeRate),
        paymentMethodUID: FormHelper.getUIDValue(this.paymentOrder.paymentMethod),
        paymentAccountUID: FormHelper.getUIDValue(this.paymentOrder.paymentAccount),
        currencyUID: FormHelper.getUIDValue(this.paymentOrder.currency),
        referenceNumber: this.paymentOrder.referenceNumber ?? '',
        priority: this.paymentOrder.priority ?? null,
        description: this.paymentOrder.description ?? '',
        observations: this.paymentOrder.observations ?? '',
        dueTime: this.paymentOrder.dueTime ?? null,
      });

      this.selectedPayableEntity = isEmpty(this.payableEntity) ? null : this.payableEntity;
      this.accountRelated = isEmpty(this.paymentOrder.paymentMethod) ? false :
        this.paymentOrder.paymentMethod.accountRelated;

      this.validateInitDataList();
      this.validatePaymentMethodsData();
      this.validatePaymentAccountData();
    });
  }


  private getFormData(): PaymentOrderFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const data: PaymentOrderFields = {
      organizationalUnitUID: this.form.value.organizationalUnitUID ?? '',
      paymentOrderTypeUID: this.form.value.paymentOrderTypeUID ?? '',
      dueTime: this.form.value.dueTime ?? '',
      payableEntityUID: this.form.value.payableEntityUID ?? '',
      paymentMethodUID: this.form.value.paymentMethodUID ?? '',
      paymentAccountUID: this.form.value.paymentAccountUID ?? '',
      exchangeRate: this.form.value.exchangeRate ?? null,
      debtorUID: this.form.value.debtorUID ?? '',
      description: this.form.value.description ?? '',
      referenceNumber: this.form.value.referenceNumber ?? '',
      priority: this.form.value.priority ?? null,
      observations: this.form.value.observations ?? '',
    };

    return data;
  }


  private validateFormDisabled() {
    setTimeout(() => {
      const disable = this.isSaved && (!this.editionMode || !this.actions.canUpdate);
      this.formHelper.setDisableForm(this.form, disable);

      if (!disable) {
        this.validatePayableEntityDisabled();
      };
    }, 10);
  }


  private validatePayableEntityData(entity: PayableEntity) {
    const isEmptyEntity = isEmpty(entity);
    this.selectedPayableEntity = isEmptyEntity ? null : entity;
    this.accountRelated = false;

    this.form.controls.payToUID.reset(isEmptyEntity ? null : this.selectedPayableEntity.payTo.uid);
    this.form.controls.budgetUID.reset(isEmptyEntity ? null : this.selectedPayableEntity.budget.uid);
    this.form.controls.currencyUID.reset(isEmptyEntity ? null : this.selectedPayableEntity.currency.uid);
    this.form.controls.total.reset(isEmptyEntity ? null : this.selectedPayableEntity.total);
    this.form.controls.exchangeRate.reset();
    this.form.controls.paymentMethodUID.reset();
    this.form.controls.referenceNumber.reset();
    this.form.controls.paymentAccountUID.reset();

    this.validatePayableEntityDisabled();
    this.validatePaymentMethodsData();
    this.validatePaymentAccountData();
  }


  private validatePayableEntityDisabled() {
    const entityNotReady = !this.form.value.paymentOrderTypeUID || !this.form.value.organizationalUnitUID;
    const payableEntityInvalid = isEmpty(this.selectedPayableEntity);
    const accountNotRequired = payableEntityInvalid || !this.accountRelated;

    FormHelper.setDisableControl(this.form.controls.payableEntityUID, entityNotReady);

    FormHelper.setDisableControl(this.form.controls.paymentMethodUID, payableEntityInvalid);
    FormHelper.setDisableControl(this.form.controls.referenceNumber, payableEntityInvalid);
    FormHelper.setDisableControl(this.form.controls.paymentAccountUID, accountNotRequired);
    FormHelper.setDisableControl(this.form.controls.payToUID);
    FormHelper.setDisableControl(this.form.controls.budgetUID);
    FormHelper.setDisableControl(this.form.controls.total);
    FormHelper.setDisableControl(this.form.controls.currencyUID);
  }


  private validatePaymentMethodsData() {
    const paymentMethodsList = this.selectedPayableEntity?.paymentAccounts?.map(x => x.paymentMethod) ?? [];
    this.paymentMethodsList = ArrayLibrary.getUniqueItems(paymentMethodsList);
  }


  private validatePaymentAccountData() {
    const paymentMethodUID = this.form.getRawValue().paymentMethodUID;

    this.paymentAccountsList = this.accountRelated ?
      this.selectedPayableEntity?.paymentAccounts?.filter(x => x.paymentMethod.uid === paymentMethodUID) : [];

    this.validatePayableEntityDisabled();
  }



  private showConfirmMessage(eventType: PaymentOrderHeaderEventType) {
    const confirmType = this.getConfirmType(eventType);
    const title = this.getConfirmTitle(eventType);
    const message = this.getConfirmMessage(eventType);

    this.messageBox.confirm(message, title, confirmType)
      .firstValue()
      .then(x => sendEventIf(x, this.paymentOrderHeaderEvent, eventType, { dataUID: this.paymentOrder.uid }));
  }


  private getConfirmType(eventType: PaymentOrderHeaderEventType): 'AcceptCancel' | 'DeleteCancel' {
    switch (eventType) {
      case PaymentOrderHeaderEventType.CANCEL:
        return 'DeleteCancel';
      case PaymentOrderHeaderEventType.RESET:
      case PaymentOrderHeaderEventType.SUSPEND:
      default:
        return 'AcceptCancel';
    }
  }


  private getConfirmTitle(eventType: PaymentOrderHeaderEventType): string {
    switch (eventType) {
      case PaymentOrderHeaderEventType.CANCEL:  return 'Cancelar solicitud de pago';
      case PaymentOrderHeaderEventType.RESET:   return 'Activar solicitud de pago';
      case PaymentOrderHeaderEventType.SUSPEND: return 'Suspender solicitud de pago';
      default: return '';
    }
  }


  private getConfirmMessage(eventType: PaymentOrderHeaderEventType): string {
    const paymentName = `la solicitud de pago <strong class=nowrap>${this.paymentOrder.paymentOrderNo}</strong> ` +
      `solicitada por ${this.paymentOrder.requestedBy.name} con documento relacionado ` +
      `<strong>(${this.paymentOrder.paymentOrderType.name}) ${this.payableEntity.entityNo}</strong>.`

    switch (eventType) {
      case PaymentOrderHeaderEventType.CANCEL:
        return `Esta operación cancelará ${paymentName}<br><br>¿Cancelo la solicitud de pago?`;
      case PaymentOrderHeaderEventType.RESET:
        return `Esta operación activará ${paymentName}<br><br>¿Activo la solicitud de pago?`;
      case PaymentOrderHeaderEventType.SUSPEND:
        return `Esta operación suspenderá ${paymentName}<br><br>¿Suspendo la solicitud de pago?`;
      default: return '';
    }
  }

}
