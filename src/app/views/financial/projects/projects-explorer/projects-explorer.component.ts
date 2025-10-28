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

import { EmptyFinancialProjectsQuery, FinancialProjectDescriptor, FinancialProjectsQuery } from '@app/models';

import { ProjectsFilterEventType } from './projects-filter.component';

import { ProjectsTableEventType } from './projects-table.component';


export enum ProjectsExplorerEventType {
  CREATE_CLICKED            = 'FinancialProjectsExplorerComponent.Event.CreateClicked',
  SEARCH_CLICKED            = 'FinancialProjectsExplorerComponent.Event.SearchClicked',
  CLEAR_CLICKED             = 'FinancialProjectsExplorerComponent.Event.ClearClicked',
  EXECUTE_OPERATION_CLICKED = 'FinancialProjectsExplorerComponent.Event.ExecuteOperationClicked',
  SELECT_CLICKED            = 'FinancialProjectsExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-financial-projects-explorer',
  templateUrl: './projects-explorer.component.html',
})
export class FinancialProjectsExplorerComponent implements OnChanges {

  @Input() query: FinancialProjectsQuery = Object.assign({}, EmptyFinancialProjectsQuery);

  @Input() dataList: FinancialProjectDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() projectsExplorerEvent = new EventEmitter<EventInfo>();

  cardHint = 'Seleccionar los filtros';

  showFilters = false;

  PERMISSION_TO_CREATE = PERMISSIONS.NOT_REQUIRED;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.setText();
      this.showFilters = false;
    }
  }


  onCreateProjectionClicked() {
    sendEvent(this.projectsExplorerEvent, ProjectsExplorerEventType.CREATE_CLICKED);
  }


  onProjectsFilterEvent(event: EventInfo) {
    switch (event.type as ProjectsFilterEventType) {
      case ProjectsFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.projectsExplorerEvent, ProjectsExplorerEventType.SEARCH_CLICKED,
          event.payload);
        return;
      case ProjectsFilterEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.projectsExplorerEvent, ProjectsExplorerEventType.CLEAR_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onProjectsTableEvent(event: EventInfo) {
    switch (event.type as ProjectsTableEventType) {
      case ProjectsTableEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, 'event.payload.item');
        sendEvent(this.projectsExplorerEvent, ProjectsExplorerEventType.SELECT_CLICKED,
          event.payload);
        return;
      case ProjectsTableEventType.EXECUTE_OPERATION_CLICKED:
        sendEvent(this.projectsExplorerEvent, ProjectsExplorerEventType.EXECUTE_OPERATION_CLICKED,
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
