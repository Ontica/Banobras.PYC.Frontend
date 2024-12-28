/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptySuppliersDataTable, EmptySuppliersQuery, SuppliersDataTable, SuppliersQuery } from '@app/models';

import { SuppliersFilterEventType } from './suppliers-filter.component';

import { DataTableEventType } from '@app/views/_reports-controls/data-table/data-table.component';

export enum SuppliersExplorerEventType {
  CREATE_CLICKED            = 'SuppliersExplorerComponent.Event.CreateClicked',
  SEARCH_CLICKED            = 'SuppliersExplorerComponent.Event.SearchClicked',
  CLEAR_CLICKED             = 'SuppliersExplorerComponent.Event.ClearClicked',
  EXECUTE_OPERATION_CLICKED = 'SuppliersExplorerComponent.Event.ExecuteOperationClicked',
  SELECT_CLICKED            = 'SuppliersExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-ng-suppliers-explorer',
  templateUrl: './suppliers-explorer.component.html',
})
export class SuppliersExplorerComponent implements OnChanges {

  @Input() query: SuppliersQuery = Object.assign({}, EmptySuppliersQuery);

  @Input() dataList: SuppliersDataTable = Object.assign({}, EmptySuppliersDataTable);

  @Input() selectedUID = '';

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() suppliersExplorerEvent = new EventEmitter<EventInfo>();

  cardTitle = 'Explorador de proveedores';

  cardHint = 'Seleccionar los filtros';

  showFilters = false;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.setText();
      this.showFilters = false;
    }
  }


  onCreateSupplierClicked() {
    sendEvent(this.suppliersExplorerEvent, SuppliersExplorerEventType.CREATE_CLICKED);
  }


  onSuppliersFilterEvent(event: EventInfo) {
    switch (event.type as SuppliersFilterEventType) {
      case SuppliersFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.suppliersExplorerEvent, SuppliersExplorerEventType.SEARCH_CLICKED,
          event.payload);
        return;
      case SuppliersFilterEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.suppliersExplorerEvent, SuppliersExplorerEventType.CLEAR_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onSuppliersTableEvent(event: EventInfo) {
    switch (event.type as DataTableEventType) {
      case DataTableEventType.ENTRY_CLICKED:
        Assertion.assertValue(event.payload.item, 'event.payload.item');
        sendEvent(this.suppliersExplorerEvent, SuppliersExplorerEventType.SELECT_CLICKED,
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

    this.cardHint = `${this.dataList.entries.length} registros encontrados`;
  }

}
