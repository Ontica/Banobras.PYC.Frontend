/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, Validate } from '@app/core';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { PayrollsQuery, EmptyPayrollsQuery, EntityStatus, DateRange, EmptyDateRange,
         PayrollsStatusList } from '@app/models';


export enum PayrollsFilterEventType {
  SEARCH_CLICKED = 'PayrollsFilterComponent.Event.SearchClicked',
}


interface PayrollsFilterFormModel extends FormGroup<{
  datePeriod: FormControl<DateRange>;
  status: FormControl<EntityStatus>;
}> { }


@Component({
  selector: 'emp-pyc-payrolls-filter',
  templateUrl: './payrolls-filter.component.html',
})
export class PayrollsFilterComponent implements OnChanges {

  @Input() query: PayrollsQuery = Object.assign({}, EmptyPayrollsQuery);

  @Output() payrollsFilterEvent = new EventEmitter<EventInfo>();

  form: PayrollsFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  statusList = PayrollsStatusList;


  constructor() {
    this.initForm();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.query) {
      this.setFormData();
    }
  }


  onSearchClicked() {
    if (this.form.invalid) {
      FormHelper.markFormControlsAsTouched(this.form);
      return;
    }

    const payload = { query: this.getFormData() };
    sendEvent(this.payrollsFilterEvent, PayrollsFilterEventType.SEARCH_CLICKED, payload);
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      datePeriod: [EmptyDateRange, [Validators.required, Validate.periodRequired]],
      status: [null as EntityStatus],
    });
  }


  private setFormData() {
    this.form.reset({
      datePeriod: { fromDate: this.query.fromDate ?? null, toDate: this.query.toDate ?? null },
      status: this.query.status,
    });
  }


  private getFormData(): PayrollsQuery {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const query: PayrollsQuery = {
      fromDate: this.form.value.datePeriod?.fromDate ?? null,
      toDate: this.form.value.datePeriod?.toDate ?? null,
      status: this.form.value.status ?? null,
    };

    return query;
  }

}
