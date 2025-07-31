/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { SkipIf } from '@app/shared/decorators';

import { CashLedgerDataService } from '@app/data-services';

import { CashEntry, CashTransactionDescriptor, EmptyCashTransactionDescriptor } from '@app/models';

import { CashEntriesTableEventType } from './entries-table.component';


export enum CashEntriesEditionEventType {
  UPDATED = 'CashEntriesEditionComponent.Event.Updated',
}

@Component({
  selector: 'emp-cf-cash-entries-edition',
  templateUrl: './entries-edition.component.html',
})
export class CashEntriesEditionComponent {

  @Input() transaction: CashTransactionDescriptor = EmptyCashTransactionDescriptor;

  @Input() entries: CashEntry[] = [];

  @Input() canEdit = false;

  @Output() entriesEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private cashLedgerData: CashLedgerDataService,
              private messageBox: MessageBoxService) { }


  @SkipIf('submitted')
  onCashEntriesTableEvent(event: EventInfo) {
    switch (event.type as CashEntriesTableEventType) {
      case CashEntriesTableEventType.SELECT_ENTRY_CLICKED:
        Assertion.assertValue(event.payload.entry.id, 'event.payload.entry.id');
        return;
      case CashEntriesTableEventType.UPDATE_ENTRY_CASH_ACCOUNT_CLICKED:
        Assertion.assertValue(event.payload.transactionID, 'event.payload.transactionID');
        Assertion.assertValue(event.payload.entryId, 'event.payload.entryId');
        Assertion.assertValue(event.payload.cashAccount, 'event.payload.cashAccount');
        this.messageBox.showInDevelopment('Guardar concepto presupuestal', event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
