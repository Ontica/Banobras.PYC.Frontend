/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { SkipIf } from '@app/shared/decorators';

import { CashLedgerDataService } from '@app/data-services';

import { CashEntriesOperationCommand, CashEntry, CashTransactionDescriptor, CashTransactionHolder,
         EmptyCashTransactionDescriptor } from '@app/models';

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


  constructor(private cashLedgerData: CashLedgerDataService) { }


  @SkipIf('submitted')
  onCashEntriesTableEvent(event: EventInfo) {
    switch (event.type as CashEntriesTableEventType) {
      case CashEntriesTableEventType.AUTO_CODIFY_CLICKED:
        this.autoCodifyCashTransaction(this.transaction.id);
        return;
      case CashEntriesTableEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.transactionID, 'event.payload.transactionID');
        Assertion.assertValue(event.payload.command, 'event.payload.command');
        this.executeCashEntriesOperation(event.payload.transactionID, event.payload.command);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private autoCodifyCashTransaction(transactionID: number) {
    this.submitted = true;

    this.cashLedgerData.autoCodifyCashTransaction(transactionID)
      .firstValue()
      .then(x => this.resolveCashEntriesUpdated(x))
      .finally(() => this.submitted = false);
  }


  private executeCashEntriesOperation(transactionID: number,
                                      command: CashEntriesOperationCommand) {
    this.submitted = true;

    this.cashLedgerData.executeCashEntriesOperation(transactionID, command)
      .firstValue()
      .then(x => this.resolveCashEntriesUpdated(x))
      .finally(() => this.submitted = false);
  }


  private resolveCashEntriesUpdated(data: CashTransactionHolder) {
    sendEvent(this.entriesEditionEvent, CashEntriesEditionEventType.UPDATED, { data });
  }

}
