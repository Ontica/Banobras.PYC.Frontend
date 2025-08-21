/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { CashEntriesOperationsList, CashLedgerDescriptor, CashLedgerQueryType,
         CashTransactionsOperationsList } from '@app/models';

import { ListControlsEventType } from '@app/views/_reports-controls/explorer/list-controls.component';

import { CashLedgerListItemEventType } from './cash-ledger-list-item.component';


export enum CashLedgerListEventType {
  SELECT_CLICKED            = 'CashLedgerListComponent.Event.SelectClicked',
  EXECUTE_OPERATION_CLICKED = 'CashLedgerListComponent.Event.ExecuteOperationClicked',
}

@Component({
  selector: 'emp-cf-cash-ledger-list',
  templateUrl: './cash-ledger-list.component.html',
})
export class CashLedgerListComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() queryType: CashLedgerQueryType = CashLedgerQueryType.transactions;

  @Input() dataList: CashLedgerDescriptor[] = [];

  @Input() selectedID = null;

  @Input() queryExecuted = false;

  @Input() displayControls = true;

  @Output() cashLedgerListEvent = new EventEmitter<EventInfo>();

  selection = new SelectionModel<CashLedgerDescriptor>(true, []);

  operationsList = [];


  ngOnChanges(changes: SimpleChanges) {
    if (changes.queryType) {
      this.setOperationsList();
    }

    if (changes.dataList) {
      this.scrollToTop();
      this.selection.clear();
    }
  }


  get isQueryTypeEntries(): boolean {
    return this.queryType === CashLedgerQueryType.entries;
  }


  onListControlsEvent(event: EventInfo) {
    switch (event.type as ListControlsEventType) {
      case ListControlsEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        Assertion.assertValue(event.payload.command, 'event.payload.command');
        sendEvent(this.cashLedgerListEvent, CashLedgerListEventType.EXECUTE_OPERATION_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onCashLedgerListItemEvent(event: EventInfo) {
    switch (event.type as CashLedgerListItemEventType) {
      case CashLedgerListItemEventType.SELECT_CLICKED:
        sendEvent(this.cashLedgerListEvent, CashLedgerListEventType.SELECT_CLICKED, event.payload);
        return;
      case CashLedgerListItemEventType.CHECK_CLICKED:
        Assertion.assertValue(event.payload.item, 'event.payload.item');
        this.selection.toggle(event.payload.item);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setOperationsList() {
    switch (this.queryType) {
      case CashLedgerQueryType.transactions:
        this.operationsList = CashTransactionsOperationsList;
        return;
      case CashLedgerQueryType.entries:
        this.operationsList = CashEntriesOperationsList;
        return;
      default:
        this.operationsList = [];
        return;
    }
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(0);
    }
  }

}
