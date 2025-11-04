/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { buildExplorerHint, CashFlowExplorer, CashFlowExplorerQuery, EmptyCashFlowExplorer,
         EmptyCashFlowExplorerQuery } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { CashFlowFilterEventType } from './cash-flow-filter.component';

import { DataTableEventType } from '@app/views/_reports-controls/data-table/data-table.component';

export enum CashFlowExplorerEventType {
  SEARCH_CLICKED = 'CashFlowExplorerComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'CashFlowExplorerComponent.Event.ClearClicked',
  EXPORT_CLICKED = 'CashFlowExplorerComponent.Event.ExportClicked',
  SELECT_CLICKED = 'CashFlowExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-cf-cash-flow-explorer',
  templateUrl: './cash-flow-explorer.component.html',
})
export class CashFlowExplorerComponent implements OnChanges {

  @Input() query: CashFlowExplorerQuery = Object.assign({}, EmptyCashFlowExplorerQuery);

  @Input() data: CashFlowExplorer = Object.assign({}, EmptyCashFlowExplorer);

  @Input() selectedUID: string = null;

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() cashFlowExplorerEvent = new EventEmitter<EventInfo>();

  hint = 'Seleccionar los filtros';

  showFilters = false;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.setText();
      this.showFilters = false;
    }
  }


  onCashFlowFilterEvent(event: EventInfo) {
    switch (event.type as CashFlowFilterEventType) {
      case CashFlowFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.reportType, 'event.payload.reportType');
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.cashFlowExplorerEvent, CashFlowExplorerEventType.SEARCH_CLICKED,
          event.payload);
        return;
      case CashFlowFilterEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.reportType, 'event.payload.reportType');
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.cashFlowExplorerEvent, CashFlowExplorerEventType.CLEAR_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onDataTableEvent(event: EventInfo) {
    switch (event.type as DataTableEventType) {
      case DataTableEventType.ENTRY_CLICKED:
        sendEvent(this.cashFlowExplorerEvent, CashFlowExplorerEventType.SELECT_CLICKED,
          event.payload);
        return;
      case DataTableEventType.EXPORT_DATA:
        sendEvent(this.cashFlowExplorerEvent, CashFlowExplorerEventType.EXPORT_CLICKED);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setText() {
    this.hint = buildExplorerHint(this.queryExecuted, this.data.entries.length);
  }

}
