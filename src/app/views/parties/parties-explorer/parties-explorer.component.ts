/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyPartiesDataTable, EmptyPartiesQuery, EmptyPartyExplorerTypeConfig, ExplorerTypeConfig,
         PartiesDataTable, PartiesQuery, PartyObjectTypes } from '@app/models';

import { DataTableEventType } from '@app/views/_reports-controls/data-table/data-table.component';

import { PartiesFilterEventType } from './parties-filter.component';


export enum PartiesExplorerEventType {
  CREATE_CLICKED            = 'PartiesExplorerComponent.Event.CreateClicked',
  SEARCH_CLICKED            = 'PartiesExplorerComponent.Event.SearchClicked',
  CLEAR_CLICKED             = 'PartiesExplorerComponent.Event.ClearClicked',
  EXECUTE_OPERATION_CLICKED = 'PartiesExplorerComponent.Event.ExecuteOperationClicked',
  SELECT_CLICKED            = 'PartiesExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-ng-parties-explorer',
  templateUrl: './parties-explorer.component.html',
})
export class PartiesExplorerComponent implements OnChanges {

  @Input() config: ExplorerTypeConfig<PartyObjectTypes> = EmptyPartyExplorerTypeConfig;

  @Input() query: PartiesQuery = Object.assign({}, EmptyPartiesQuery);

  @Input() data: PartiesDataTable = Object.assign({}, EmptyPartiesDataTable);

  @Input() selectedUID = '';

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() partiesExplorerEvent = new EventEmitter<EventInfo>();

  cardHint = 'Seleccionar los filtros';

  showFilters = false;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.setText();
      this.showFilters = false;
    }
  }


  onCreatePartyClicked() {
    sendEvent(this.partiesExplorerEvent, PartiesExplorerEventType.CREATE_CLICKED);
  }


  onPartiesFilterEvent(event: EventInfo) {
    switch (event.type as PartiesFilterEventType) {
      case PartiesFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.partiesExplorerEvent, PartiesExplorerEventType.SEARCH_CLICKED,
          event.payload);
        return;
      case PartiesFilterEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.partiesExplorerEvent, PartiesExplorerEventType.CLEAR_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onPartiesTableEvent(event: EventInfo) {
    switch (event.type as DataTableEventType) {
      case DataTableEventType.ENTRY_CLICKED:
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');
        sendEvent(this.partiesExplorerEvent, PartiesExplorerEventType.SELECT_CLICKED,
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

    this.cardHint = `${this.data.entries.length} registros encontrados`;
  }

}
