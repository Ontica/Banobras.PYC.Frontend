/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { BillsDataTable, BillsQuery, EmptyBillsDataTable, EmptyBillsQuery,
         buildExplorerHint } from '@app/models';

import { BillsFilterEventType } from './bills-filter.component';

import { DataTableEventType } from '@app/views/_reports-controls/data-table/data-table.component';

export enum BillsExplorerEventType {
  SEARCH_CLICKED            = 'BillsExplorerComponent.Event.SearchClicked',
  CLEAR_CLICKED             = 'BillsExplorerComponent.Event.ClearClicked',
  EXECUTE_OPERATION_CLICKED = 'BillsExplorerComponent.Event.ExecuteOperationClicked',
  SELECT_CLICKED            = 'BillsExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-ng-bills-explorer',
  templateUrl: './bills-explorer.component.html',
})
export class BillsExplorerComponent implements OnChanges {

  @Input() query: BillsQuery = Object.assign({}, EmptyBillsQuery);

  @Input() data: BillsDataTable = Object.assign({}, EmptyBillsDataTable);

  @Input() selectedUID = null;

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() billsExplorerEvent = new EventEmitter<EventInfo>();

  hint = 'Seleccionar los filtros';

  showFilters = false;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.setText();
      this.showFilters = false;
    }
  }


  onBillsFilterEvent(event: EventInfo) {
    switch (event.type as BillsFilterEventType) {
      case BillsFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.billsExplorerEvent, BillsExplorerEventType.SEARCH_CLICKED, event.payload);
        return;

      case BillsFilterEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.billsExplorerEvent, BillsExplorerEventType.CLEAR_CLICKED, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onBillsTableEvent(event: EventInfo) {
    switch (event.type as DataTableEventType) {
      case DataTableEventType.ENTRY_CLICKED:
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');
        sendEvent(this.billsExplorerEvent, BillsExplorerEventType.SELECT_CLICKED,
          { item: event.payload.entry });
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
