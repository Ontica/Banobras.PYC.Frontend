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

import { Assertion, DateString, EventInfo, Identifiable, Validate, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { CataloguesStateSelector, PaymentsStateSelector } from '@app/presentation/exported.presentation.types';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { SearcherAPIS, SuppliersDataService } from '@app/data-services';

import { PaymentAccount, PaymentMethod, PaymentOrderRequestFields } from '@app/models';


export enum  PaymentOrderRequestEventType {
  CLOSE_MODAL_CLICKED = 'PaymentOrderRequestComponent.Event.CloseModalClicked',
  REQUEST_CLICKED     = 'PaymentOrderRequestComponent.Event.RequestClicked',
}

interface  PaymentOrderFormModel extends FormGroup<{
  paymentTypeUID: FormControl<string>;
  paymentMethodUID: FormControl<string>;
  paymentAccountUID: FormControl<string>;
  referenceNumber: FormControl<string>;
  total: FormControl<number>;
  dueTime: FormControl<DateString>;
  debtorUID: FormControl<string>;
  description: FormControl<string>;
}> { }

@Component({
  selector: 'emp-pmt-payment-order-request',
  templateUrl: './payment-order-request.component.html',
})
export class PaymentOrderRequestComponent implements OnChanges, OnInit, OnDestroy {

  @Input() entityUID = null;

  @Input() entityTotal: number = 0;

  @Input() supplierUID = null;

  @Input() totalRequired = false;

  @Output() paymentOrderRequestEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: PaymentOrderFormModel;

  formHelper = FormHelper;

  isLoading = false;

  paymentTypesList: Identifiable[] = [];

  allPaymentAccountsList: PaymentAccount[] = [];

  paymentAccountsList: PaymentAccount[] = [];

  paymentMethodsList: PaymentMethod[] = [];

  providersAPI = SearcherAPIS.provider;

  accountRelated = false;

  askForReferenceNumber = false;


  constructor(private uiLayer: PresentationLayer,
              private suppliersData: SuppliersDataService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.entityTotal) {
      this.validateTotalField();
    }
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

    return this.askForReferenceNumber ? '' : 'No aplica';
  }


  onCloseModalClicked() {
    sendEvent(this.paymentOrderRequestEvent, PaymentOrderRequestEventType.CLOSE_MODAL_CLICKED);
  }


  onPaymentMethodChanges(paymentMethod: PaymentMethod) {
    this.form.controls.paymentAccountUID.reset();
    this.form.controls.referenceNumber.reset();

    this.setAccountRelated(paymentMethod);
    this.setAskForReferenceNumber(null);
    this.setPaymentAccountsValid(paymentMethod);
    this.validatePaymentFields();
  }


  onPaymentAccountChanges(account: PaymentAccount) {
    this.form.controls.referenceNumber.reset(account?.referenceNumber ?? null);

    this.setAskForReferenceNumber(account);
    this.validatePaymentFields();
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
      this.helper.select<PaymentMethod[]>(PaymentsStateSelector.PAYMENT_TYPES),
      this.helper.select<PaymentMethod[]>(CataloguesStateSelector.PAYMENTS_METHODS),
      this.suppliersData.getSupplierPaymentAccounts(this.supplierUID),
    ])
    .subscribe(([a, b, c]) => {
      this.paymentTypesList = a;
      this.paymentMethodsList = b;
      this.allPaymentAccountsList = c;
      this.isLoading = false;
    });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      paymentTypeUID: ['', Validators.required],
      paymentMethodUID: ['', Validators.required],
      paymentAccountUID: ['', Validators.required],
      referenceNumber: ['', Validators.required],
      total: [null as number, [Validators.required, Validate.isPositive]],
      dueTime: [null as DateString],
      debtorUID: [''],
      description: [''],
    });

    this.setAccountRelated(null);
    this.setAskForReferenceNumber(null);
    this.validatePaymentFields();
  }


  private getFormData(): PaymentOrderRequestFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formData = this.form.getRawValue();

    const data: PaymentOrderRequestFields = {
      paymentTypeUID: formData.paymentTypeUID ?? '',
      paymentMethodUID: formData.paymentMethodUID ?? '',
      paymentAccountUID: formData.paymentAccountUID ?? '',
      referenceNumber: formData.referenceNumber ?? '',
      total: this.totalRequired ? formData.total : null,
      dueTime: formData.dueTime ?? '',
      debtorUID: formData.debtorUID ?? '',
      description: formData.description ?? '',
    };

    return data;
  }


  private validateTotalField() {
    if (this.totalRequired) {
      this.form.controls.total.reset(this.entityTotal > 0 ? this.entityTotal : null);
      FormHelper.setDisableControl(this.form.controls.total, this.entityTotal > 0);
      FormHelper.setControlValidators(this.form.controls.total, [Validators.required, Validate.isPositive]);
    } else {
      FormHelper.clearControlValidators(this.form.controls.total);
    }
  }


  private validatePaymentFields() {
    FormHelper.setDisableControl(this.form.controls.paymentAccountUID, !this.accountRelated);
    FormHelper.setDisableControl(this.form.controls.referenceNumber, !this.askForReferenceNumber);
  }


  private setAccountRelated(paymentMethod: PaymentMethod) {
    this.accountRelated = isEmpty(paymentMethod) ? false : paymentMethod.accountRelated;
  }


  private setAskForReferenceNumber(account: PaymentAccount) {
    this.askForReferenceNumber = isEmpty(account) ? false : account?.askForReferenceNumber;
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
