/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo } from '@app/core';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { EmptyPaymentTimeWindow, PaymentTimeWindow } from '@app/models';


export enum PaymentTimeWindowSelectorEventType {
  UPDATE = 'PaymentTimeWindowSelector.Event.Update',
}


interface PaymentTimeWindowSelectorFormModel extends FormGroup<{
  startTime: FormControl<string>;
  endTime: FormControl<string>;
}> { }

@Component({
  selector: 'emp-pmt-time-window-selector',
  templateUrl: './time-window-selector.component.html',
})
export class PaymentTimeWindowSelectorComponent implements OnChanges {

  @Input() data: PaymentTimeWindow = Object.assign({}, EmptyPaymentTimeWindow);

  @Input() submitted= false;

  @Output() paymentTimeWindowSelectorEvent = new EventEmitter<EventInfo>();

  form: PaymentTimeWindowSelectorFormModel;

  formHelper = FormHelper;


  constructor() {
    this.initForm();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.setFormData();
    }
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      sendEvent(this.paymentTimeWindowSelectorEvent, PaymentTimeWindowSelectorEventType.UPDATE,
        { dataFields: this.getFormData() });
    }
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
    });
  }


  private setFormData() {
    setTimeout(() => {
      this.form.reset({
        startTime: this.data.startTime ?? '',
        endTime: this.data.endTime ?? '',
      });
    });
  }


  private getFormData(): PaymentTimeWindow {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const data: PaymentTimeWindow = {
      startTime: this.form.value.startTime ?? '',
      endTime: this.form.value.endTime ?? '',
    };

    return data;
  }

}
