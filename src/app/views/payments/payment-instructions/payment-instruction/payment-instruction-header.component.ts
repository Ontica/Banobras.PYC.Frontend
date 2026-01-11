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

import { CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { MessageBoxService } from '@app/shared/services';

import { ArrayLibrary, FormatLibrary, FormHelper, sendEvent, sendEventIf } from '@app/shared/utils';

import { PaymentInstructionsDataService, SearcherAPIS } from '@app/data-services';

import { EmptyPaymentInstruction, EmptyPaymentInstructionActions, PaymentAccount, PaymentMethod,
         PaymentInstruction, PaymentInstructionActions, RequestsList, PaymentInstructionFields } from '@app/models';


export enum PaymentInstructionHeaderEventType {
  UPDATE                 = 'PaymentInstructionHeaderComponent.Event.Update',
  CANCEL                 = 'PaymentInstructionHeaderComponent.Event.Cancel',
  SUSPEND                = 'PaymentInstructionHeaderComponent.Event.Suspend',
  RESET                  = 'PaymentInstructionHeaderComponent.Event.Reset',
  REQUEST_PAYMENT        = 'PaymentInstructionHeaderComponent.Event.RequestPayment',
  CANCEL_PAYMENT_REQUEST = 'PaymentInstructionHeaderComponent.Event.CancelPaymentRequest',
}

interface PaymentInstructionFormModel extends FormGroup<{
  requestedByUID: FormControl<string>;
  payable: FormControl<string>;
  dueTime: FormControl<DateString>;
  payToUID: FormControl<string>;
  paymentMethodUID: FormControl<string>;
  total: FormControl<number>;
  currencyUID: FormControl<string>;
  paymentAccountUID: FormControl<string>;
  referenceNumber: FormControl<string>;
  description: FormControl<string>;
}> { }

@Component({
  selector: 'emp-pmt-payment-instruction-header',
  templateUrl: './payment-instruction-header.component.html',
})
export class PaymentInstructionHeaderComponent implements OnInit, OnChanges, OnDestroy {

  @Input() isSaved = false;

  @Input() instruction: PaymentInstruction = EmptyPaymentInstruction;

  @Input() actions: PaymentInstructionActions = EmptyPaymentInstructionActions;

  @Output() paymentInstructionHeaderEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: PaymentInstructionFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  isLoadingPaymentAccounts = false;

  organizationalUnitsList: Identifiable[] = [];

  paymentMethodsList: PaymentMethod[] = [];

  currenciesList: Identifiable[] = [];

  paymentAccountsList: PaymentAccount[] = [];

  accountRelated = false;

  providersAPI = SearcherAPIS.provider;

  eventTypes = PaymentInstructionHeaderEventType;


  constructor(private uiLayer: PresentationLayer,
              private paymentInstructionsData: PaymentInstructionsDataService,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
    this.enableEditor(true);
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.instruction && this.isSaved) {
      this.enableEditor(false);
    }

    this.validateFieldsRequired();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get hasActions(): boolean {
    return this.actions.canUpdate || this.actions.canCancel || this.actions.canReset ||
      this.actions.canSuspend || this.actions.canRequestPayment || this.actions.canCancelPaymentRequest;
  }


  get paymentAccountPlaceholder(): string {
    if (!this.editionMode) {
      return this.accountRelated ? 'No determinado' : 'No aplica';
    }

    if (!this.form.getRawValue().paymentMethodUID) {
      return 'Seleccione método de pago...';
    }

    if (this.accountRelated) {
      return !this.form.getRawValue().payToUID ? 'Seleccione pagar a...' : 'Seleccionar';
    } else {
      return 'No aplica';
    }
  }


  get referenceNumberPlaceholder(): string {
    if (!this.editionMode) {
      return this.accountRelated ? 'No determinado' : 'No aplica';
    }

    if (!this.form.getRawValue().paymentMethodUID) {
      return 'Seleccione método de pago...';
    }

    return this.accountRelated ? '' : 'No aplica';
  }


  onPayToChanges(payTo: Identifiable) {
    this.validateGetPaymentAccounts();
  }


  onPaymentMethodChanges(paymentMethod: PaymentMethod) {
    this.setAccountRelated(paymentMethod);
    this.resetPaymentAccountControl();
    this.validatePaymentAccountControlsRequired();
    this.validatePaymentAccountControlsDisabled();
    this.validateGetPaymentAccounts();
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.isSaved ? PaymentInstructionHeaderEventType.UPDATE : null;

      sendEvent(this.paymentInstructionHeaderEvent, eventType, { dataFields: this.getFormData() });
    }
  }


  onEventButtonClicked(eventType: PaymentInstructionHeaderEventType) {
    this.showConfirmMessage(eventType);
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;

    if (!this.editionMode && this.isSaved) {
      this.setFormData();
      this.validateInitPaymentAccountsList();
    }

    this.validateFormDisabled();
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS,
        { requestsList: RequestsList.payments }),
      this.helper.select<PaymentMethod[]>(CataloguesStateSelector.PAYMENTS_METHODS),
      this.helper.select<Identifiable[]>(CataloguesStateSelector.CURRENCIES),
    ])
    .subscribe(([a, b, c]) => {
      this.organizationalUnitsList = a;
      this.paymentMethodsList = b;
      this.currenciesList = c;
      this.isLoading = false;
    });
  }


  private getPaymentAccouts(partyUID: string) {
    this.isLoadingPaymentAccounts = true;

    this.paymentInstructionsData.getPartyPaymentAccouts(partyUID)
      .firstValue()
      .then(x => this.paymentAccountsList = x)
      .finally(() => this.isLoadingPaymentAccounts = false);
  }


  private validateGetPaymentAccounts() {
    if (this.form.controls.paymentMethodUID.valid && this.accountRelated && this.form.controls.payToUID.valid) {
      const partyUID = this.form.value.payToUID;
      this.getPaymentAccouts(partyUID)
      return;
    }

    this.paymentAccountsList = [];
  }


  private validateInitPaymentAccountsList() {
    this.paymentAccountsList =
      ArrayLibrary.insertIfNotExist(this.paymentAccountsList ?? [], this.instruction.paymentAccount, 'uid');
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      requestedByUID: ['', Validators.required],
      payable: [''],
      dueTime: ['' as DateString, Validators.required],
      payToUID: ['', Validators.required],
      paymentMethodUID: ['', Validators.required],
      total: [null as number, Validators.required],
      currencyUID: ['', Validators.required],
      paymentAccountUID: [''],
      referenceNumber: [''],
      description: [''],
    });
  }


  private setFormData() {
    setTimeout(() => {
      this.form.reset({
        requestedByUID: FormHelper.getUIDValueValid(this.instruction.requestedBy),
        payable: `(${this.instruction.payableType.name}) ${this.instruction.payableNo} - ${this.instruction.payable.name}`,
        dueTime: this.instruction.dueTime ?? '',
        payToUID: FormHelper.getUIDValueValid(this.instruction.payTo),
        paymentMethodUID: FormHelper.getUIDValueValid(this.instruction.paymentMethod),
        total: this.instruction.total ?? null,
        currencyUID: FormHelper.getUIDValueValid(this.instruction.currency),
        paymentAccountUID: FormHelper.getUIDValueValid(this.instruction.paymentAccount),
        referenceNumber: this.instruction.referenceNumber ?? '',
        description: this.instruction.description ?? '',
      });
    });

    this.setAccountRelated(this.instruction.paymentMethod);
    this.validatePaymentAccountControlsRequired();
  }


  private validateFieldsRequired() {
    setTimeout(() => FormHelper.markControlsAsUntouched(this.form.controls.paymentAccountUID));
  }


  private validateFormDisabled() {
    const disable = this.isSaved && (!this.editionMode || !this.actions.canUpdate);
    FormHelper.setDisableForm(this.form, disable);
    this.validatePaymentAccountControlsDisabled();
  }


  private setAccountRelated(paymentMethod: PaymentMethod) {
    this.accountRelated = isEmpty(paymentMethod) ? false : paymentMethod.accountRelated;
  }


  private resetPaymentAccountControl() {
    this.form.controls.paymentAccountUID.reset();
    this.form.controls.referenceNumber.reset();
  }


  private validatePaymentAccountControlsRequired() {
    const payableAccountNotRequired = !this.accountRelated;

    if (payableAccountNotRequired) {
      FormHelper.clearControlValidators(this.form.controls.paymentAccountUID);
      FormHelper.clearControlValidators(this.form.controls.referenceNumber);
    } else {
      FormHelper.setControlValidators(this.form.controls.paymentAccountUID, Validators.required);
      FormHelper.setControlValidators(this.form.controls.referenceNumber, Validators.required);
    }
  }


  private validatePaymentAccountControlsDisabled() {
    const payableAccountDisabled = !this.accountRelated || !this.editionMode;
    FormHelper.setDisableControl(this.form.controls.paymentAccountUID, payableAccountDisabled);
    FormHelper.setDisableControl(this.form.controls.referenceNumber, payableAccountDisabled);
  }


  private getFormData(): PaymentInstructionFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const data: PaymentInstructionFields = {

    };

    return data;
  }


  private showConfirmMessage(eventType: PaymentInstructionHeaderEventType) {
    const confirmType = this.getConfirmType(eventType);
    const title = this.getConfirmTitle(eventType);
    const message = this.getConfirmMessage(eventType);

    this.messageBox.confirm(message, title, confirmType)
      .firstValue()
      .then(x =>
        sendEventIf(x, this.paymentInstructionHeaderEvent, eventType, { dataUID: this.instruction.uid })
      );
  }


  private getConfirmType(eventType: PaymentInstructionHeaderEventType): 'AcceptCancel' | 'DeleteCancel' {
    switch (eventType) {
      case PaymentInstructionHeaderEventType.CANCEL:
        return 'DeleteCancel';
      case PaymentInstructionHeaderEventType.RESET:
      case PaymentInstructionHeaderEventType.SUSPEND:
      case PaymentInstructionHeaderEventType.REQUEST_PAYMENT:
      case PaymentInstructionHeaderEventType.CANCEL_PAYMENT_REQUEST:
      default:
        return 'AcceptCancel';
    }
  }


  private getConfirmTitle(eventType: PaymentInstructionHeaderEventType): string {
    switch (eventType) {
      case PaymentInstructionHeaderEventType.CANCEL: return 'Cancelar instrucción de pago';
      case PaymentInstructionHeaderEventType.RESET: return 'Activar instrucción de pago';
      case PaymentInstructionHeaderEventType.SUSPEND: return 'Suspender instrucción de pago';
      case PaymentInstructionHeaderEventType.REQUEST_PAYMENT: return 'Enviar pago';
      case PaymentInstructionHeaderEventType.CANCEL_PAYMENT_REQUEST: return 'Cancelar envío de pago';
      default: return '';
    }
  }


  private getConfirmMessage(eventType: PaymentInstructionHeaderEventType): string {
    const instructionName = `(${this.instruction.paymentOrderType.name}) ` +
      `${this.instruction.paymentInstructionNo}`;

    const payable = `(${this.instruction.payableType.name}) ${this.instruction.payableNo} ` +
      `- ${this.instruction.payable.name}`;

    const total = `${FormatLibrary.numberWithCommas(this.instruction.total, '1.2-2')} (${this.instruction.currency.name})`;

    const instructionData = `la instrucción de pago:<br><br>
      <table class='confirm-data'>
        <tr><td class='nowrap'>Instrucción: </td><td><strong>${instructionName}</strong></td></tr>
        <tr><td class='nowrap'>Importe: </td><td><strong>${total}</strong></td></tr>
        <tr><td class='nowrap'>Pagar a: </td><td><strong>${this.instruction.payTo.name}</strong></td></tr>
        <tr><td class='nowrap'>Documento relacionado: </td><td><strong>${payable}</strong></td></tr>
      </table><br>`;

    switch (eventType) {
      case PaymentInstructionHeaderEventType.CANCEL:
        return `Esta operación cancelará ${instructionData}¿Cancelo la instrucción de pago?`;
      case PaymentInstructionHeaderEventType.RESET:
        return `Esta operación activará ${instructionData}¿Activo la solicitud de pago?`;
      case PaymentInstructionHeaderEventType.SUSPEND:
        return `Esta operación suspenderá ${instructionData}¿Suspendo la instrucción de pago?`;
      case PaymentInstructionHeaderEventType.REQUEST_PAYMENT:
        return `Esta operación enviará a pagar ${instructionData}¿Envio el pago?`;
      case PaymentInstructionHeaderEventType.CANCEL_PAYMENT_REQUEST:
        return `Esta operación cancelará el envío a pagar de ${instructionData}¿Cancelo el envío del pago?`;
      default: return '';
    }
  }

}
