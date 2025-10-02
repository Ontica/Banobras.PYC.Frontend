/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { CashFlowReport, CashFlowReportQuery, EmptyCashFlowReport,
         EmptyCashFlowReportQuery } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { CashFlowReportFilterEventType } from './cash-flow-report-filter.component';

import { DataTableEventType } from '@app/views/_reports-controls/data-table/data-table.component';

export enum CashFlowReportExplorerEventType {
  SEARCH_CLICKED = 'CashFlowReportExplorerComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'CashFlowReportExplorerComponent.Event.ClearClicked',
  EXPORT_CLICKED = 'CashFlowReportExplorerComponent.Event.ExportClicked',
  SELECT_CLICKED = 'CashFlowReportExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-cf-cash-flow-report-explorer',
  templateUrl: './cash-flow-report-explorer.component.html',
})
export class CashFlowReportExplorerComponent implements OnChanges {

  @Input() query: CashFlowReportQuery = Object.assign({}, EmptyCashFlowReportQuery);

  @Input() data: CashFlowReport = Object.assign({}, EmptyCashFlowReport);

  @Input() selectedUID: string = null;

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() reportExplorerEvent = new EventEmitter<EventInfo>();

  titleText = 'Generación de reportes operativos';

  cardHint = 'Seleccionar los filtros';

  showFilters = false;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.setText();
      this.showFilters = false;
    }
  }


  onCashFlowReportFilterEvent(event: EventInfo) {
    switch (event.type as CashFlowReportFilterEventType) {
      case CashFlowReportFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.reportType, 'event.payload.reportType');
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.reportExplorerEvent, CashFlowReportExplorerEventType.SEARCH_CLICKED,
          event.payload);
        return;
      case CashFlowReportFilterEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.reportType, 'event.payload.reportType');
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.reportExplorerEvent, CashFlowReportExplorerEventType.CLEAR_CLICKED,
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
        sendEvent(this.reportExplorerEvent, CashFlowReportExplorerEventType.SELECT_CLICKED,
          event.payload);
        return;
      case DataTableEventType.EXPORT_DATA:
        sendEvent(this.reportExplorerEvent, CashFlowReportExplorerEventType.EXPORT_CLICKED);
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
