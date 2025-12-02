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

import { CataloguesStateSelector, PaymentsStateSelector } from '@app/presentation/exported.presentation.types';

import { MessageBoxService } from '@app/shared/services';

import { ArrayLibrary, FormHelper, sendEvent, sendEventIf } from '@app/shared/utils';

import { SearcherAPIS } from '@app/data-services';

import { BudgetType, EmptyPayable, EmptyPayableActions, EmptyPayableEntity, Payable, PayableActions,
         PayableEntity, PayableFields, PaymentAccount, PaymentMethod, RequestsList } from '@app/models';


export enum PayableHeaderEventType {
  CREATE                 = 'PayableHeaderComponent.Event.Create',
  UPDATE                 = 'PayableHeaderComponent.Event.Update',
  DELETE                 = 'PayableHeaderComponent.Event.Delete',
  GENERATE_PAYMENT_ORDER = 'PayableHeaderComponent.Event.GeneratePaymentOrder',
}

interface PayableFormModel extends FormGroup<{
  organizationalUnitUID: FormControl<string>;
  payableTypeUID: FormControl<string>;
  payableEntityUID: FormControl<string>;
  budgetUID: FormControl<string>;
  payToUID: FormControl<string>;
  total: FormControl<number>;
  currencyUID: FormControl<string>;
  paymentMethodUID: FormControl<string>;
  paymentAccountUID: FormControl<string>;
  description: FormControl<string>;
  dueTime: FormControl<DateString>;
}> { }

@Component({
  selector: 'emp-pmt-payable-header',
  templateUrl: './payable-header.component.html',
})
export class PayableHeaderComponent implements OnInit, OnChanges, OnDestroy {

  @Input() isSaved = false;

  @Input() payable: Payable = EmptyPayable;

  @Input() payableEntity: PayableEntity = EmptyPayableEntity;

  @Input() actions: PayableActions = EmptyPayableActions;

  @Output() payableHeaderEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: PayableFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  organizationalUnitsList: Identifiable[] = [];

  payableTypesList: Identifiable[] = [];

  paymentMethodsList: PaymentMethod[] = [];

  paymentAccountsList: PaymentAccount[] = [];

  selectedPayableEntity: PayableEntity = null;

  linkedToAccount = false;

  payableEntitiesAPI = SearcherAPIS.payableEntities;

  eventTypes = PayableHeaderEventType;


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
    if (changes.payable && this.isSaved) {
      this.enableEditor(false);
    }
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get hasActions(): boolean {
    return this.actions.canUpdate || this.actions.canDelete || this.actions.canGeneratePaymentOrder;
  }


  get payableEntityPlaceholder(): string {
    if (!this.editionMode) {
      return 'No determinado';
    }

    if (!this.form.getRawValue().organizationalUnitUID) {
      return 'Seleccione el área...';
    }

    if (!this.form.getRawValue().payableTypeUID) {
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


  get paymentAccountPlaceholder(): string {
    if (!this.editionMode) {
      return this.linkedToAccount ? 'No determinado' : 'No aplica';
    }

    if (!this.form.getRawValue().payableEntityUID) {
      return 'Seleccione el documento...';
    }

    if (!this.form.getRawValue().paymentMethodUID) {
      return 'Seleccione el método de pago...'
    }

    return this.linkedToAccount ? 'Seleccionar' : 'No aplica';
  }


  onPayableEntityReset() {
    this.form.controls.payableEntityUID.reset();
    this.validatePayableEntityData(null);
  }


  onPayableEntityChanges(entity: PayableEntity) {
    this.validatePayableEntityData(entity);
  }


  onPaymentMethodChanges(paymentMethod: PaymentMethod) {
    this.linkedToAccount = isEmpty(paymentMethod) ? false : paymentMethod.linkedToAccount;
    this.form.controls.paymentAccountUID.reset();
    this.validatePaymentAccountData();
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.isSaved ? PayableHeaderEventType.UPDATE : PayableHeaderEventType.CREATE;
      sendEvent(this.payableHeaderEvent, eventType, { dataFields: this.getFormData() });
    }
  }


  onEventButtonClicked(eventType: PayableHeaderEventType) {
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
      this.helper.select<BudgetType[]>(PaymentsStateSelector.PAYABLES_TYPES),
    ])
    .subscribe(([a, b]) => {
      this.organizationalUnitsList = a;
      this.payableTypesList = b;
      this.isLoading = false;
    });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      organizationalUnitUID: ['', Validators.required],
      payableTypeUID: ['', Validators.required],
      payableEntityUID: ['', Validators.required],
      budgetUID: ['', Validators.required],
      payToUID: ['', Validators.required],
      total: [null as number, Validators.required],
      paymentMethodUID: ['', Validators.required],
      paymentAccountUID: ['', Validators.required],
      currencyUID: ['', Validators.required],
      description: [''],
      dueTime: [null as DateString, Validators.required],
    });
  }


  private setFormData() {
    setTimeout(() => {
      this.form.reset({
        organizationalUnitUID: isEmpty(this.payable.requestedBy) ? null : this.payable.requestedBy.uid,
        payableTypeUID: isEmpty(this.payable.payableType) ? null : this.payable.payableType.uid,
        payableEntityUID: isEmpty(this.payableEntity) ? null : this.payableEntity.uid,
        budgetUID: isEmpty(this.payable.budget) ? null : this.payable.budget.uid,
        payToUID: isEmpty(this.payable.payTo) ? null : this.payable.payTo.uid,
        total: this.payable.total ?? null,
        paymentMethodUID: isEmpty(this.payable.paymentMethod) ? null : this.payable.paymentMethod.uid,
        paymentAccountUID: isEmpty(this.payable.paymentAccount) ? null : this.payable.paymentAccount.uid,
        currencyUID: isEmpty(this.payable.currency) ? null : this.payable.currency.uid,
        description: this.payable.description ?? '',
        dueTime: this.payable.dueTime ?? null,
      });

      this.selectedPayableEntity = isEmpty(this.payableEntity) ? null : this.payableEntity;
      this.linkedToAccount = isEmpty(this.payable.paymentMethod) ? false :
        this.payable.paymentMethod.linkedToAccount;

      this.validatePaymentMethodsData();
      this.validatePaymentAccountData();
    });
  }


  private getFormData(): PayableFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const data: PayableFields = {
      organizationalUnitUID: this.form.value.organizationalUnitUID ?? '',
      payableTypeUID: this.form.value.payableTypeUID ?? '',
      dueTime: this.form.value.dueTime ?? '',
      payableEntityUID: this.form.value.payableEntityUID ?? '',
      paymentMethodUID: this.form.value.paymentMethodUID ?? '',
      paymentAccountUID: this.form.value.paymentAccountUID ?? '',
      description: this.form.value.description ?? '',
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
    this.linkedToAccount = false;

    this.form.controls.payToUID.reset(isEmptyEntity ? null : this.selectedPayableEntity.payTo.uid);
    this.form.controls.budgetUID.reset(isEmptyEntity ? null : this.selectedPayableEntity.budget.uid);
    this.form.controls.currencyUID.reset(isEmptyEntity ? null : this.selectedPayableEntity.currency.uid);
    this.form.controls.total.reset(isEmptyEntity ? null : this.selectedPayableEntity.total);
    this.form.controls.paymentMethodUID.reset();
    this.form.controls.paymentAccountUID.reset();

    this.validatePayableEntityDisabled();
    this.validatePaymentMethodsData();
    this.validatePaymentAccountData();
  }


  private validatePayableEntityDisabled() {
    const entityNotReady = !this.form.value.payableTypeUID || !this.form.value.organizationalUnitUID;
    const payableEntityInvalid = isEmpty(this.selectedPayableEntity);
    const payableAccountNotRequired = payableEntityInvalid || !this.linkedToAccount;

    FormHelper.setDisableControl(this.form.controls.payableEntityUID, entityNotReady);

    FormHelper.setDisableControl(this.form.controls.paymentMethodUID, payableEntityInvalid);
    FormHelper.setDisableControl(this.form.controls.paymentAccountUID, payableAccountNotRequired);
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

    this.paymentAccountsList = this.linkedToAccount ?
      this.selectedPayableEntity?.paymentAccounts?.filter(x => x.paymentMethod.uid === paymentMethodUID) : [];

    this.validatePayableEntityDisabled();
  }



  private showConfirmMessage(eventType: PayableHeaderEventType) {
    const confirmType = this.getConfirmType(eventType);
    const title = this.getConfirmTitle(eventType);
    const message = this.getConfirmMessage(eventType);

    this.messageBox.confirm(message, title, confirmType)
      .firstValue()
      .then(x => sendEventIf(x, this.payableHeaderEvent, eventType, { dataUID: this.payable.uid }));
  }


  private getConfirmType(eventType: PayableHeaderEventType): 'AcceptCancel' | 'DeleteCancel' {
    switch (eventType) {
      case PayableHeaderEventType.DELETE:
        return 'DeleteCancel';
      default:
        return 'AcceptCancel';
    }
  }


  private getConfirmTitle(eventType: PayableHeaderEventType): string {
    switch (eventType) {
      case PayableHeaderEventType.DELETE: return 'Eliminar solicitud de pago';
      case PayableHeaderEventType.GENERATE_PAYMENT_ORDER: return 'Generar orden de pago';
      default: return '';
    }
  }


  private getConfirmMessage(eventType: PayableHeaderEventType): string {
    switch (eventType) {
      case PayableHeaderEventType.DELETE:
        return `Esta operación eliminará la solicitud de pago <strong>${this.payable.payableNo}</strong> ` +
               `solicitada por ${this.payable.requestedBy.name} con documento relacionado ` +
               `<strong>${this.payable.payableType.name}: ${this.payableEntity.entityNo}</strong>.` +
               `<br><br>¿Elimino la solicitud de pago?`;

      case PayableHeaderEventType.GENERATE_PAYMENT_ORDER:
        return `Esta operación generará la orden de pago ` +
               `para la solicitud de pago <strong>${this.payable.payableNo}</strong> ` +
               `<br><br>¿Genero la orden de pago?`;

      default: return '';
    }
  }

}
