/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { SkipIf } from '@app/shared/decorators';

import { MessageBoxService } from '@app/shared/services';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { SearcherAPIS, TravelExpensesDataService } from '@app/data-services';

import {TravelExpensesDataFields } from '@app/models';


export enum  TravelExpensesRequestEventType {
  CLOSE_MODAL_CLICKED = 'TravelExpensesRequestComponent.Event.CloseModalClicked',
  REQUESTED           = 'TravelExpensesRequestComponent.Event.Requested',
}

interface TravelExpensesFormModel extends FormGroup<{
  commissionNo: FormControl<string>;
  commissionerUID: FormControl<string>;
  paymentAccountUID: FormControl<string>;
}> { }

@Component({
  selector: 'emp-pmt-travel-expenses-request',
  templateUrl: './travel-expenses-request.component.html',
})
export class TravelExpensesRequestComponent {

  @Input() baseObjectUID = null;

  @Output() travelExpensesRequestEvent = new EventEmitter<EventInfo>();

  title = 'Solicitud de pago de viáticos';

  form: TravelExpensesFormModel;

  formHelper = FormHelper;

  isLoading = false;

  submitted = false;

  paymentAccountsList: Identifiable[] = [];

  pdfFile = null;

  isFormInvalidated = false;

  commissionersAPI = SearcherAPIS.commissioners;


  constructor(private travelExpensesData: TravelExpensesDataService,
              private messageBox: MessageBoxService) {
    this.initForm();
  }


  get isFormReady(): boolean {
    const pdfValid = !!this.pdfFile?.file;
    return FormHelper.isFormReady(this.form) && pdfValid;
  }


  @SkipIf('submitted')
  onCloseModalClicked() {
    sendEvent(this.travelExpensesRequestEvent, TravelExpensesRequestEventType.CLOSE_MODAL_CLICKED);
  }


  @SkipIf('submitted')
  onCommissionerChanges(commissioner: Identifiable) {
    this.form.controls.paymentAccountUID.reset();

    this.validatePaymentAccountDisabled();

    this.setPaymentAccountsList([]);

    if (!isEmpty(commissioner)) {
      this.getPaymentAccount(commissioner.uid);
    }
  }


  @SkipIf('submitted')
  onSubmitButtonClicked() {
    this.isFormInvalidated = true;

    if (FormHelper.isFormReadyAndInvalidate(this.form) && this.isFormReady) {
      const dataFields = this.getFormData();
      const pdfFile = this.pdfFile?.file ?? null;

      this.requestPayment(dataFields, pdfFile);
    }
  }


  private getPaymentAccount(commissionerUID: string) {
    this.isLoading = true;

    this.travelExpensesData.getCommissionerPaymentAccounts(commissionerUID)
      .firstValue()
      .then(x => this.setPaymentAccountsList(x))
      .catch(() => this.setPaymentAccountsList([]))
      .finally(() => this.isLoading = false);
  }



  private requestPayment(dataFields: TravelExpensesDataFields, pdfFile: File) {
    this.submitted = true;

    this.travelExpensesData.requestPayment(dataFields, pdfFile)
      .firstValue()
      .then(x => this.resolveRequestPayment(x.message))
      .finally(() => this.submitted = false);
  }


  private resolveRequestPayment(message: string) {
    this.messageBox.show(message, this.title);

    sendEvent(this.travelExpensesRequestEvent, TravelExpensesRequestEventType.REQUESTED,
      { baseObjectUID: this.baseObjectUID });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      commissionNo: ['', Validators.required],
      commissionerUID: ['', Validators.required],
      paymentAccountUID: ['', Validators.required],
    });

    this.validatePaymentAccountDisabled();
  }


  private getFormData(): TravelExpensesDataFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formData = this.form.getRawValue();

    const data: TravelExpensesDataFields = {
      requisitionUID: this.baseObjectUID,
      commissionNo: formData.commissionNo ?? '',
      commissionerUID: formData.commissionerUID ?? '',
      paymentAccountUID: formData.paymentAccountUID ?? '',
    };

    return data;
  }


  private validatePaymentAccountDisabled() {
    const disabled = this.form.controls.commissionerUID.invalid;
    FormHelper.setDisableControl(this.form.controls.paymentAccountUID, disabled);
  }


  private setPaymentAccountsList(data: Identifiable[]) {
    this.paymentAccountsList = data ?? [];
  }

}
