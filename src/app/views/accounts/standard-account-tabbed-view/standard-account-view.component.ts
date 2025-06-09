/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { DateString, DateStringLibrary, EventInfo } from '@app/core';

import { PERMISSIONS } from '@app/main-layout';

import { FormHelper } from '@app/shared/utils';

import { StandardAccount, EmptyStandardAccount } from '@app/models';

export enum StandardAccountViewEventType {
  ACCOUNT_UPDATED = 'StandardAccountViewComponent.Event.AccountUpdated',
}

interface StandardAccountFormModel extends FormGroup<{
  number: FormControl<string>;
  startDate: FormControl<DateString>;
  endDate: FormControl<DateString>;
  description: FormControl<string>;
  roleType: FormControl<string>;
  type: FormControl<string>;
  debtorCreditorType: FormControl<string>;
}> { }

@Component({
  selector: 'emp-cf-standard-account-view',
  templateUrl: './standard-account-view.component.html',
})
export class StandardAccountViewComponent implements OnChanges {

  @Input() standardAccount: StandardAccount = EmptyStandardAccount;

  @Output() standardAccountViewEvent = new EventEmitter<EventInfo>();

  permissions = PERMISSIONS;

  form: StandardAccountFormModel;

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
      number: [null],
      startDate: [null],
      endDate: [null],
      description: [null],
      roleType: [null],
      type: [null],
      debtorCreditorType: [null],
    });
  }


  private setFormData() {
    this.form.reset({
      number: this.standardAccount.number,
      startDate: DateStringLibrary.format(this.standardAccount.startDate),
      endDate: DateStringLibrary.format(this.standardAccount.endDate),
      description: this.standardAccount.description,
      roleType: this.standardAccount.roleType.name,
      type: this.standardAccount.type.name,
      debtorCreditorType: this.standardAccount.debtorCreditorType.name,
    });

    this.formHelper.setDisableForm(this.form, true);
  }

}
