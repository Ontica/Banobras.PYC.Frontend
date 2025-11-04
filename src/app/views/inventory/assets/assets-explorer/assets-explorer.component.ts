/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyAssetsQuery, AssetDescriptor, AssetsQuery, buildExplorerHint } from '@app/models';

import { AssetsFilterEventType } from './assets-filter.component';

import { AssetsTableEventType } from './assets-table.component';

import {
  ExportReportModalEventType
} from '@app/views/_reports-controls/export-report-modal/export-report-modal.component';


export enum AssetsExplorerEventType {
  SEARCH_CLICKED            = 'AssetsExplorerComponent.Event.SearchClicked',
  CLEAR_CLICKED             = 'AssetsExplorerComponent.Event.ClearClicked',
  EXECUTE_OPERATION_CLICKED = 'AssetsExplorerComponent.Event.ExecuteOperationClicked',
  EXPORT_CLICKED            = 'AssetsExplorerComponent.Event.ExportClicked',
  SELECT_CLICKED            = 'AssetsExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-inv-assets-explorer',
  templateUrl: './assets-explorer.component.html',
})
export class AssetsExplorerComponent implements OnChanges {

  @Input() query: AssetsQuery = Object.assign({}, EmptyAssetsQuery);

  @Input() dataList: AssetDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() fileUrl = '';

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() assetsExplorerEvent = new EventEmitter<EventInfo>();

  hint = 'Seleccionar los filtros';

  showFilters = false;

  displayExportModal = false;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.setText();
      this.showFilters = false;
    }
  }


  onAssetsFilterEvent(event: EventInfo) {
    switch (event.type as AssetsFilterEventType) {
      case AssetsFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.assetsExplorerEvent, AssetsExplorerEventType.SEARCH_CLICKED,
          event.payload);
        return;
      case AssetsFilterEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.assetsExplorerEvent, AssetsExplorerEventType.CLEAR_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onAssetsTableEvent(event: EventInfo) {
    switch (event.type as AssetsTableEventType) {
      case AssetsTableEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, 'event.payload.item');
        sendEvent(this.assetsExplorerEvent, AssetsExplorerEventType.SELECT_CLICKED,
          event.payload);
        return;
      case AssetsTableEventType.EXPORT_DATA_CLICKED:
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
        sendEvent(this.assetsExplorerEvent, AssetsExplorerEventType.EXPORT_CLICKED,
          { query: this.query });
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setText() {
    this.hint = buildExplorerHint(this.queryExecuted, this.dataList.length);
  }


  private setDisplayExportModal(display: boolean) {
    this.displayExportModal = display;
    this.fileUrl = '';
  }

}
