/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { ArrayLibrary } from '@app/shared/utils';

import { PaymentOrdersDataService } from '@app/data-services';

import { EmptyPaymentOrderHolder, EmptyPaymentOrdersQuery, mapPaymentOrderDescriptorFromPaymentOrder,
         PaymentOrderHolder, PaymentOrderDescriptor, PaymentOrdersQuery, ExplorerBulkOperationData,
         EmptyExplorerBulkOperationData, ExplorerOperationType, ExplorerOperationCommand,
         ExplorerOperationResult } from '@app/models';

import {
  ExportReportModalEventType
} from '@app/views/_reports-controls/export-report-modal/export-report-modal.component';

import { PaymentOrderCreatorEventType } from '../payment-order/payment-order-creator.component';

import { PaymentOrdersExplorerEventType } from '../payment-orders-explorer/payment-orders-explorer.component';

import {
  PaymentOrderTabbedViewEventType
} from '../payment-order-tabbed-view/payment-order-tabbed-view.component';

@Component({
  selector: 'emp-pmt-payment-orders-main-page',
  templateUrl: './payment-orders-main-page.component.html',
})
export class PaymentOrdersMainPageComponent {

  query: PaymentOrdersQuery = Object.assign({}, EmptyPaymentOrdersQuery);

  dataList: PaymentOrderDescriptor[] = [];

  selectedData: PaymentOrderHolder = EmptyPaymentOrderHolder;

  selectedExportData: ExplorerBulkOperationData = Object.assign({}, EmptyExplorerBulkOperationData);

  displayTabbedView = false;

  displayCreator = false;

  displayExportModal = false;

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;


  constructor(private paymentOrdersData: PaymentOrdersDataService)  { }


  onPaymentOrderCreatorEvent(event: EventInfo) {
    switch (event.type as PaymentOrderCreatorEventType) {
      case PaymentOrderCreatorEventType.CLOSE_MODAL_CLICKED:
        this.displayCreator = false;
        return;
      case PaymentOrderCreatorEventType.CREATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        this.displayCreator = false;
        this.insertItemToList(event.payload.data as PaymentOrderHolder);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onPaymentOrdersExplorerEvent(event: EventInfo) {
    switch (event.type as PaymentOrdersExplorerEventType) {
      case PaymentOrdersExplorerEventType.CREATE_CLICKED:
        this.displayCreator = true;
        return;
      case PaymentOrdersExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as PaymentOrdersQuery);
        this.searchPaymentOrders(this.query);
        return;
      case PaymentOrdersExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as PaymentOrdersQuery);
        return;
      case PaymentOrdersExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, ' event.payload.item');
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        this.getPaymentOrder(event.payload.item.uid);
        return;
      case PaymentOrdersExplorerEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        Assertion.assertValue(event.payload.command, 'event.payload.command');
        this.validateBulkOperationPaymentOrders(event.payload.operation as ExplorerOperationType,
                                                event.payload.command as ExplorerOperationCommand)
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onPaymentOrderTabbedViewEvent(event: EventInfo) {
    switch (event.type as PaymentOrderTabbedViewEventType) {
      case PaymentOrderTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedData(EmptyPaymentOrderHolder);
        return;
      case PaymentOrderTabbedViewEventType.DATA_UPDATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        this.insertItemToList(event.payload.data as PaymentOrderHolder);
        return;
      case PaymentOrderTabbedViewEventType.DATA_DELETED:
        Assertion.assertValue(event.payload.dataUID, 'event.payload.dataUID');
        this.removeItemFromList(event.payload.dataUID);
        return;
      case PaymentOrderTabbedViewEventType.REFRESH_DATA:
        Assertion.assertValue(event.payload.dataUID, 'event.payload.dataUID');
        this.refreshSelectedData(event.payload.dataUID);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onExportReportModalEvent(event: EventInfo) {
    switch (event.type as ExportReportModalEventType) {
      case ExportReportModalEventType.CLOSE_MODAL_CLICKED:
        this.setSelectedExportData(false);
        return;
      case ExportReportModalEventType.EXPORT_BUTTON_CLICKED:
        this.bulkOperationPaymentOrders(this.selectedExportData.operation, this.selectedExportData.command);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchPaymentOrders(query: PaymentOrdersQuery) {
    this.isLoading = true;

    this.paymentOrdersData.searchPaymentOrders(query)
      .firstValue()
      .then(x => this.setDataList(x, true))
      .finally(() => this.isLoading = false);
  }


  private bulkOperationPaymentOrders(operation: ExplorerOperationType,
                                     command: ExplorerOperationCommand) {
    this.isLoadingSelection = true;

    this.paymentOrdersData.bulkOperationPaymentOrders(operation, command)
      .firstValue()
      .then(x => this.resolveBulkOperationPaymentOrders(operation, x))
      .finally(() => this.isLoadingSelection = false);
  }


  private getPaymentOrder(dataUID: string) {
    this.isLoadingSelection = true;

    this.paymentOrdersData.getPaymentOrder(dataUID)
      .firstValue()
      .then(x => this.setSelectedData(x))
      .finally(() => this.isLoadingSelection = false);
  }


  private refreshSelectedData(dataUID: string) {
    this.getPaymentOrder(dataUID);
  }


  private setQueryAndClearExplorerData(query: PaymentOrdersQuery) {
    this.query = Object.assign({}, query);
    this.setDataList([], false);
    this.setSelectedData(EmptyPaymentOrderHolder);
  }


  private validateBulkOperationPaymentOrders(operation: ExplorerOperationType,
                                             command: ExplorerOperationCommand) {
    switch (operation) {
      case ExplorerOperationType.export:
        this.showExportPaymentOrders(operation, command);
        return;
      default:
        console.log(`Unhandled user interface event ${operation}`);
        return;
    }
  }


  private resolveBulkOperationPaymentOrders(operation: ExplorerOperationType,
                                            result: ExplorerOperationResult) {
    switch (operation) {
      case ExplorerOperationType.export:
        this.resolveExportPaymentOrders(result);
        return;
      default:
        console.log(`Unhandled user interface event ${operation}`);
        return;
    }
  }


  private resolveExportPaymentOrders(result: ExplorerOperationResult) {
    this.selectedExportData.fileUrl = result.file.url;
    this.selectedExportData.message = result.message;
  }


  private showExportPaymentOrders(operation: ExplorerOperationType,
                                  command: ExplorerOperationCommand) {
    let title = '';
    let message = '';

    switch (operation) {
      case ExplorerOperationType.export:
        title = 'Exportar solicitudes de pago';
        message = `Se generará la exportación a Excel de las ` +
          `<strong>${command.items.length} solicitudes de pago</strong> seleccionadas.` +
          `<br><br>¿Exporto las solicitudes de pago?`;
        break;
      default:
        console.log(`Unhandled export payment orders operation type ${operation}`);
        return;
    }

    this.setSelectedExportData(true, operation, command, title, message);
  }


  private setDataList(data: PaymentOrderDescriptor[], queryExecuted: boolean = true) {
    this.dataList = data ?? [];
    this.queryExecuted = queryExecuted;
  }


  private setSelectedData(data: PaymentOrderHolder) {
    this.selectedData = data;
    this.displayTabbedView = !isEmpty(this.selectedData.paymentOrder);
  }


  private setSelectedExportData(display: boolean,
                                operation?: ExplorerOperationType,
                                command?: ExplorerOperationCommand,
                                title?: string, message?: string) {
    this.displayExportModal = display;
    this.selectedExportData = {
      operation: operation ?? null,
      command: command ?? null,
      title: title ?? null,
      message: message ?? null,
      fileUrl: '',
     };
  }


  private insertItemToList(data: PaymentOrderHolder) {
    const dataToInsert = mapPaymentOrderDescriptorFromPaymentOrder(data);
    const dataListNew = ArrayLibrary.insertItemTop(this.dataList, dataToInsert, 'uid');
    this.setDataList(dataListNew);
    this.setSelectedData(data);
  }


  private removeItemFromList(dataUID: string) {
    const dataListNew = this.dataList.filter(x => x.uid !== dataUID);
    this.setDataList(dataListNew);
    this.setSelectedData(EmptyPaymentOrderHolder);
  }

}
