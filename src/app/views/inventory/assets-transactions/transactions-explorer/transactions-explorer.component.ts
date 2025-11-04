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

import { AssetsTransactionDescriptor, AssetsTransactionsQuery, EmptyAssetsTransactionsQuery,
         TransactionStages, TransactionStagesList, buildExplorerHint } from '@app/models';

import { TransactionsListEventType } from './transactions-list.component';

import { TransactionsFilterEventType } from './transactions-filter.component';

import {
  ExportReportModalEventType
} from '@app/views/_reports-controls/export-report-modal/export-report-modal.component';


export enum TransactionsExplorerEventType {
  CREATE_CLICKED            = 'AssetsTransactionsExplorerComponent.Event.CreateClicked',
  SEARCH_CLICKED            = 'AssetsTransactionsExplorerComponent.Event.SearchClicked',
  CLEAR_CLICKED             = 'AssetsTransactionsExplorerComponent.Event.ClearClicked',
  EXECUTE_OPERATION_CLICKED = 'AssetsTransactionsExplorerComponent.Event.ExecuteOperationClicked',
  EXPORT_CLICKED            = 'AssetsTransactionsExplorerComponent.Event.ExportClicked',
  SELECT_CLICKED            = 'AssetsTransactionsExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-inv-transactions-explorer',
  templateUrl: './transactions-explorer.component.html',
})
export class AssetsTransactionsExplorerComponent implements OnChanges {

  @Input() query: AssetsTransactionsQuery = Object.assign({}, EmptyAssetsTransactionsQuery);

  @Input() dataList: AssetsTransactionDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() fileUrl = '';

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() transactionsExplorerEvent = new EventEmitter<EventInfo>();

  hint = 'Seleccionar los filtros';

  showFilters = false;

  displayExportModal = false;

  stagesList: Identifiable<TransactionStages>[] = TransactionStagesList;

  stage: TransactionStages = TransactionStages.MyInbox;

  PERMISSION_TO_CREATE = PERMISSIONS.NOT_REQUIRED;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.setText();
      this.showFilters = false;
    }
  }


  onStageChanged() {
    sendEvent(this.transactionsExplorerEvent, TransactionsExplorerEventType.CLEAR_CLICKED,
      { query: this.query });
  }


  onCreateTransactionClicked() {
    sendEvent(this.transactionsExplorerEvent, TransactionsExplorerEventType.CREATE_CLICKED);
  }


  onTransactionsFilterEvent(event: EventInfo) {
    switch (event.type as TransactionsFilterEventType) {
      case TransactionsFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.transactionsExplorerEvent, TransactionsExplorerEventType.SEARCH_CLICKED,
          event.payload);
        return;
      case TransactionsFilterEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.transactionsExplorerEvent, TransactionsExplorerEventType.CLEAR_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onTransactionsListEvent(event: EventInfo) {
    switch (event.type as TransactionsListEventType) {
      case TransactionsListEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.transaction, 'event.payload.transaction');
        sendEvent(this.transactionsExplorerEvent, TransactionsExplorerEventType.SELECT_CLICKED,
          event.payload);
        return;
      case TransactionsListEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        sendEvent(this.transactionsExplorerEvent, TransactionsExplorerEventType.EXECUTE_OPERATION_CLICKED,
          event.payload);
        return;
      case TransactionsListEventType.EXPORT_DATA_CLICKED:
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
        sendEvent(this.transactionsExplorerEvent, TransactionsExplorerEventType.EXPORT_CLICKED,
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
