/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { RequestsList, RequestQuery, EmptyRequestQuery, RequestDescriptor } from '@app/models';

import { RequestsFilterEventType } from './requests-filter.component';

import { RequestsListEventType } from './requests-list.component';


export enum RequestsExplorerEventType {
  CREATE_CLICKED            = 'RequestsExplorerComponent.Event.CreateClicked',
  SEARCH_CLICKED            = 'RequestsExplorerComponent.Event.SearchClicked',
  CLEAR_CLICKED             = 'RequestsExplorerComponent.Event.ClearClicked',
  EXECUTE_OPERATION_CLICKED = 'RequestsExplorerComponent.Event.ExecuteOperationClicked',
  SELECT_CLICKED            = 'RequestsExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-pyc-requests-explorer',
  templateUrl: './requests-explorer.component.html',
})
export class RequestsExplorerComponent implements OnChanges {

  @Input() requestsList: RequestsList = RequestsList.budgeting;

  @Input() query: RequestQuery = Object.assign({}, EmptyRequestQuery);

  @Input() requestDataList: RequestDescriptor[] = [];

  @Input() selectedRequestUID = '';

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() requestsExplorerEvent = new EventEmitter<EventInfo>();

  titleText = 'Solicitudes';

  cardHint = 'Seleccionar los filtros';

  showFilters = false;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.requestDataList) {
      this.setText();
      this.showFilters = false;
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


  onRequestsListEvent(event: EventInfo) {
    switch (event.type as RequestsListEventType) {
      case RequestsListEventType.ITEM_CLICKED:
        Assertion.assertValue(event.payload.request, 'event.payload.request');
        sendEvent(this.requestsExplorerEvent, RequestsExplorerEventType.SELECT_CLICKED,
          event.payload);
        return;

      case RequestsListEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        sendEvent(this.requestsExplorerEvent, RequestsExplorerEventType.EXECUTE_OPERATION_CLICKED,
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

    this.cardHint = `${this.requestDataList.length} registros encontrados`;
  }

}
