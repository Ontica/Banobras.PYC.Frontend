/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { BudgetTransactionDescriptor, BudgetTransactionsQuery,
         EmptyBudgetTransactionsQuery,
         FixedAssetTransactionDescriptor,
         FixedAssetTransactionsQuery} from '@app/models';

import { TransactionsFilterEventType } from '../budget/explorer/transactions-filter.component';

import { TransactionsListEventType } from './transactions-list.component';
import { FixedAssetTransactionsFilterEventType } from '../fixed-assets/explorer/transactions-filter.component';


export enum TransactionsExplorerEventType {
  SEARCH_CLICKED            = 'TransactionsExplorerComponent.Event.SearchClicked',
  CLEAR_CLICKED             = 'TransactionsExplorerComponent.Event.ClearClicked',
  EXECUTE_OPERATION_CLICKED = 'TransactionsExplorerComponent.Event.ExecuteOperationClicked',
  SELECT_CLICKED            = 'TransactionsExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-bdg-transactions-explorer',
  templateUrl: './transactions-explorer.component.html',
})
export class TransactionsExplorerComponent implements OnChanges {

  @Input() queryType: 'budgets' | 'fixed-assets' = 'budgets';

  @Input() query: BudgetTransactionsQuery | FixedAssetTransactionsQuery = Object.assign({}, EmptyBudgetTransactionsQuery);

  @Input() dataList: BudgetTransactionDescriptor[] | FixedAssetTransactionDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() transactionsExplorerEvent = new EventEmitter<EventInfo>();

  cardTitle = 'Explorador de transacciones';

  cardHint = 'Seleccionar los filtros';

  showFilters = false;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.setText();
      this.showFilters = false;
    }
  }


  get budgetTransactionsQuery(): BudgetTransactionsQuery {
    return this.query as BudgetTransactionsQuery;
  }


  get fixedAssetTransactionsQuery(): FixedAssetTransactionsQuery {
    return this.query as FixedAssetTransactionsQuery;
  }


  onCreateTransactionClicked() {

  }


  onTransactionsFilterEvent(event: EventInfo) {
    switch (event.type as TransactionsFilterEventType | FixedAssetTransactionsFilterEventType) {
      case TransactionsFilterEventType.SEARCH_CLICKED:
      case FixedAssetTransactionsFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.transactionsExplorerEvent, TransactionsExplorerEventType.SEARCH_CLICKED,
          event.payload);
        return;
      case TransactionsFilterEventType.CLEAR_CLICKED:
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
