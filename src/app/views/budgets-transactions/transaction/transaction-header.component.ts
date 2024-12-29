/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { ArrayLibrary, FormHelper, sendEvent } from '@app/shared/utils';

import { BudgetTransaction, TransactionActions, BudgetTransactionFields, EmptyBudgetTransaction,
         EmptyTransactionActions } from '@app/models';


export enum TransactionHeaderEventType {
  CREATE    = 'BudgetTransactionHeaderComponent.Event.CreateTransaction',
  UPDATE    = 'BudgetTransactionHeaderComponent.Event.UpdateTransaction',
  DELETE    = 'BudgetTransactionHeaderComponent.Event.DeleteTransaction',
  AUTHORIZE = 'BudgetTransactionHeaderComponent.Event.AuthorizeTransaction',
  REJECT    = 'BudgetTransactionHeaderComponent.Event.RejectTransaction',
}

interface TransactionFormModel extends FormGroup<{
  basePartyUID: FormControl<string>;
  budgetTypeUID: FormControl<string>;
  budgetUID: FormControl<string>;
  transactionTypeUID: FormControl<string>;
  operationSourceUID: FormControl<string>;
  description: FormControl<string>;
}> { }

@Component({
  selector: 'emp-bdg-transaction-header',
  templateUrl: './transaction-header.component.html',
})
export class BudgetTransactionHeaderComponent implements OnInit, OnChanges {

  @Input() isSaved = false;

  @Input() transaction: BudgetTransaction = EmptyBudgetTransaction;

  @Input() actions: TransactionActions = EmptyTransactionActions;

  @Output() transactionHeaderEvent = new EventEmitter<EventInfo>();

  form: TransactionFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  organizationalUnitsList: Identifiable[] = [];

  budgetTypesList: Identifiable[] = [];

  budgetsList: Identifiable[] = [];

  transactionTypesList: Identifiable[] = [];

  operationSourcesList: Identifiable[] = [];

  eventType = TransactionHeaderEventType;


  constructor(private messageBox: MessageBoxService) {
    this.initForm();
    this.enableEditor(true);
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.transaction && this.isSaved) {
      this.enableEditor(false);
      this.validateDataLists();
    }
  }


  get hasActions(): boolean {
    return this.actions.canAuthorize || this.actions.canReject ||
           this.actions.canDelete || this.actions.canUpdate;
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.isSaved ? TransactionHeaderEventType.UPDATE : TransactionHeaderEventType.CREATE;
      sendEvent(this.transactionHeaderEvent, eventType, { dataFields: this.getFormData() });
    }
  }


  onEventButtonClicked(eventType: TransactionHeaderEventType) {
    this.showConfirmMessage(eventType);
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;

    if (!this.editionMode && this.isSaved) {
      this.setFormData();
    }

    const disable = this.isSaved && (!this.editionMode || !this.actions.canUpdate);

    setTimeout(() => this.formHelper.setDisableForm(this.form, disable));
  }


  private loadDataLists() {

  }


  private validateDataLists() {
    this.organizationalUnitsList =
      ArrayLibrary.insertIfNotExist(this.organizationalUnitsList ?? [], this.transaction.baseParty, 'uid');
    this.budgetTypesList =
      ArrayLibrary.insertIfNotExist(this.budgetTypesList ?? [], this.transaction.budgetType, 'uid');
    this.budgetsList =
      ArrayLibrary.insertIfNotExist(this.budgetsList ?? [], this.transaction.budget, 'uid');
    this.transactionTypesList =
      ArrayLibrary.insertIfNotExist(this.transactionTypesList ?? [], this.transaction.transactionType, 'uid');
    this.operationSourcesList =
      ArrayLibrary.insertIfNotExist(this.operationSourcesList ?? [], this.transaction.operationSource, 'uid');
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      basePartyUID: ['', Validators.required],
      budgetTypeUID: ['', Validators.required],
      budgetUID: ['', Validators.required],
      transactionTypeUID: ['', Validators.required],
      operationSourceUID: ['', Validators.required],
      description: ['', Validators.required],
    });
  }


  private setFormData() {
    setTimeout(() => {
      this.form.reset({
        basePartyUID: isEmpty(this.transaction.baseParty) ? null : this.transaction.baseParty.uid,
        budgetTypeUID: isEmpty(this.transaction.budgetType) ? null : this.transaction.budgetType.uid,
        budgetUID: isEmpty(this.transaction.budget) ? null : this.transaction.budget.uid,
        transactionTypeUID: isEmpty(this.transaction.transactionType) ? null : this.transaction.transactionType.uid,
        operationSourceUID: isEmpty(this.transaction.operationSource) ? null : this.transaction.operationSource.uid,
        description: this.transaction.description ?? '',
      });
    });
  }


  private getFormData(): BudgetTransactionFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const data: BudgetTransactionFields = {

    };

    return data;
  }


  private showConfirmMessage(eventType: TransactionHeaderEventType) {
    const confirmType = this.getConfirmType(eventType);
    const title = this.getConfirmTitle(eventType);
    const message = this.getConfirmMessage(eventType);

    this.messageBox.confirm(message, title, confirmType)
      .firstValue()
      .then(x => this.validateAndSendEvent(eventType, x));
  }


  private getConfirmType(eventType: TransactionHeaderEventType): 'AcceptCancel' | 'DeleteCancel' {
    switch (eventType) {
      case TransactionHeaderEventType.DELETE:
      case TransactionHeaderEventType.REJECT:
        return 'DeleteCancel';
      case TransactionHeaderEventType.AUTHORIZE:
      default:
        return 'AcceptCancel';
    }
  }


  private getConfirmTitle(eventType: TransactionHeaderEventType): string {
    switch (eventType) {
      case TransactionHeaderEventType.DELETE: return 'Eliminar transacción';
      case TransactionHeaderEventType.REJECT: return 'Rechazar transacción';
      case TransactionHeaderEventType.AUTHORIZE: return 'Autorizar transacción';
      default: return '';
    }
  }


  private getConfirmMessage(eventType: TransactionHeaderEventType): string {
    switch (eventType) {
      case TransactionHeaderEventType.DELETE:
        return `Esta operación eliminará la transacción
                <strong>${this.transaction.transactionNo}: ${this.transaction.transactionType.name}</strong>
                de <strong>${this.transaction.baseParty.name}</strong>.

                <br><br>¿Elimino la transacción?`;
      case TransactionHeaderEventType.REJECT:
        return `Esta operación rechazará la transacción
                <strong>${this.transaction.transactionNo}: ${this.transaction.transactionType.name}</strong>
                de <strong>${this.transaction.baseParty.name}</strong>.

                <br><br>¿Rechazo la transacción?`;
      case TransactionHeaderEventType.AUTHORIZE:
        return `Esta operación autorizará la transacción
                <strong>${this.transaction.transactionNo}: ${this.transaction.transactionType.name}</strong>
                de <strong>${this.transaction.baseParty.name}</strong>.

                <br><br>¿Autorizo la transacción?`;
      default: return '';
    }
  }


  private validateAndSendEvent(eventType: TransactionHeaderEventType, send: boolean) {
    if (send) {
      sendEvent(this.transactionHeaderEvent, eventType, { transactionUID: this.transaction.uid });
    }
  }

}
