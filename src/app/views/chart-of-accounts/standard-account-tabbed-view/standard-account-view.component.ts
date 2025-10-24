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

import { MessageBoxService } from '@app/shared/services';

import { StandardAccount, EmptyStandardAccount, EmptyStandardAccountActions,
         StandardAccountActions } from '@app/models';

import { ConfirmSubmitModalEventType,
         ConfirmSubmitType } from '@app/views/entity-records/confirm-submit-modal/confirm-submit-modal.component';


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
  relatedAccount: FormControl<string>;
}> { }

@Component({
  selector: 'emp-financial-standard-account-view',
  templateUrl: './standard-account-view.component.html',
})
export class StandardAccountViewComponent implements OnChanges {

  @Input() standardAccount: StandardAccount = EmptyStandardAccount;

  @Input() actions: StandardAccountActions = EmptyStandardAccountActions;

  @Output() standardAccountViewEvent = new EventEmitter<EventInfo>();

  form: StandardAccountFormModel;

  formHelper = FormHelper;

  editionMode = false;

  confirmModalMode: ConfirmSubmitType = null;


  constructor(private messageBox: MessageBoxService) {
    this.initForm();
  }


  ngOnChanges() {
    this.setFormData();
  }


  onEventButtonClicked(mode: ConfirmSubmitType) {
    this.confirmModalMode = mode;
  }


  onConfirmSubmitModalEvent(event: EventInfo) {
    switch (event.type as ConfirmSubmitModalEventType) {
      case ConfirmSubmitModalEventType.CLOSE_BUTTON_CLICKED:
        this.confirmModalMode = null;
        return;
      case ConfirmSubmitModalEventType.SUBMIT_BUTTON_CLICKED:
        const dataFields: any = { message: event.payload.notes ?? null };
        this.validateActionConfirmedToEmit(dataFields);
        this.confirmModalMode = null;
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
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
      relatedAccount: [null],
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
      relatedAccount: this.standardAccount.relatedAccount?.name ?? null,
    });

    this.formHelper.setDisableForm(this.form, true);
  }


  private validateActionConfirmedToEmit(dataFields: any) {
    switch (this.confirmModalMode) {
      case 'Activate':
        this.messageBox.showInDevelopment('Activar cuenta estándar');
        return;
      case 'Suspend':
        this.messageBox.showInDevelopment('Suspender cuenta estándar');
        return;
      default:
        console.log(`Unhandled user interface action ${this.confirmModalMode}`);
        return;
    }
  }

}
