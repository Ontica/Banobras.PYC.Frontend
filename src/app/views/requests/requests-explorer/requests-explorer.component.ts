/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyRequestData, RequestData, RequestEntry, ProcessGroup } from '@app/models';

import { RequestsFilterEventType } from './requests-filter.component';

import { DataTableEventType } from '@app/views/_reports-controls/data-table/data-table.component';


export enum RequestsExplorerEventType {
  CREATE_CLICKED = 'RequestsExplorerComponent.Event.CreateClicked',
  SEARCH_CLICKED = 'RequestsExplorerComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'RequestsExplorerComponent.Event.ClearClicked',
  EXPORT_CLICKED = 'RequestsExplorerComponent.Event.ExportClicked',
  SELECT_CLICKED = 'RequestsExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-pyc-requests-explorer',
  templateUrl: './requests-explorer.component.html',
})
export class RequestsExplorerComponent implements OnChanges {

  @Input() processGroup: ProcessGroup = ProcessGroup.budgeting;

  @Input() data: RequestData = Object.assign({}, EmptyRequestData);

  @Input() entrySelected: RequestEntry = null;

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() requestsExplorerEvent = new EventEmitter<EventInfo>();

  titleText = 'Solicitudes';

  cardHint = 'Seleccionar los filtros';


  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.setText();
    }
  }


  onCreateRequestClicked() {
    sendEvent(this.requestsExplorerEvent, RequestsExplorerEventType.CREATE_CLICKED);
  }


  onRequestsFilterEvent(event: EventInfo) {
    switch (event.type as RequestsFilterEventType) {
      case RequestsFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.requestsExplorerEvent, RequestsExplorerEventType.SEARCH_CLICKED,
          event.payload);
        return;

      case RequestsFilterEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.requestsExplorerEvent, RequestsExplorerEventType.CLEAR_CLICKED,
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
        sendEvent(this.requestsExplorerEvent, RequestsExplorerEventType.SELECT_CLICKED,
          event.payload);
        return;

      case DataTableEventType.EXPORT_DATA:
        sendEvent(this.requestsExplorerEvent, RequestsExplorerEventType.EXPORT_CLICKED);
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
