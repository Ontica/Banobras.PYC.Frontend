/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, DateString, EventInfo, isEmpty } from '@app/core';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { SuppliersDataService } from '@app/data-services';

import { PaymentAccount, PaymentMethod, PaymentOrderRequestFields } from '@app/models';


export enum  PaymentOrderRequestEventType {
  CLOSE_MODAL_CLICKED = 'PaymentOrderRequestComponent.Event.CloseModalClicked',
  REQUEST_CLICKED     = 'PaymentOrderRequestComponent.Event.RequestClicked',
}

interface  PaymentOrderFormModel extends FormGroup<{
  paymentMethodUID: FormControl<string>;
  paymentAccountUID: FormControl<string>;
  dueTime: FormControl<DateString>;
  description: FormControl<string>;
}> { }

@Component({
  selector: 'emp-pmt-payment-order-request',
  templateUrl: './payment-order-request.component.html',
})
export class PaymentOrderRequestComponent implements OnInit {

  @Input() entityUID = null;

  @Input() supplierUID = null;

  @Output() paymentOrderRequestEvent = new EventEmitter<EventInfo>();

  form: PaymentOrderFormModel;

  formHelper = FormHelper;

  isLoading = false;

  paymentAccountsList: PaymentAccount[] = [];

  paymentMethodsList: PaymentMethod[] = [];


  constructor(private suppliersData: SuppliersDataService) {
    this.initForm();
  }


  ngOnInit() {
    this.getPaymentAccounts();
  }


  onCloseModalClicked() {
    sendEvent(this.paymentOrderRequestEvent, PaymentOrderRequestEventType.CLOSE_MODAL_CLICKED);
  }


  onPaymentAccountChanges(account: PaymentAccount) {
    const paymentMethod = isEmpty(account?.paymentMethod) ? null : account.paymentMethod;
    this.form.controls.paymentMethodUID.reset(paymentMethod?.uid ?? null);
    this.paymentMethodsList = isEmpty(paymentMethod) ? [] : [account.paymentMethod];
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const payload = {
        entityUID: this.entityUID,
        dataFields: this.getFormData()
      };

      sendEvent(this.paymentOrderRequestEvent, PaymentOrderRequestEventType.REQUEST_CLICKED, payload);
    }
  }


  private getPaymentAccounts() {
    this.isLoading = true;

    this.suppliersData.getSupplierPaymentAccounts(this.supplierUID)
      .firstValue()
      .then(x => this.paymentAccountsList = x)
      .finally(() => this.isLoading = false);
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      paymentMethodUID: ['', Validators.required],
      paymentAccountUID: ['', Validators.required],
      dueTime: [null as DateString, Validators.required],
      description: [''],
    });
  }


  private getFormData(): PaymentOrderRequestFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const data: PaymentOrderRequestFields = {
      paymentMethodUID: this.form.value.paymentMethodUID ?? '',
      paymentAccountUID: this.form.value.paymentAccountUID ?? '',
      dueTime: this.form.value.dueTime ?? '',
      description: this.form.value.description ?? '',
    };

    return data;
  }

}
