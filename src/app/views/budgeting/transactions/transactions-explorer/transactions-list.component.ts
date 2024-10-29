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

import { BudgetTransactionDescriptor, BudgetTransactionsOperationsList } from '@app/models';

import { ListControlsEventType } from '@app/views/_reports-controls/explorer/list-controls.component';

import { TransactionsListItemEventType } from './transactions-list-item.component';

export enum TransactionsListEventType {
  SELECT_CLICKED            = 'TransactionsListComponent.Event.SelectClicked',
  EXECUTE_OPERATION_CLICKED = 'TransactionsListComponent.Event.ExecuteOperationClicked',
}

@Component({
  selector: 'emp-bdg-transactions-list',
  templateUrl: './transactions-list.component.html',
})
export class TransactionsListComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() dataList: BudgetTransactionDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() queryExecuted = false;

  @Output() transactionsListEvent = new EventEmitter<EventInfo>();

  selection = new SelectionModel<BudgetTransactionDescriptor>(true, []);

  operationsList = BudgetTransactionsOperationsList;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.scrollToTop();
      this.selection.clear();
    }
  }


  onListControlsEvent(event: EventInfo) {
    switch (event.type as ListControlsEventType) {
      case ListControlsEventType.EXECUTE_OPERATION_CLICKED:
        sendEvent(this.transactionsListEvent, TransactionsListEventType.EXECUTE_OPERATION_CLICKED, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onTransactionsListItemEvent(event: EventInfo) {
    switch (event.type as TransactionsListItemEventType) {
      case TransactionsListItemEventType.SELECT_CLICKED:
        sendEvent(this.transactionsListEvent, TransactionsListEventType.SELECT_CLICKED, event.payload);
        return;
      case TransactionsListItemEventType.CHECK_CLICKED:
        Assertion.assertValue(event.payload.transaction, 'event.payload.transaction');
        this.selection.toggle(event.payload.transaction);
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
