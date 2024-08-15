/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { EventInfo } from '@app/core';

import { DefaultExportationType, ExportationType } from '@app/models';

import { sendEvent } from '@app/shared/utils';

export enum ExportReportModalEventType {
  CLOSE_MODAL_CLICKED             = 'ExportReportModalComponent.Event.CloseModalClicked',
  NOT_READY_EXPORT_BUTTON_CLICKED = 'ExportReportModalComponent.Event.NotReadyExportButtonClicked',
  EXPORT_BUTTON_CLICKED           = 'ExportReportModalComponent.Event.ExportButtonClicked',
}

@Component({
  selector: 'emp-ng-export-report-modal',
  templateUrl: './export-report-modal.component.html',
  styles: [`
    .export-instruction-text {
      padding-bottom: 8px;
    }

    .export-file-url {
      margin-right: 8px;
    }

    .export-progress-text{
      width: 242px;
    }`
  ],
})
export class ExportReportModalComponent implements OnInit, OnChanges {

  @Input() title = 'Exportar';

  @Input() message = null;

  @Input() fileUrl = '';

  @Input() readyToExport = true;

  @Input() exportationTypes: ExportationType[] = [DefaultExportationType];

  @Output() exportReportModalEvent = new EventEmitter<EventInfo>();

  selectedExportationType: ExportationType = null;

  working = false;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.fileUrl) {
      this.working = false;
    }
  }


  ngOnInit() {
    this.setDefaultSelectedFileType();
  }


  get hasFileUrl(): boolean {
    return !!this.fileUrl;
  }


  get isExportButtonReady(): boolean {
    return this.selectedExportationType !== null && this.readyToExport;
  }


  onClose() {
    sendEvent(this.exportReportModalEvent, ExportReportModalEventType.CLOSE_MODAL_CLICKED);
  }


  onExportButtonClicked() {
    if (this.isExportButtonReady) {

      this.working = true;

      sendEvent(this.exportReportModalEvent, ExportReportModalEventType.EXPORT_BUTTON_CLICKED,
        {exportationType: this.selectedExportationType.uid});

    } else {

      sendEvent(this.exportReportModalEvent, ExportReportModalEventType.NOT_READY_EXPORT_BUTTON_CLICKED,
        { exportationType: this.selectedExportationType?.uid });

    }
  }


  private setDefaultSelectedFileType() {
    this.selectedExportationType = this.exportationTypes.length > 0 ? this.exportationTypes[0] : null;
  }

}
