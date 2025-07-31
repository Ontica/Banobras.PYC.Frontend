/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, DateStringLibrary, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { CashTransactionHolder, EmptyCashTransactionHolder } from '@app/models';

import { CashEntriesEditionEventType } from '../cash-entries/entries-edition.component';

import {
  DocumentsEditionEventType
} from '@app/views/entity-records/documents-edition/documents-edition.component';


export enum CashTransactionTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'CashTransactionTabbedViewComponent.Event.CloseButtonClicked',
  REFRESH_DATA         = 'CashTransactionTabbedViewComponent.Event.RefreshData',
}

@Component({
  selector: 'emp-cf-cash-transaction-tabbed-view',
  templateUrl: './transaction-tabbed-view.component.html',
})
export class CashTransactionTabbedViewComponent implements OnChanges {

  @Input() data: CashTransactionHolder = EmptyCashTransactionHolder;

  @Output() transactionTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 1;


  ngOnChanges() {
    this.setTitle();
  }


  onCloseButtonClicked() {
    sendEvent(this.transactionTabbedViewEvent, CashTransactionTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onCashEntriesEditionEvent(event: EventInfo) {
    switch (event.type as CashEntriesEditionEventType) {
      case CashEntriesEditionEventType.UPDATED:
        Assertion.assertValue(event.payload.transactionID, 'event.payload.transactionID');
        sendEvent(this.transactionTabbedViewEvent,
          CashTransactionTabbedViewEventType.REFRESH_DATA, { dataID: event.payload.transactionID });
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onDocumentsEditionEvent(event: EventInfo) {
    switch (event.type as DocumentsEditionEventType) {
      case DocumentsEditionEventType.DOCUMENTS_UPDATED:
        const payload = { dataID: this.data.transaction.id };
        sendEvent(this.transactionTabbedViewEvent, CashTransactionTabbedViewEventType.REFRESH_DATA, payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    const accountingDate = !this.data.transaction.accountingDate ? 'N/D' :
      DateStringLibrary.format(this.data.transaction.accountingDate);

    this.title = `${this.data.transaction.number}: ${this.data.transaction.concept}`;

    this.hint = `<strong>${this.data.transaction.ledgerName} &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${this.data.transaction.voucherTypeName}</strong> &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${this.data.transaction.transactionTypeName} &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${accountingDate} <span class="tag tag-small">${this.data.transaction.statusName}</span>`;
  }

}
