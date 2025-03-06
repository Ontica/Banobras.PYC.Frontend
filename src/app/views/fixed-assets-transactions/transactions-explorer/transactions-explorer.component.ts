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

import { EmptyAssetTransactionsQuery, AssetTransactionDescriptor,
         AssetTransactionsQuery } from '@app/models';

import { TransactionsListEventType } from './transactions-list.component';

import { FixedAssetTransactionsFilterEventType } from './transactions-filter.component';

import {
  ExportReportModalEventType
} from '@app/views/_reports-controls/export-report-modal/export-report-modal.component';


export enum TransactionsExplorerEventType {
  SEARCH_CLICKED            = 'FixedAssetTransactionsExplorerComponent.Event.SearchClicked',
  CLEAR_CLICKED             = 'FixedAssetTransactionsExplorerComponent.Event.ClearClicked',
  EXECUTE_OPERATION_CLICKED = 'FixedAssetTransactionsExplorerComponent.Event.ExecuteOperationClicked',
  EXPORT_CLICKED            = 'FixedAssetTransactionsExplorerComponent.Event.ExportClicked',
  SELECT_CLICKED            = 'FixedAssetTransactionsExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-fa-transactions-explorer',
  templateUrl: './transactions-explorer.component.html',
})
export class FixedAssetTransactionsExplorerComponent implements OnChanges {

  @Input() query: AssetTransactionsQuery = Object.assign({}, EmptyAssetTransactionsQuery);

  @Input() dataList: AssetTransactionDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() fileUrl = '';

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() transactionsExplorerEvent = new EventEmitter<EventInfo>();

  cardTitle = 'Transacciones de activo fijo';

  cardHint = 'Seleccionar los filtros';

  showFilters = false;

  displayExportModal = false;

  PERMISSION_TO_CREATE = PERMISSIONS.FEATURE_EDICION_TRANSACCIONES_INVENTARIO;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.setText();
      this.showFilters = false;
    }
  }


  onCreateTransactionClicked() {

  }


  onTransactionsFilterEvent(event: EventInfo) {
    switch (event.type as FixedAssetTransactionsFilterEventType) {
      case FixedAssetTransactionsFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.transactionsExplorerEvent, TransactionsExplorerEventType.SEARCH_CLICKED,
          event.payload);
        return;
      case FixedAssetTransactionsFilterEventType.CLEAR_CLICKED:
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
