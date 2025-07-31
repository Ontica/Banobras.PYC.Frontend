/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { DateString } from '@app/core';

import { FormHelper } from '@app/shared/utils';

import { CashTransactionDescriptor, EmptyCashTransactionDescriptor } from '@app/models';


interface CashTransactionFormModel extends FormGroup<{
  ledger: FormControl<string>;
  source: FormControl<string>;
  transactionType: FormControl<string>;
  recordingDate: FormControl<DateString>;
  elaboratedBy: FormControl<string>;
  voucherType: FormControl<string>;
  accountingDate: FormControl<DateString>;
  concept: FormControl<string>;
}> { }

@Component({
  selector: 'emp-cf-cash-transaction-view',
  templateUrl: './transaction-view.component.html',
})
export class CashTransactionViewComponent implements OnChanges {

  @Input() transaction: CashTransactionDescriptor = EmptyCashTransactionDescriptor;

  form: CashTransactionFormModel;

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
      ledger: [null],
      source: [null],
      transactionType: [null],
      recordingDate: [null],
      elaboratedBy: [null],
      voucherType: [null],
      accountingDate: [null],
      concept: [null],
    });
  }


  private setFormData() {
    this.form.reset({
      ledger: this.transaction.ledgerName,
      source: this.transaction.sourceName,
      transactionType: this.transaction.transactionTypeName,
      recordingDate: this.transaction.recordingDate,
      elaboratedBy: this.transaction.elaboratedBy,
      voucherType: this.transaction.voucherTypeName,
      accountingDate: this.transaction.accountingDate,
      concept: this.transaction.concept,
    });

    this.formHelper.setDisableForm(this.form, true);
  }

}
