/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { DateString, DateStringLibrary, EventInfo } from '@app/core';

import { FormHelper } from '@app/shared/utils';

import { FinancialConcept, EmptyFinancialConcept, BaseActions, EmptyBaseActions } from '@app/models';


export enum FinancialConceptViewEventType {
  UPDATE = 'FinancialConceptViewComponent.Event.Update',
}


interface FinancialConceptFormModel extends FormGroup<{
  group: FormControl<string>;
  number: FormControl<string>;
  name: FormControl<string>;
  description: FormControl<string>;
  startDate: FormControl<DateString>;
  endDate: FormControl<DateString>;
}> { }

@Component({
  selector: 'emp-cf-financial-concept-view',
  templateUrl: './financial-concept-view.component.html',
})
export class FinancialConceptViewComponent implements OnChanges {

  @Input() concept: FinancialConcept = EmptyFinancialConcept;

  @Input() actions: BaseActions = EmptyBaseActions;

  @Output() financialConceptViewEvent = new EventEmitter<EventInfo>();

  form: FinancialConceptFormModel;

  formHelper = FormHelper;

  editionMode = false;


  constructor() {
    this.initForm();
  }


  ngOnChanges() {
    this.setFormData();
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      group: [null],
      number: [null],
      name: [null],
      description: [null],
      startDate: [null],
      endDate: [null],
    });
  }


  private setFormData() {
    this.form.reset({
      group: this.concept.group.name,
      number: this.concept.number,
      name: this.concept.name,
      description: this.concept.description,
      startDate: DateStringLibrary.format(this.concept.startDate),
      endDate: DateStringLibrary.format(this.concept.endDate),
    });

    this.formHelper.setDisableForm(this.form, true);
  }

}
