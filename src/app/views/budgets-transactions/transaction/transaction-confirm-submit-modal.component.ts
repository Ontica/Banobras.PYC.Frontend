/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { BudgetTransaction, EmptyBudgetTransaction } from '@app/models';


export type TransactionSubmitType = 'Delete' | 'SendToAuthorization' | 'Authorize' | 'Reject';


export enum TransactionConfirmSubmitModalEventType {
  CLOSE_BUTTON_CLICKED  = 'BudgetTransactionConfirmSubmitModalComponent.Event.CloseButtonClicked',
  SUBMIT_BUTTON_CLICKED = 'BudgetTransactionConfirmSubmitModalComponent.Event.SubmitButtonClicked',
}

@Component({
  selector: 'emp-bdg-transaction-confirm-submit-modal',
  templateUrl: './transaction-confirm-submit-modal.component.html',
})
export class BudgetTransactionConfirmSubmitModalComponent {

  @Input() transaction: BudgetTransaction = EmptyBudgetTransaction;

  @Input() mode: TransactionSubmitType = null;

  @Output() transactionConfirmSubmitModalEvent = new EventEmitter<EventInfo>();

  notes = '';


  get showWarningColor(): boolean {
    return ['Delete', 'Reject'].includes(this.mode);
  }


  get notesRequired(): boolean {
    return this.mode === 'Reject';
  }


  get titleText(): string {
    switch (this.mode) {
      case 'Delete': return 'Eliminar transacción';
      case 'SendToAuthorization': return 'Enviar a autorización';
      case 'Authorize': return 'Autorizar transacción';
      case 'Reject': return 'Rechazar transacción';
      default: return 'Realizar operación'
    }
  }


  get actionText(): string {
    switch (this.mode) {
      case 'Delete': return 'eliminará';
      case 'SendToAuthorization': return 'enviará a autorización';
      case 'Authorize': return 'autorizará';
      case 'Reject': return 'rechazará';
      default: return 'realizará';
    }
  }


  get questionText(): string {
    switch (this.mode) {
      case 'Delete': return 'Elimino';
      case 'SendToAuthorization': return 'Envío a autorización';
      case 'Authorize': return 'Autorizo';
      case 'Reject': return 'Rechazo';
      default: return 'Realizo';
    }
  }


  get submitText(): string {
    switch (this.mode) {
      case 'Delete': return 'Eliminar';
      case 'SendToAuthorization': return 'Enviar';
      case 'Authorize': return 'Autorizar';
      case 'Reject': return 'Rechazar';
      default: return 'Aceptar';
    }
  }


  get isReady(): boolean {
    return this.notesRequired ? !!this.notes : true;
  }


  onCloseButtonClicked() {
    sendEvent(this.transactionConfirmSubmitModalEvent, TransactionConfirmSubmitModalEventType.CLOSE_BUTTON_CLICKED);
  }


  onSubmitButtonClicked() {
    sendEvent(this.transactionConfirmSubmitModalEvent, TransactionConfirmSubmitModalEventType.SUBMIT_BUTTON_CLICKED,
      { notes: this.notes }
    );
  }

}
