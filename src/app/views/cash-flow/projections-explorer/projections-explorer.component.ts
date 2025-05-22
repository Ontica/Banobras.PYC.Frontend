/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo, Identifiable } from '@app/core';

import { PERMISSIONS } from '@app/main-layout';

import { sendEvent } from '@app/shared/utils';

import { CashFlowProjectionDescriptor, CashFlowProjectionsQuery, CashFlowProjectionsStagesList,
         EmptyCashFlowProjectionsQuery, TransactionStages } from '@app/models';

import { ProjectionsFilterEventType } from './projections-filter.component';

import { ProjectionsListEventType } from './projections-list.component';


export enum ProjectionsExplorerEventType {
  CREATE_CLICKED            = 'CashFlowProjectionsExplorerComponent.Event.CreateClicked',
  SEARCH_CLICKED            = 'CashFlowProjectionsExplorerComponent.Event.SearchClicked',
  CLEAR_CLICKED             = 'CashFlowProjectionsExplorerComponent.Event.ClearClicked',
  EXECUTE_OPERATION_CLICKED = 'CashFlowProjectionsExplorerComponent.Event.ExecuteOperationClicked',
  SELECT_CLICKED            = 'CashFlowProjectionsExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-cf-projections-explorer',
  templateUrl: './projections-explorer.component.html',
})
export class CashFlowProjectionsExplorerComponent implements OnChanges {

  @Input() query: CashFlowProjectionsQuery = Object.assign({}, EmptyCashFlowProjectionsQuery);

  @Input() dataList: CashFlowProjectionDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() projectionsExplorerEvent = new EventEmitter<EventInfo>();

  cardTitle = 'Proyección de flujo de efectivo';

  cardHint = 'Seleccionar los filtros';

  showFilters = false;

  stagesList: Identifiable<TransactionStages>[] = CashFlowProjectionsStagesList;

  stage: TransactionStages = TransactionStages.MyInbox;

  PERMISSION_TO_CREATE = PERMISSIONS.NOT_REQUIRED;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.setText();
      this.showFilters = false;
    }
  }


  onStageChanged() {
    sendEvent(this.projectionsExplorerEvent, ProjectionsExplorerEventType.CLEAR_CLICKED,
      { query: this.query });
  }


  onCreateProjectionClicked() {
    sendEvent(this.projectionsExplorerEvent, ProjectionsExplorerEventType.CREATE_CLICKED);
  }


  onProjectionsFilterEvent(event: EventInfo) {
    switch (event.type as ProjectionsFilterEventType) {
      case ProjectionsFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.projectionsExplorerEvent, ProjectionsExplorerEventType.SEARCH_CLICKED,
          event.payload);
        return;
      case ProjectionsFilterEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.projectionsExplorerEvent, ProjectionsExplorerEventType.CLEAR_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onProjectionsListEvent(event: EventInfo) {
    switch (event.type as ProjectionsListEventType) {
      case ProjectionsListEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, 'event.payload.item');
        sendEvent(this.projectionsExplorerEvent, ProjectionsExplorerEventType.SELECT_CLICKED,
          event.payload);
        return;
      case ProjectionsListEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        sendEvent(this.projectionsExplorerEvent, ProjectionsExplorerEventType.EXECUTE_OPERATION_CLICKED,
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
