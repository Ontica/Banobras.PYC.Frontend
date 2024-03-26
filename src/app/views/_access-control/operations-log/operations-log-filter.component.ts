/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { pairwise, startWith } from 'rxjs';

import { EventInfo, Identifiable, Validate } from '@app/core';

import { OperationsLogQuery, OperationsLogTypeList, DateRange, EmptyDateRange } from '@app/models';

import { FormHelper, sendEvent } from '@app/shared/utils';


export enum OperationsLogFilterEventType {
  FILTER_CHANGED = 'OperationsLogFilterComponent.Event.FilterChanged',
}


interface OperationsLogFilterFormModel extends FormGroup<{
  type: FormControl<string>;
  period: FormControl<DateRange>;
}> { }


interface OperationsLogFilterFormPartial {
  type: string;
  period: DateRange;
}


const EmptyOperationsLogFilter: OperationsLogFilterFormPartial = { type: '', period: EmptyDateRange };

@Component({
  selector: 'emp-ng-operations-log-filter',
  templateUrl: './operations-log-filter.component.html',
})
export class OperationsLogFilterComponent implements OnChanges {

  @Input() submitted = false;

  @Output() operationsLogFilterEvent = new EventEmitter<EventInfo>();

  form: OperationsLogFilterFormModel;

  formHelper = FormHelper;

  typeList: Identifiable[] = OperationsLogTypeList;


  constructor() {
    this.initForm();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.submitted) {
      this.setDisableForm(this.submitted);
    }
  }


  invalidateForm() {
    this.formHelper.markFormControlsAsTouched(this.form);
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      type: ['', Validators.required],
      period: [EmptyDateRange, [Validators.required, Validate.periodRequired]],
    });

    this.setDisableForm(false);
    this.subscribeFormToValuesChanges();
  }


  private setDisableForm(disable: boolean) {
    FormHelper.setDisableForm(this.form, disable);
  }


  private subscribeFormToValuesChanges() {
    this.form
      .valueChanges
      .pipe(startWith(EmptyOperationsLogFilter), pairwise())
      .subscribe(([prev, next]: [OperationsLogFilterFormPartial, OperationsLogFilterFormPartial]) => {
        if (this.validateIfValuesChanged(prev, next)) {
          this.emitFormChanges();
        }
      });
  }


  private validateIfValuesChanged(prev: OperationsLogFilterFormPartial, next: OperationsLogFilterFormPartial) {
    return prev.type !== next.type ||
           prev.period.fromDate !== next.period.fromDate ||
           prev.period.toDate !== next.period.toDate
  }


  private emitFormChanges() {
    const payload = {
      isFormValid: this.form.valid,
      query: this.getFormData(),
    };

    sendEvent(this.operationsLogFilterEvent, OperationsLogFilterEventType.FILTER_CHANGED, payload);
  }


  private getFormData(): OperationsLogQuery {
    const query: OperationsLogQuery = {
      operationLogType: this.form.value.type,
      fromDate: this.form.value.period?.fromDate ?? '',
      toDate: this.form.value.period?.toDate ?? '',
    };

    return query;
  }

}
