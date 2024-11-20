/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { BudgetTransactionEntryDescriptor } from '@app/models';

import { TransactionEntriesTableEventType } from './transaction-entries-table.component';


export enum TransactionEntriesEditionEventType {
  UPDATED = 'BudgetTransactionEntriesEditionComponent.Event.Updated',
}

@Component({
  selector: 'emp-bdg-transaction-entries-edition',
  templateUrl: './transaction-entries-edition.component.html',
})
export class BudgetTransactionEntriesEditionComponent {

  @Input() entries: BudgetTransactionEntryDescriptor[] = [];

  @Output() transactionEntriesEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private messageBox: MessageBoxService) {

  }


  onTransactionEntriesTableEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as TransactionEntriesTableEventType) {
      case TransactionEntriesTableEventType.SELECT_ENTRY_CLICKED:
        Assertion.assertValue(event.payload.entry.uid, 'event.payload.entry.uid');
        this.messageBox.showInDevelopment('Seleccionar movimiento', event.payload.entry);
        return;
      case TransactionEntriesTableEventType.REMOVE_ENTRY_CLICKED:
        Assertion.assertValue(event.payload.entry.uid, 'event.payload.entry.uid');
        this.messageBox.showInDevelopment('Eliminar movimiento', event.payload.entry);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
