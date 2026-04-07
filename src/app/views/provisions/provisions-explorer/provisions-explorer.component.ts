/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { buildExplorerHint, EmptyProvisionsQuery, ProvisionDescriptor, ProvisionQueryTypes,
         ProvisionsQuery } from '@app/models';

import { ProvisionsFilterEventType } from './provisions-filter.component';

import { ProvisionsDataEventType } from './provisions-data.component';


export enum ProvisionsExplorerEventType {
  SEARCH_CLICKED            = 'ProvisionsExplorerComponent.Event.SearchClicked',
  CLEAR_CLICKED             = 'ProvisionsExplorerComponent.Event.ClearClicked',
  EXECUTE_OPERATION_CLICKED = 'ProvisionsExplorerComponent.Event.ExecuteOperationClicked',
  SELECT_CLICKED            = 'ProvisionsExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-ng-provisions-explorer',
  templateUrl: './provisions-explorer.component.html',
})
export class ProvisionsExplorerComponent implements OnChanges {

  @Input() queryType: ProvisionQueryTypes = ProvisionQueryTypes.All;

  @Input() query: ProvisionsQuery = Object.assign({}, EmptyProvisionsQuery);

  @Input() dataList: ProvisionDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() provisionsExplorerEvent = new EventEmitter<EventInfo>();

  hint = 'Seleccionar los filtros';

  showFilters = false;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.setText();
      this.showFilters = false;
    }
  }


  onProvisionsFilterEvent(event: EventInfo) {
    switch (event.type as ProvisionsFilterEventType) {
      case ProvisionsFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.provisionsExplorerEvent, ProvisionsExplorerEventType.SEARCH_CLICKED,
          event.payload);
        return;
      case ProvisionsFilterEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.provisionsExplorerEvent, ProvisionsExplorerEventType.CLEAR_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onProvisionsDataEvent(event: EventInfo) {
    switch (event.type as ProvisionsDataEventType) {
      case ProvisionsDataEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        sendEvent(this.provisionsExplorerEvent, ProvisionsExplorerEventType.EXECUTE_OPERATION_CLICKED,
          event.payload);
        return;
      case ProvisionsDataEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, 'event.payload.item');
        sendEvent(this.provisionsExplorerEvent, ProvisionsExplorerEventType.SELECT_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setText() {
    this.hint = buildExplorerHint(this.queryExecuted, this.dataList.length);
  }

}
