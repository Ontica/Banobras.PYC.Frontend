/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyAssetsAssignmentsQuery, AssetsAssignmentsQuery, AssetsAssignmentDescriptor} from '@app/models';

import { AssignmentsFilterEventType } from './assignments-filter.component';

import { AssignmentTableEventType } from './assignments-table.component';

import {
  ExportReportModalEventType
} from '@app/views/_reports-controls/export-report-modal/export-report-modal.component';


export enum AssignmentsExplorerEventType {
  SEARCH_CLICKED            = 'AssetsAssignmentsExplorerComponent.Event.SearchClicked',
  CLEAR_CLICKED             = 'AssetsAssignmentsExplorerComponent.Event.ClearClicked',
  EXECUTE_OPERATION_CLICKED = 'AssetsAssignmentsExplorerComponent.Event.ExecuteOperationClicked',
  EXPORT_CLICKED            = 'AssetsAssignmentsExplorerComponent.Event.ExportClicked',
  SELECT_CLICKED            = 'AssetsAssignmentsExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-inv-assignments-explorer',
  templateUrl: './assignments-explorer.component.html',
})
export class AssetsAssignmentsExplorerComponent implements OnChanges {

  @Input() query: AssetsAssignmentsQuery = Object.assign({}, EmptyAssetsAssignmentsQuery);

  @Input() dataList: AssetsAssignmentDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() fileUrl = '';

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() assignmentsExplorerEvent = new EventEmitter<EventInfo>();

  cardTitle = 'Explorador de resguardos';

  cardHint = 'Seleccionar los filtros';

  showFilters = false;

  displayExportModal = false;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.setText();
      this.showFilters = false;
    }
  }


  onAssignmentsFilterEvent(event: EventInfo) {
    switch (event.type as AssignmentsFilterEventType) {
      case AssignmentsFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.assignmentsExplorerEvent, AssignmentsExplorerEventType.SEARCH_CLICKED, event.payload);
        return;
      case AssignmentsFilterEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.assignmentsExplorerEvent, AssignmentsExplorerEventType.CLEAR_CLICKED, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onAssignmentsTableEvent(event: EventInfo) {
    switch (event.type as AssignmentTableEventType) {
      case AssignmentTableEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, 'event.payload.item');
        sendEvent(this.assignmentsExplorerEvent, AssignmentsExplorerEventType.SELECT_CLICKED, event.payload);
        return;
      case AssignmentTableEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        sendEvent(this.assignmentsExplorerEvent,
          AssignmentsExplorerEventType.EXECUTE_OPERATION_CLICKED, event.payload);
        return;
      case AssignmentTableEventType.EXPORT_DATA_CLICKED:
        this.setDisplayExportModal(true);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onExportReportModalEvent(event: EventInfo) {
    switch (event.type as ExportReportModalEventType) {
      case ExportReportModalEventType.CLOSE_MODAL_CLICKED:
        this.setDisplayExportModal(false);
        return;
      case ExportReportModalEventType.EXPORT_BUTTON_CLICKED:
        sendEvent(this.assignmentsExplorerEvent, AssignmentsExplorerEventType.EXPORT_CLICKED,
          { query: this.query });
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


  private setDisplayExportModal(display: boolean) {
    this.displayExportModal = display;
    this.fileUrl = '';
  }

}
