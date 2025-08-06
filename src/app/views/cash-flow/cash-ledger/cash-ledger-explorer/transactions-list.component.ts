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

import { CashTransactionsOperationsList, CashTransactionDescriptor } from '@app/models';

import { ListControlsEventType } from '@app/views/_reports-controls/explorer/list-controls.component';

import { CashTransactionsListItemEventType } from './transactions-list-item.component';

export enum CashTransactionsListEventType {
  SELECT_CLICKED            = 'CashTransactionsListComponent.Event.SelectClicked',
  EXECUTE_OPERATION_CLICKED = 'CashTransactionsListComponent.Event.ExecuteOperationClicked',
}

@Component({
  selector: 'emp-cf-cash-transactions-list',
  templateUrl: './transactions-list.component.html',
})
export class CashTransactionsListComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() dataList: CashTransactionDescriptor[] = [];

  @Input() selectedID = null;

  @Input() queryExecuted = false;

  @Input() displayControls = true;

  @Output() transactionsListEvent = new EventEmitter<EventInfo>();

  selection = new SelectionModel<CashTransactionDescriptor>(true, []);

  operationsList = CashTransactionsOperationsList;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.scrollToTop();
      this.selection.clear();
    }
  }


  onListControlsEvent(event: EventInfo) {
    switch (event.type as ListControlsEventType) {
      case ListControlsEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        Assertion.assertValue(event.payload.command, 'event.payload.command');
        sendEvent(this.transactionsListEvent, CashTransactionsListEventType.EXECUTE_OPERATION_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onCashTransactionsListItemEvent(event: EventInfo) {
    switch (event.type as CashTransactionsListItemEventType) {
      case CashTransactionsListItemEventType.SELECT_CLICKED:
        sendEvent(this.transactionsListEvent, CashTransactionsListEventType.SELECT_CLICKED, event.payload);
        return;
      case CashTransactionsListItemEventType.CHECK_CLICKED:
        Assertion.assertValue(event.payload.item, 'event.payload.transaction');
        this.selection.toggle(event.payload.item);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(0);
    }
  }

}
