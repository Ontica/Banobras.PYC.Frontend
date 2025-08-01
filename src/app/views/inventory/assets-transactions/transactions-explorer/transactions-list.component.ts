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

import { AssetsTransactionDescriptor, AssetsTransactionsOperationsList } from '@app/models';

import { ListControlsEventType } from '@app/views/_reports-controls/explorer/list-controls.component';

import { TransactionsListItemEventType } from './transactions-list-item.component';

export enum TransactionsListEventType {
  SELECT_CLICKED            = 'AssetsTransactionsListComponent.Event.SelectClicked',
  EXECUTE_OPERATION_CLICKED = 'AssetsTransactionsListComponent.Event.ExecuteOperationClicked',
  EXPORT_DATA_CLICKED       = 'AssetsTransactionsListComponent.Event.ExportDataClicked',
}

@Component({
  selector: 'emp-inv-transactions-list',
  templateUrl: './transactions-list.component.html',
})
export class AssetsTransactionsListComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() dataList: AssetsTransactionDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() queryExecuted = false;

  @Output() transactionsListEvent = new EventEmitter<EventInfo>();

  selection = new SelectionModel<AssetsTransactionDescriptor>(true, []);

  operationsList = AssetsTransactionsOperationsList;


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
      case ListControlsEventType.EXPORT_BUTTON_CLICKED:
        sendEvent(this.transactionsListEvent, TransactionsListEventType.EXPORT_DATA_CLICKED);
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
