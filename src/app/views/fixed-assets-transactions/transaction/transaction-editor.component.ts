/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { FixedAssetTransaction, EmptyFixedAssetTransaction, TransactionActions,
         EmptyTransactionActions } from '@app/models';

import { TransactionHeaderEventType } from './transaction-header.component';


export enum TransactionEditorEventType {
  UPDATED = 'FixedAssetTransactionEditorComponent.Event.TransactionUpdated',
  DELETED = 'FixedAssetTransactionEditorComponent.Event.TransactionDeleted',
}

@Component({
  selector: 'emp-fa-transaction-editor',
  templateUrl: './transaction-editor.component.html',
})
export class FixedAssetTransactionEditorComponent {

  @Input() transaction: FixedAssetTransaction = EmptyFixedAssetTransaction;

  @Input() actions: TransactionActions = EmptyTransactionActions;

  @Output() transactionEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private messageBox: MessageBoxService) { }


  get isSaved(): boolean {
    return !isEmpty(this.transaction);
  }


  onTransactionHeaderEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as TransactionHeaderEventType) {
      case TransactionHeaderEventType.AUTHORIZE:
        this.messageBox.showInDevelopment('Autorizar transacción');
        return

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
