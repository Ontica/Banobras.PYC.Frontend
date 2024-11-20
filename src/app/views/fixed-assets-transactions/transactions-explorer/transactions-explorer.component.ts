/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyFixedAssetTransactionsQuery, FixedAssetTransactionDescriptor,
         FixedAssetTransactionsQuery } from '@app/models';

import { TransactionsListEventType } from './transactions-list.component';

import { FixedAssetTransactionsFilterEventType } from './transactions-filter.component';


export enum TransactionsExplorerEventType {
  SEARCH_CLICKED            = 'FixedAssetTransactionsExplorerComponent.Event.SearchClicked',
  CLEAR_CLICKED             = 'FixedAssetTransactionsExplorerComponent.Event.ClearClicked',
  EXECUTE_OPERATION_CLICKED = 'FixedAssetTransactionsExplorerComponent.Event.ExecuteOperationClicked',
  SELECT_CLICKED            = 'FixedAssetTransactionsExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-fa-transactions-explorer',
  templateUrl: './transactions-explorer.component.html',
})
export class FixedAssetTransactionsExplorerComponent implements OnChanges {

  @Input() query: FixedAssetTransactionsQuery = Object.assign({}, EmptyFixedAssetTransactionsQuery);

  @Input() dataList: FixedAssetTransactionDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() transactionsExplorerEvent = new EventEmitter<EventInfo>();

  cardTitle = 'Transacciones de activo fijo';

  cardHint = 'Seleccionar los filtros';

  showFilters = false;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.setText();
      this.showFilters = false;
    }
  }


  onCreateTransactionClicked() {

  }


  onTransactionsFilterEvent(event: EventInfo) {
    switch (event.type as FixedAssetTransactionsFilterEventType) {
      case FixedAssetTransactionsFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.transactionsExplorerEvent, TransactionsExplorerEventType.SEARCH_CLICKED,
          event.payload);
        return;
      case FixedAssetTransactionsFilterEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.transactionsExplorerEvent, TransactionsExplorerEventType.CLEAR_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onTransactionsListEvent(event: EventInfo) {
    switch (event.type as TransactionsListEventType) {
      case TransactionsListEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.transaction, 'event.payload.transaction');
        sendEvent(this.transactionsExplorerEvent, TransactionsExplorerEventType.SELECT_CLICKED,
          event.payload);
        return;
      case TransactionsListEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        sendEvent(this.transactionsExplorerEvent, TransactionsExplorerEventType.EXECUTE_OPERATION_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setText() {
    if (!this.queryExecuted) {
      this.cardHint = 'Seleccionar los filtros';
      return;
    }

    this.cardHint = `${this.dataList.length} registros encontrados`;
  }

}
