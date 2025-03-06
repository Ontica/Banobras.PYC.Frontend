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

import { SearcherAPIS } from '@app/data-services';

import { AssetTransaction, AssetTransactionFields, EmptyAssetTransaction, TransactionActions,
         EmptyTransactionActions } from '@app/models';


export enum TransactionHeaderEventType {
  CREATE    = 'FixedAssetTransactionHeaderComponent.Event.CreateTransaction',
  UPDATE    = 'FixedAssetTransactionHeaderComponent.Event.UpdateTransaction',
  AUTHORIZE = 'FixedAssetTransactionHeaderComponent.Event.AuthorizeTransaction',
  DELETE    = 'FixedAssetTransactionHeaderComponent.Event.DeleteTransaction',
  CLONE     = 'FixedAssetTransactionHeaderComponent.Event.CloneTransaction',
}

interface TransactionFormModel extends FormGroup<{
  assignedToUID: FormControl<string>;
  assignedToOrgUnitUID: FormControl<string>;
  transactionTypeUID: FormControl<string>;
  operationSourceUID: FormControl<string>;
  description: FormControl<string>;
}> { }

@Component({
  selector: 'emp-fa-transaction-header',
  templateUrl: './transaction-header.component.html',
})
export class FixedAssetTransactionHeaderComponent implements OnInit, OnChanges {

  @Input() isSaved = false;

  @Input() transaction: AssetTransaction = EmptyAssetTransaction;

  @Input() actions: TransactionActions = EmptyTransactionActions;

  @Output() transactionHeaderEvent = new EventEmitter<EventInfo>();

  form: TransactionFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  organizationalUnitsList: Identifiable[] = [];

  transactionTypesList: Identifiable[] = [];

  operationSourcesList: Identifiable[] = [];

  keepersAPI = SearcherAPIS.assetsTransactionsAssignees;


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
    return Object.values(this.actions).some(x => !!x);
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      let eventType = TransactionHeaderEventType.CREATE;

      if (this.isSaved) {
        eventType = TransactionHeaderEventType.UPDATE;
      }

      sendEvent(this.transactionHeaderEvent, eventType, { transactionFields: this.getFormData() });
    }
  }


  onAuthorizeButtonClicked() {
    this.showConfirmMessage(TransactionHeaderEventType.AUTHORIZE);
  }


  onDeleteButtonClicked() {
    this.showConfirmMessage(TransactionHeaderEventType.DELETE);
  }


  onCloneButtonClicked() {
    this.showConfirmMessage(TransactionHeaderEventType.CLONE);
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
    if (this.transaction.assignedToOrgUnit) {
      this.organizationalUnitsList =
        ArrayLibrary.insertIfNotExist(this.organizationalUnitsList ?? [], this.transaction.assignedToOrgUnit, 'uid');
    }
    this.transactionTypesList =
      ArrayLibrary.insertIfNotExist(this.transactionTypesList ?? [], this.transaction.transactionType, 'uid');
    this.operationSourcesList =
      ArrayLibrary.insertIfNotExist(this.operationSourcesList ?? [], this.transaction.operationSource, 'uid');
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      assignedToUID: ['', Validators.required],
      assignedToOrgUnitUID: ['', Validators.required],
      transactionTypeUID: ['', Validators.required],
      operationSourceUID: ['', Validators.required],
      description: ['', Validators.required],
    });
  }


  private setFormData() {
    setTimeout(() => {
      this.form.reset({
        assignedToUID: isEmpty(this.transaction.assignedTo) ? null : this.transaction.assignedTo.uid,
        assignedToOrgUnitUID: isEmpty(this.transaction.assignedToOrgUnit) ? null : this.transaction.assignedToOrgUnit.uid,
        transactionTypeUID: isEmpty(this.transaction.transactionType) ? null : this.transaction.transactionType.uid,
        operationSourceUID: isEmpty(this.transaction.operationSource) ? null : this.transaction.operationSource.uid,
        description: this.transaction.description ?? '',
      });
    });
  }


  private getFormData(): AssetTransactionFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const data: AssetTransactionFields = {

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
        return 'DeleteCancel';
      case TransactionHeaderEventType.AUTHORIZE:
      default:
        return 'AcceptCancel';
    }
  }


  private getConfirmTitle(eventType: TransactionHeaderEventType): string {
    switch (eventType) {
      case TransactionHeaderEventType.AUTHORIZE: return 'Autorizar transacción';
      case TransactionHeaderEventType.DELETE: return 'Eliminar transacción';
      case TransactionHeaderEventType.CLONE: return 'Clonar transacción';
      default: return '';
    }
  }


  private getConfirmMessage(eventType: TransactionHeaderEventType): string {
    switch (eventType) {
      case TransactionHeaderEventType.AUTHORIZE:
        return `Esta operación autotizará la transacción
                <strong>${this.transaction.transactionNo}: ${this.transaction.transactionType.name}</strong>
                de <strong>${this.transaction.assignedTo?.name} (${this.transaction.assignedToOrgUnit?.name})</strong>.

                <br><br>¿Autorizo la transacción?`;
      case TransactionHeaderEventType.DELETE:
        return `Esta operación eliminará la transacción
                <strong>${this.transaction.transactionNo}: ${this.transaction.transactionType.name}</strong>
                de <strong>${this.transaction.assignedTo?.name} (${this.transaction.assignedToOrgUnit?.name})</strong>.

                <br><br>¿Elimino la transacción?`;
      case TransactionHeaderEventType.CLONE:
        return `Esta operación clonará la transacción
                <strong>${this.transaction.transactionNo}: ${this.transaction.transactionType.name}</strong>
                de <strong>${this.transaction.assignedTo?.name} (${this.transaction.assignedToOrgUnit?.name})</strong>.

                <br><br>¿Clono la transacción?`;

      default: return '';
    }
  }


  private validateAndSendEvent(eventType: TransactionHeaderEventType, send: boolean) {
    if (send) {
      sendEvent(this.transactionHeaderEvent, eventType, { transactionUID: this.transaction.uid });
    }
  }

}
