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

import { ArrayLibrary, FormatLibrary, FormHelper, sendEvent } from '@app/shared/utils';

import { PaymentOrdersDataService, SearcherAPIS } from '@app/data-services';

import { EmptyPaymentOrder, EmptyPaymentOrderActions, PaymentAccount, PaymentMethod, PaymentOrder,
         PaymentOrderActions, PaymentOrderFields, RequestsList } from '@app/models';


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
  controlNo: FormControl<string>;
  paymentMethodUID: FormControl<string>;
  total: FormControl<number>;
  currencyUID: FormControl<string>;
  paymentAccountUID: FormControl<string>;
  referenceNumber: FormControl<string>;
  notes: FormControl<string>;
}> { }

@Component({
  selector: 'emp-pmt-payment-order-header',
  templateUrl: './payment-order-header.component.html',
})
export class PaymentOrderHeaderComponent implements OnInit, OnChanges, OnDestroy {

  @Input() isSaved = false;

  @Input() paymentOrder: PaymentOrder = EmptyPaymentOrder;

  @Input() actions: PaymentOrderActions = EmptyPaymentOrderActions;

  @Output() paymentOrderHeaderEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: PaymentOrderFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  isLoadingPaymentAccounts = false;

  organizationalUnitsList: Identifiable[] = [];

  paymentOrderTypesList: Identifiable[] = [];

  paymentMethodsList: PaymentMethod[] = [];

  currenciesList: Identifiable[] = [];

  paymentAccountsList: PaymentAccount[] = [];

  linkedToAccount = false;

  providersAPI = SearcherAPIS.provider;


  constructor(private uiLayer: PresentationLayer,
              private paymentOrdersData: PaymentOrdersDataService,
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

    this.validateFieldsRequired();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get hasActions(): boolean {
    return this.actions.canUpdate || this.actions.canDelete || this.actions.canSendToPay;
  }


  get paymentAccountPlaceholder(): string {
    if (!this.editionMode) {
      return this.linkedToAccount ? 'No determinado' : 'No aplica';
    }

    if (!this.form.getRawValue().paymentMethodUID) {
      return 'Seleccione método de pago...';
    }

    if (this.linkedToAccount) {
      return !this.form.getRawValue().payToUID ? 'Seleccione pagar a...' : 'Seleccionar';
    } else {
      return 'No aplica';
    }
  }


  get referenceNumberPlaceholder(): string {
    if (!this.editionMode) {
      return this.linkedToAccount ? 'No determinado' : 'No aplica';
    }

    if (!this.form.getRawValue().paymentMethodUID) {
      return 'Seleccione método de pago...';
    }

    return this.linkedToAccount ? '' : 'No aplica';
  }


  onPayToChanges(payTo: Identifiable) {
    this.validateGetPaymentAccounts();
  }


  onPaymentMethodChanges(paymentMethod: PaymentMethod) {
    this.setLinkedToAccount(paymentMethod);
    this.resetPaymentAccountControl();
    this.validatePaymentAccountControlsRequired();
    this.validatePaymentAccountControlsDisabled();
    this.validateGetPaymentAccounts();
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.isSaved ? PaymentOrderHeaderEventType.UPDATE :
        PaymentOrderHeaderEventType.CREATE;

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

    this.paymentOrdersData.getPartyPaymentAccouts(partyUID)
      .firstValue()
      .then(x => this.paymentAccountsList = x)
      .finally(() => this.isLoadingPaymentAccounts = false);
  }


  private validateGetPaymentAccounts() {
    if (this.form.controls.paymentMethodUID.valid && this.linkedToAccount && this.form.controls.payToUID.valid) {
      const partyUID = this.form.value.payToUID;
      this.getPaymentAccouts(partyUID)
      return;
    }

    this.paymentAccountsList = [];
  }


  private validateInitPaymentAccountsList() {
    this.paymentAccountsList =
      ArrayLibrary.insertIfNotExist(this.paymentAccountsList ?? [], this.paymentOrder.paymentAccount, 'uid');
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      requestedByUID: ['', Validators.required],
      controlNo: ['', Validators.required],
      dueTime: ['' as DateString, Validators.required],
      payToUID: ['', Validators.required],
      paymentMethodUID: ['', Validators.required],
      total: [null as number, Validators.required],
      currencyUID: ['', Validators.required],
      paymentAccountUID: [''],
      referenceNumber: [''],
      notes: [''],
    });
  }


  private setFormData() {
    setTimeout(() => {
      this.form.reset({
        requestedByUID: isEmpty(this.paymentOrder.requestedBy) ? null : this.paymentOrder.requestedBy.uid,
        controlNo: this.paymentOrder.controlNo ?? '',
        dueTime: this.paymentOrder.dueTime ?? '',
        payToUID: isEmpty(this.paymentOrder.payTo) ? null : this.paymentOrder.payTo.uid,
        paymentMethodUID: isEmpty(this.paymentOrder.paymentMethod) ? null : this.paymentOrder.paymentMethod.uid,
        total: this.paymentOrder.total ?? null,
        currencyUID: isEmpty(this.paymentOrder.currency) ? null : this.paymentOrder.currency.uid,
        paymentAccountUID: isEmpty(this.paymentOrder.paymentAccount) ? null : this.paymentOrder.paymentAccount.uid,
        referenceNumber: this.paymentOrder.referenceNumber ?? '',
        notes: this.paymentOrder.notes ?? '',
      });
    });

    this.setLinkedToAccount(this.paymentOrder.paymentMethod);
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


  private setLinkedToAccount(paymentMethod: PaymentMethod) {
    this.linkedToAccount = isEmpty(paymentMethod) ? false : paymentMethod.linkedToAccount;
  }


  private resetPaymentAccountControl() {
    this.form.controls.paymentAccountUID.reset();
    this.form.controls.referenceNumber.reset();
  }


  private validatePaymentAccountControlsRequired() {
    const payableAccountNotRequired = !this.linkedToAccount;

    if (payableAccountNotRequired) {
      FormHelper.clearControlValidators(this.form.controls.paymentAccountUID);
      FormHelper.clearControlValidators(this.form.controls.referenceNumber);
    } else {
      FormHelper.setControlValidators(this.form.controls.paymentAccountUID, Validators.required);
      FormHelper.setControlValidators(this.form.controls.referenceNumber, Validators.required);
    }
  }


  private validatePaymentAccountControlsDisabled() {
    const payableAccountDisabled = !this.linkedToAccount || !this.editionMode;
    FormHelper.setDisableControl(this.form.controls.paymentAccountUID, payableAccountDisabled);
    FormHelper.setDisableControl(this.form.controls.referenceNumber, payableAccountDisabled);
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
