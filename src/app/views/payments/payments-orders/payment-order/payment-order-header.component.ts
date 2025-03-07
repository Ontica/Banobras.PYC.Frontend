/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, DateString, EventInfo, Identifiable, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { ArrayLibrary, FormatLibrary, FormHelper, sendEvent } from '@app/shared/utils';

import { SearcherAPIS } from '@app/data-services';

import { EmptyPaymentOrder, EmptyPaymentOrderActions, PaymentAccount, PaymentOrder, PaymentOrderActions,
         PaymentOrderFields } from '@app/models';


export enum PaymentOrderHeaderEventType {
  CREATE      = 'PaymentOrderHeaderComponent.Event.CreatePaymentOrder',
  UPDATE      = 'PaymentOrderHeaderComponent.Event.UpdatePaymentOrder',
  SEND_TO_PAY = 'PaymentOrderHeaderComponent.Event.SendToPayPaymentOrder',
  DELETE      = 'PaymentOrderHeaderComponent.Event.DeletePaymentOrder',
}

interface PaymentOrderFormModel extends FormGroup<{
  requestedByUID: FormControl<string>;
  dueTime: FormControl<DateString>;
  payToUID: FormControl<string>;
  paymentAccountUID: FormControl<string>;
  controlNo: FormControl<string>;
  referenceNumber: FormControl<string>;
  total: FormControl<number>;
  currencyUID: FormControl<string>;
  paymentMethodUID: FormControl<string>;
  notes: FormControl<string>;
}> { }

@Component({
  selector: 'emp-pmt-payment-order-header',
  templateUrl: './payment-order-header.component.html',
})
export class PaymentOrderHeaderComponent implements OnInit, OnChanges {

  @Input() isSaved = false;

  @Input() paymentOrder: PaymentOrder = EmptyPaymentOrder;

  @Input() actions: PaymentOrderActions = EmptyPaymentOrderActions;

  @Output() paymentOrderHeaderEvent = new EventEmitter<EventInfo>();

  form: PaymentOrderFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  organizationalUnitsList: Identifiable[] = [];

  paymentOrderTypesList: Identifiable[] = [];

  paymentMethodsList: Identifiable[] = [];

  currenciesList: Identifiable[] = [];

  paymentAccountsList: PaymentAccount[] = [];

  linkedToAccount = false;

  suppliersAPI = SearcherAPIS.suppliers;


  constructor(private messageBox: MessageBoxService) {
    this.initForm();
    this.enableEditor(true);
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.paymentOrder && this.isSaved) {
      this.enableEditor(false);
      this.validateDataLists();
    }

    this.validateFieldsRequired();
  }


  get hasActions(): boolean {
    return this.actions.canUpdate || this.actions.canDelete || this.actions.canSendToPay;
  }


  get paymentAccountPlaceholder(): string {
    if (!this.editionMode) {
      return 'No determinado';
    }

    return 'Seleccionar';
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      let eventType = PaymentOrderHeaderEventType.CREATE;

      if (this.isSaved) {
        eventType = PaymentOrderHeaderEventType.UPDATE;
      }

      sendEvent(this.paymentOrderHeaderEvent, eventType, { dataFields: this.getFormData() });
    }
  }


  onSendToPayButtonClicked() {
    this.showConfirmMessage(PaymentOrderHeaderEventType.SEND_TO_PAY);
  }


  onDeleteButtonClicked() {
    this.showConfirmMessage(PaymentOrderHeaderEventType.DELETE);
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;

    if (!this.editionMode && this.isSaved) {
      this.setFormData();
    }

    this.validateFormDisabled();
  }


  private loadDataLists() {

  }


  private validateDataLists() {
    this.organizationalUnitsList =
      ArrayLibrary.insertIfNotExist(this.organizationalUnitsList ?? [], this.paymentOrder.requestedBy, 'uid');
    this.paymentOrderTypesList =
      ArrayLibrary.insertIfNotExist(this.paymentOrderTypesList ?? [], this.paymentOrder.paymentOrderType, 'uid');
    this.paymentMethodsList =
      ArrayLibrary.insertIfNotExist(this.paymentMethodsList ?? [], this.paymentOrder.paymentMethod, 'uid');
    this.currenciesList =
      ArrayLibrary.insertIfNotExist(this.currenciesList ?? [], this.paymentOrder.currency, 'uid');
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      requestedByUID: ['', Validators.required],
      dueTime: ['' as DateString, Validators.required],
      payToUID: ['', Validators.required],
      paymentAccountUID: ['', Validators.required],
      controlNo: ['', Validators.required],
      referenceNumber: ['', Validators.required],
      total: [null as number, Validators.required],
      currencyUID: ['', Validators.required],
      paymentMethodUID: ['', Validators.required],
      notes: ['', Validators.required],
    });
  }


  private setFormData() {
    setTimeout(() => {
      this.form.reset({
        requestedByUID: isEmpty(this.paymentOrder.requestedBy) ? null : this.paymentOrder.requestedBy.uid,
        dueTime: this.paymentOrder.dueTime ?? '',
        payToUID: isEmpty(this.paymentOrder.payTo) ? null : this.paymentOrder.payTo.uid,
        paymentAccountUID: isEmpty(this.paymentOrder.paymentAccount) ? null : this.paymentOrder.paymentAccount.uid,
        controlNo: this.paymentOrder.controlNo ?? '',
        referenceNumber: this.paymentOrder.referenceNumber ?? '',
        total: this.paymentOrder.total ?? null,
        currencyUID: isEmpty(this.paymentOrder.currency) ? null : this.paymentOrder.currency.uid,
        paymentMethodUID: isEmpty(this.paymentOrder.paymentMethod) ? null : this.paymentOrder.paymentMethod.uid,
        notes: this.paymentOrder.notes ?? '',
      });
    });
  }


  private validateFieldsRequired() {
    setTimeout(() => {
      FormHelper.markControlsAsUntouched(this.form.controls.paymentAccountUID);
    });
  }


  private validateFormDisabled() {
    // setTimeout(() => {
      const disable = this.isSaved && (!this.editionMode || !this.actions.canUpdate);
      FormHelper.setDisableForm(this.form, disable);
    // }, 10);
  }


  private getFormData(): PaymentOrderFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const data: PaymentOrderFields = {
      requestedByUID: this.form.value.requestedByUID ?? null,
      dueTime: this.form.value.dueTime ?? null,
      payToUID: this.form.value.payToUID ?? null,
      paymentAccountUID: this.form.value.paymentAccountUID ?? null,
      controlNo: this.form.value.controlNo ?? null,
      referenceNumber: this.form.value.referenceNumber ?? null,
      total: this.form.value.total ?? null,
      currencyUID: this.form.value.currencyUID ?? null,
      paymentMethodUID: this.form.value.paymentMethodUID ?? null,
      notes: this.form.value.notes ?? null,
    };

    return data;
  }


  private showConfirmMessage(eventType: PaymentOrderHeaderEventType) {
    const confirmType = this.getConfirmType(eventType);
    const title = this.getConfirmTitle(eventType);
    const message = this.getConfirmMessage(eventType);

    this.messageBox.confirm(message, title, confirmType)
      .firstValue()
      .then(x => this.validateAndSendEvent(eventType, x));
  }


  private getConfirmType(eventType: PaymentOrderHeaderEventType): 'AcceptCancel' | 'DeleteCancel' {
    switch (eventType) {
      case PaymentOrderHeaderEventType.DELETE:
        return 'DeleteCancel';
      case PaymentOrderHeaderEventType.SEND_TO_PAY:
      default:
        return 'AcceptCancel';
    }
  }


  private getConfirmTitle(eventType: PaymentOrderHeaderEventType): string {
    switch (eventType) {
      case PaymentOrderHeaderEventType.SEND_TO_PAY: return 'Enviar a pagar';
      case PaymentOrderHeaderEventType.DELETE: return 'Eliminar orden de pago';
      default: return '';
    }
  }


  private getConfirmMessage(eventType: PaymentOrderHeaderEventType): string {
    switch (eventType) {
      case PaymentOrderHeaderEventType.SEND_TO_PAY:
        const total = FormatLibrary.numberWithCommas(this.paymentOrder.total, '1.2-2');
        return `Esta operación enviará la orden de pago
                <strong>${this.paymentOrder.orderNo}: ${this.paymentOrder.paymentOrderType.name}</strong>
                a pagar a <strong>${this.paymentOrder.payTo.name}</strong>
                por un total de <strong>${total}</strong>.

                <br><br>¿Envio a pagar la orden de pago?`;
      case PaymentOrderHeaderEventType.DELETE:
        return `Esta operación eliminará la orden de pago
                <strong>${this.paymentOrder.orderNo}: ${this.paymentOrder.paymentOrderType.name}</strong>
                de <strong>${this.paymentOrder.payTo.name}</strong>.

                <br><br>¿Elimino la orden de pago?`;

      default: return '';
    }
  }


  private validateAndSendEvent(eventType: PaymentOrderHeaderEventType, send: boolean) {
    if (send) {
      sendEvent(this.paymentOrderHeaderEvent, eventType, { paymentOrderUID: this.paymentOrder.uid });
    }
  }

}
