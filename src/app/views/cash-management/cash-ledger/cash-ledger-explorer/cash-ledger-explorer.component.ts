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

import { buildExplorerHint, CashLedgerDescriptor, CashLedgerQuery, CashLedgerQueryType,
         EmptyCashLedgerQuery } from '@app/models';

import { CashLedgerFilterEventType } from './cash-ledger-filter.component';

import { CashLedgerListEventType } from './cash-ledger-list.component';


export enum CashLedgerExplorerEventType {
  SEARCH_CLICKED            = 'CashLedgerExplorerComponent.Event.SearchClicked',
  CLEAR_CLICKED             = 'CashLedgerExplorerComponent.Event.ClearClicked',
  EXECUTE_OPERATION_CLICKED = 'CashLedgerExplorerComponent.Event.ExecuteOperationClicked',
  SELECT_CLICKED            = 'CashLedgerExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-cf-cash-ledger-explorer',
  templateUrl: './cash-ledger-explorer.component.html',
})
export class CashLedgerExplorerComponent implements OnChanges {

  @Input() queryType: CashLedgerQueryType = CashLedgerQueryType.transactions;

  @Input() query: CashLedgerQuery = Object.assign({}, EmptyCashLedgerQuery);

  @Input() dataList: CashLedgerDescriptor[] = [];

  @Input() selectedID: number = null;

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() cashLedgerExplorerEvent = new EventEmitter<EventInfo>();

  hint = 'Seleccionar los filtros';

  showFilters = false;

  PERMISSION_TO_CREATE = PERMISSIONS.NOT_REQUIRED;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.setText();
      this.showFilters = false;
    }
  }


  onStageChanged() {
    sendEvent(this.cashLedgerExplorerEvent, CashLedgerExplorerEventType.CLEAR_CLICKED,
      { query: this.query });
  }


  onCashLedgerFilterEvent(event: EventInfo) {
    switch (event.type as CashLedgerFilterEventType) {
      case CashLedgerFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.queryType, 'event.payload.queryType');
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.cashLedgerExplorerEvent, CashLedgerExplorerEventType.SEARCH_CLICKED,
          event.payload);
        return;
      case CashLedgerFilterEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.queryType, 'event.payload.queryType');
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.cashLedgerExplorerEvent, CashLedgerExplorerEventType.CLEAR_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onCashLedgerListEvent(event: EventInfo) {
    switch (event.type as CashLedgerListEventType) {
      case CashLedgerListEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, 'event.payload.item');
        sendEvent(this.cashLedgerExplorerEvent, CashLedgerExplorerEventType.SELECT_CLICKED,
          event.payload);
        return;
      case CashLedgerListEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        sendEvent(this.cashLedgerExplorerEvent, CashLedgerExplorerEventType.EXECUTE_OPERATION_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setText() {
    const queryType = this.queryType === CashLedgerQueryType.transactions ? 'pólizas' : 'movimientos';
    this.hint = buildExplorerHint(this.queryExecuted, this.dataList.length, null, null, queryType);
  }

}
