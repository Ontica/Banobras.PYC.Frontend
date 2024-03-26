/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { OperationsLogQuery } from '@app/models';

import { AccessControlDataService } from '@app/data-services';

import {
  ExportReportModalEventType
} from '@app/views/_reports-controls/export-report-modal/export-report-modal.component';

import {
  OperationsLogFilterComponent,
  OperationsLogFilterEventType
} from './operations-log-filter.component';


@Component({
  selector: 'emp-ng-operations-log-modal',
  templateUrl: './operations-log-modal.component.html',
})
export class OperationsLogModalComponent {

  @ViewChild('operationsLogFilter') operationsLogFilter: OperationsLogFilterComponent;

  @Output() closeEvent = new EventEmitter<void>();

  query: OperationsLogQuery = null;

  isQueryValid = false;

  fileUrl = '';

  submitted = false;


  constructor(private accessControlData: AccessControlDataService) { }


  onExportReportModalEvent(event: EventInfo) {
    switch (event.type as ExportReportModalEventType) {
      case ExportReportModalEventType.CLOSE_MODAL_CLICKED:
        this.emitCloseModal();
        return;

      case ExportReportModalEventType.NOT_READY_EXPORT_BUTTON_CLICKED:
        this.showFilterInvalid();
        return;

      case ExportReportModalEventType.EXPORT_BUTTON_CLICKED:
        this.exportOperationLog();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onOperationsLogFilterEvent(event: EventInfo) {
    switch (event.type as OperationsLogFilterEventType) {
      case OperationsLogFilterEventType.FILTER_CHANGED:
        Assertion.assertValue(event.payload.isFormValid, 'event.payload.isFormValid');
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryData(!!event.payload.isFormValid, event.payload.query as OperationsLogQuery);
        this.resetFileUrl();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private emitCloseModal() {
    this.closeEvent.emit();
  }


  private showFilterInvalid() {
    this.operationsLogFilter.invalidateForm();
  }


  private exportOperationLog() {
    if (!this.isQueryValid || this.submitted) {
      this.showFilterInvalid();
      return;
    }

    this.submitted = true;

    this.accessControlData.exportOperationalLogToExcel(this.query)
      .firstValue()
      .then(x => this.fileUrl = x.url)
      .finally(() => this.submitted = false);
  }


  private resetFileUrl() {
    this.fileUrl = '';
  }


  private setQueryData(valid: boolean, query: OperationsLogQuery) {
    this.isQueryValid = valid;
    this.query = query;
  }

}
