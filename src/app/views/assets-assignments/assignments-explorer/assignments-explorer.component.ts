/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyAssetsAssignmentsQuery, AssetsAssignmentsQuery, AssetsAssignmentsDataTable,
         EmptyAssetsAssignmentsDataTable } from '@app/models';

import { AssetsAssignmentsFilterEventType } from './assignments-filter.component';

import { DataTableEventType } from '@app/views/_reports-controls/data-table/data-table.component';

import {
  ExportReportModalEventType
} from '@app/views/_reports-controls/export-report-modal/export-report-modal.component';


export enum AssetsAssignmentsExplorerEventType {
  SEARCH_CLICKED            = 'AssetsAssignmentsExplorerComponent.Event.SearchClicked',
  CLEAR_CLICKED             = 'AssetsAssignmentsExplorerComponent.Event.ClearClicked',
  EXECUTE_OPERATION_CLICKED = 'AssetsAssignmentsExplorerComponent.Event.ExecuteOperationClicked',
  EXPORT_CLICKED            = 'AssetsAssignmentsExplorerComponent.Event.ExportClicked',
  SELECT_CLICKED            = 'AssetsAssignmentsExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-pyc-assignments-explorer',
  templateUrl: './assignments-explorer.component.html',
})
export class AssetsAssignmentsExplorerComponent implements OnChanges {

  @Input() query: AssetsAssignmentsQuery = Object.assign({}, EmptyAssetsAssignmentsQuery);

  @Input() dataList: AssetsAssignmentsDataTable = Object.assign({}, EmptyAssetsAssignmentsDataTable);

  @Input() selectedUID = '';

  @Input() fileUrl = '';

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() assetsAssignmentsExplorerEvent = new EventEmitter<EventInfo>();

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
    switch (event.type as AssetsAssignmentsFilterEventType) {
      case AssetsAssignmentsFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.assetsAssignmentsExplorerEvent, AssetsAssignmentsExplorerEventType.SEARCH_CLICKED,
          event.payload);
        return;
      case AssetsAssignmentsFilterEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.assetsAssignmentsExplorerEvent, AssetsAssignmentsExplorerEventType.CLEAR_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onAssignmentsTableEvent(event: EventInfo) {
    switch (event.type as DataTableEventType) {
      case DataTableEventType.ENTRY_CLICKED:
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');
        sendEvent(this.assetsAssignmentsExplorerEvent, AssetsAssignmentsExplorerEventType.SELECT_CLICKED,
          { item: event.payload.entry });
        return;
      case DataTableEventType.EXPORT_DATA:
        sendEvent(this.assetsAssignmentsExplorerEvent, AssetsAssignmentsExplorerEventType.EXPORT_CLICKED);
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
        sendEvent(this.assetsAssignmentsExplorerEvent, AssetsAssignmentsExplorerEventType.EXPORT_CLICKED,
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

    this.cardHint = `${this.dataList.entries.length} registros encontrados`;
  }


  private setDisplayExportModal(display: boolean) {
    this.displayExportModal = display;
    this.fileUrl = '';
  }

}
