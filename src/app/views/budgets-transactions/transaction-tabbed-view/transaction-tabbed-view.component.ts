/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, DateStringLibrary, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { BudgetTransactionData, EmptyBudgetTransactionData } from '@app/models';

import { TransactionEditorEventType } from '../transaction/transaction-editor.component';

import {
  TransactionEntriesEditionEventType
} from '../transaction-entries/transaction-entries-edition.component';

import { DocumentsEditionEventType } from '@app/views/documents/documents-edition/documents-edition.component';


export enum TransactionTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'BudgetTransactionTabbedViewComponent.Event.CloseButtonClicked',
  DATA_UPDATED         = 'BudgetTransactionTabbedViewComponent.Event.DataUpdated',
  DATA_DELETED         = 'BudgetTransactionTabbedViewComponent.Event.DataDeleted',
  REFRESH_DATA         = 'BudgetTransactionTabbedViewComponent.Event.RefreshData',
}

@Component({
  selector: 'emp-bdg-transaction-tabbed-view',
  templateUrl: './transaction-tabbed-view.component.html',
})
export class BudgetTransactionTabbedViewComponent implements OnChanges {

  @Input() data: BudgetTransactionData = EmptyBudgetTransactionData;

  @Output() transactionTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;


  ngOnChanges() {
    this.setTitle();
  }


  onCloseButtonClicked() {
    sendEvent(this.transactionTabbedViewEvent, TransactionTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onTransactionEditorEvent(event: EventInfo) {
    switch (event.type as TransactionEditorEventType) {
      case TransactionEditorEventType.UPDATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        sendEvent(this.transactionTabbedViewEvent,
          TransactionTabbedViewEventType.DATA_UPDATED, event.payload);
        return;
      case TransactionEditorEventType.DELETED:
        Assertion.assertValue(event.payload.transactionUID, 'event.payload.transactionUID');
        sendEvent(this.transactionTabbedViewEvent,
          TransactionTabbedViewEventType.DATA_DELETED, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onTransactionEntriesEditionEvent(event: EventInfo) {
    switch (event.type as TransactionEntriesEditionEventType) {
      case TransactionEntriesEditionEventType.UPDATED:
        Assertion.assertValue(event.payload.transactionUID, 'event.payload.transactionUID');
        sendEvent(this.transactionTabbedViewEvent,
          TransactionTabbedViewEventType.DATA_UPDATED, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onDocumentsEditionEvent(event: EventInfo) {
    switch (event.type as DocumentsEditionEventType) {
      case DocumentsEditionEventType.DOCUMENTS_UPDATED:
        const payload = { transactionUID: this.data.transaction.uid };
        sendEvent(this.transactionTabbedViewEvent, TransactionTabbedViewEventType.REFRESH_DATA, payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    const requestedDate = !this.data.transaction.requestedDate ? 'N/D' :
      DateStringLibrary.format(this.data.transaction.requestedDate);

    const status = this.data.transaction.status.name === 'Eliminada' ?
      `<span class="tag tag-error tag-small">${this.data.transaction.status.name}</span>` :
      `<span class="tag tag-small">${this.data.transaction.status.name}</span>`;

    this.title = `${this.data.transaction.transactionNo}: ${this.data.transaction.transactionType.name} ${status}`;

    this.hint = `<strong>${this.data.transaction.baseParty.name} &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${this.data.transaction.budgetType.name}</strong> &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${this.data.transaction.budget.name} &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${requestedDate}`;
  }

}
