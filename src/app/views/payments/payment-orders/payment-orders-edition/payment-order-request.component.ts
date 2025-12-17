/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { combineLatest } from 'rxjs';

import { Assertion, DateString, EventInfo, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

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
  referenceNumber: FormControl<string>;
  dueTime: FormControl<DateString>;
  description: FormControl<string>;
}> { }

@Component({
  selector: 'emp-pmt-payment-order-request',
  templateUrl: './payment-order-request.component.html',
})
export class PaymentOrderRequestComponent implements OnInit, OnDestroy {

  @Input() entityUID = null;

  @Input() supplierUID = null;

  @Output() paymentOrderRequestEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: PaymentOrderFormModel;

  formHelper = FormHelper;

  isLoading = false;

  allPaymentAccountsList: PaymentAccount[] = [];

  paymentAccountsList: PaymentAccount[] = [];

  paymentMethodsList: PaymentMethod[] = [];

  accountRelated = false;


  constructor(private uiLayer: PresentationLayer,
              private suppliersData: SuppliersDataService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get paymentAccountPlaceholder(): string {
    if (!this.form.getRawValue().paymentMethodUID) {
      return 'Seleccione método de pago';
    }

    return this.accountRelated ? 'Seleccionar' : 'No aplica';
  }


  get referenceNumberPlaceholder(): string {
    if (!this.form.getRawValue().paymentMethodUID) {
      return 'Seleccione cuenta';
    }

    if (this.accountRelated && !this.form.getRawValue().paymentAccountUID) {
      return 'Seleccione cuenta';
    }

    return this.accountRelated ? '' : 'No aplica';
  }


  onCloseModalClicked() {
    sendEvent(this.paymentOrderRequestEvent, PaymentOrderRequestEventType.CLOSE_MODAL_CLICKED);
  }


  onPaymentMethodChanges(paymentMethod: PaymentMethod) {
    this.form.controls.paymentAccountUID.reset();
    this.form.controls.referenceNumber.reset();
    this.setAccountRelated(paymentMethod);
    this.setPaymentAccountsValid(paymentMethod);
    this.validateFieldsDisable();
  }


  onPaymentAccountChanges(account: PaymentAccount) {
    this.form.controls.referenceNumber.reset(account?.referenceNumber ?? null);
    this.validateFieldsDisable();
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


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<PaymentMethod[]>(CataloguesStateSelector.PAYMENTS_METHODS),
      this.suppliersData.getSupplierPaymentAccounts(this.supplierUID),
    ])
    .subscribe(([a, b]) => {
      this.paymentMethodsList = a;
      this.allPaymentAccountsList = b;
      this.isLoading = false;
    });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      paymentMethodUID: ['', Validators.required],
      paymentAccountUID: ['', Validators.required],
      referenceNumber: ['', Validators.required],
      dueTime: [null as DateString],
      description: [''],
    });

    this.validateFieldsDisable();
  }


  private getFormData(): PaymentOrderRequestFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formData = this.form.getRawValue();

    const data: PaymentOrderRequestFields = {
      paymentMethodUID: formData.paymentMethodUID ?? '',
      paymentAccountUID: formData.paymentAccountUID ?? '',
      referenceNumber: formData.referenceNumber ?? '',
      dueTime: formData.dueTime ?? '',
      description: formData.description ?? '',
    };

    return data;
  }


  private validateFieldsDisable() {
    const disabled = !this.form.controls.paymentAccountUID.valid || !!this.form.getRawValue().referenceNumber;
    FormHelper.setDisableControl(this.form.controls.referenceNumber, disabled);
    FormHelper.setDisableControl(this.form.controls.paymentAccountUID, !this.accountRelated);
  }


  private setAccountRelated(paymentMethod: PaymentMethod) {
    this.accountRelated = isEmpty(paymentMethod) ? false : paymentMethod.accountRelated;
  }


  private setPaymentAccountsValid(paymentMethod: PaymentMethod) {
    if (isEmpty(paymentMethod)) {
      this.paymentAccountsList = [];
    } else {
      this.paymentAccountsList =
        [...[], ...this.allPaymentAccountsList.filter(x => x.paymentMethod.uid === paymentMethod.uid)];
    }
  }

}
