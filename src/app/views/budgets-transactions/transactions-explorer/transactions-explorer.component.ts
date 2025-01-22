/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { PERMISSIONS } from '@app/main-layout';

import { sendEvent } from '@app/shared/utils';

import { BudgetTransactionDescriptor, BudgetTransactionsQuery,
         EmptyBudgetTransactionsQuery } from '@app/models';

import { TransactionsFilterEventType } from './transactions-filter.component';

import { TransactionsListEventType } from './transactions-list.component';


export enum TransactionsExplorerEventType {
  SEARCH_CLICKED            = 'BudgetTransactionsExplorerComponent.Event.SearchClicked',
  CLEAR_CLICKED             = 'BudgetTransactionsExplorerComponent.Event.ClearClicked',
  EXECUTE_OPERATION_CLICKED = 'BudgetTransactionsExplorerComponent.Event.ExecuteOperationClicked',
  SELECT_CLICKED            = 'BudgetTransactionsExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-bdg-transactions-explorer',
  templateUrl: './transactions-explorer.component.html',
})
export class BudgetTransactionsExplorerComponent implements OnChanges {

  @Input() query: BudgetTransactionsQuery = Object.assign({}, EmptyBudgetTransactionsQuery);

  @Input() dataList: BudgetTransactionDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() transactionsExplorerEvent = new EventEmitter<EventInfo>();

  cardTitle = 'Transacciones presupuestales';

  cardHint = 'Seleccionar los filtros';

  showFilters = false;

  PERMISSION_TO_CREATE = PERMISSIONS.NOT_REQUIRED;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.setText();
      this.showFilters = false;
    }
  }


  onCreateTransactionClicked() {

  }


  onTransactionsFilterEvent(event: EventInfo) {
    switch (event.type as TransactionsFilterEventType) {
      case TransactionsFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.transactionsExplorerEvent, TransactionsExplorerEventType.SEARCH_CLICKED,
          event.payload);
        return;
      case TransactionsFilterEventType.CLEAR_CLICKED:
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
