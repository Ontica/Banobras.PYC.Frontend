/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { ArrayLibrary } from '@app/shared/utils';

import { PaymentInstructionsDataService } from '@app/data-services';

import { EmptyPaymentInstructionHolder, EmptyPaymentInstructionsQuery,
         mapPaymentInstructionDescriptorFromPaymentInstruction, PaymentInstructionHolder,
         PaymentInstructionDescriptor, PaymentInstructionsQuery, ExplorerBulkOperationData,
         EmptyExplorerBulkOperationData, ExplorerOperationCommand, ExplorerOperationType,
         ExplorerOperationResult } from '@app/models';

import {
  ExportReportModalEventType
} from '@app/views/_reports-controls/export-report-modal/export-report-modal.component';

import {
  PaymentInstructionsExplorerEventType
} from '../payment-instructions-explorer/payment-instructions-explorer.component';

import {
  PaymentInstructionTabbedViewEventType
} from '../payment-instruction-tabbed-view/payment-instruction-tabbed-view.component';


@Component({
  selector: 'emp-pmt-payment-instructions-main-page',
  templateUrl: './payment-instructions-main-page.component.html',
})
export class PaymentInstructionsMainPageComponent {

  query: PaymentInstructionsQuery = Object.assign({}, EmptyPaymentInstructionsQuery);

  dataList: PaymentInstructionDescriptor[] = [];

  selectedData: PaymentInstructionHolder = EmptyPaymentInstructionHolder;

  selectedExportData: ExplorerBulkOperationData = Object.assign({}, EmptyExplorerBulkOperationData);

  displayTabbedView = false;

  displayExportModal = false;

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;


  constructor(private paymentInstructionsData: PaymentInstructionsDataService)  { }


  onPaymentInstructionsExplorerEvent(event: EventInfo) {
    switch (event.type as PaymentInstructionsExplorerEventType) {
      case PaymentInstructionsExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as PaymentInstructionsQuery);
        this.searchPaymentInstructions(this.query);
        return;
      case PaymentInstructionsExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as PaymentInstructionsQuery);
        return;
      case PaymentInstructionsExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, ' event.payload.item');
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        this.getPaymentInstruction(event.payload.item.uid);
        return;
      case PaymentInstructionsExplorerEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        Assertion.assertValue(event.payload.command, 'event.payload.command');
        this.validateBulkOperationPaymentInstructions(event.payload.operation as ExplorerOperationType,
                                                      event.payload.command as ExplorerOperationCommand)
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onPaymentInstructionTabbedViewEvent(event: EventInfo) {
    switch (event.type as PaymentInstructionTabbedViewEventType) {
      case PaymentInstructionTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedData(EmptyPaymentInstructionHolder);
        return;
      case PaymentInstructionTabbedViewEventType.DATA_UPDATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        this.insertItemToList(event.payload.data as PaymentInstructionHolder);
        return;
      case PaymentInstructionTabbedViewEventType.DATA_DELETED:
        Assertion.assertValue(event.payload.dataUID, 'event.payload.dataUID');
        this.removeItemFromList(event.payload.dataUID);
        return;
      case PaymentInstructionTabbedViewEventType.REFRESH_DATA:
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
        this.bulkOperationPaymentInstructions(this.selectedExportData.operation, this.selectedExportData.command);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchPaymentInstructions(query: PaymentInstructionsQuery) {
    this.isLoading = true;

    this.paymentInstructionsData.searchPaymentInstructions(query)
      .firstValue()
      .then(x => this.setDataList(x, true))
      .finally(() => this.isLoading = false);
  }


  private bulkOperationPaymentInstructions(operation: ExplorerOperationType,
                                           command: ExplorerOperationCommand) {
    this.isLoadingSelection = true;

    this.paymentInstructionsData.bulkOperationPaymentInstructions(operation, command)
      .firstValue()
      .then(x => this.resolveBulkOperationPaymentInstructions(operation, x))
      .finally(() => this.isLoadingSelection = false);
  }


  private getPaymentInstruction(dataUID: string) {
    this.isLoadingSelection = true;

    this.paymentInstructionsData.getPaymentInstruction(dataUID)
      .firstValue()
      .then(x => this.setSelectedData(x))
      .finally(() => this.isLoadingSelection = false);
  }


  private refreshSelectedData(dataUID: string) {
    this.getPaymentInstruction(dataUID);
  }


  private setQueryAndClearExplorerData(query: PaymentInstructionsQuery) {
    this.query = Object.assign({}, query);
    this.setDataList([], false);
    this.setSelectedData(EmptyPaymentInstructionHolder);
  }


  private validateBulkOperationPaymentInstructions(operation: ExplorerOperationType,
                                                   command: ExplorerOperationCommand) {
    switch (operation) {
      case ExplorerOperationType.export:
        this.showExportPaymentInstructions(operation, command);
        return;
      default:
        console.log(`Unhandled user interface event ${operation}`);
        return;
    }
  }


  private resolveBulkOperationPaymentInstructions(operation: ExplorerOperationType,
                                                  result: ExplorerOperationResult) {
    switch (operation) {
      case ExplorerOperationType.export:
        this.resolveExportPaymentInstructions(result);
        return;
      default:
        console.log(`Unhandled user interface event ${operation}`);
        return;
    }
  }


  private resolveExportPaymentInstructions(result: ExplorerOperationResult) {
    this.selectedExportData.fileUrl = result.file.url;
    this.selectedExportData.message = result.message;
  }


  private showExportPaymentInstructions(operation: ExplorerOperationType,
                                        command: ExplorerOperationCommand) {
    let title = '';
    let message = '';

    switch (operation) {
      case ExplorerOperationType.export:
        title = 'Exportar instrucciones de pago';
        message = `Se generará la exportación a Excel de las ` +
          `<strong>${command.items.length} instrucciones de pago</strong> seleccionadas.` +
          `<br><br>¿Exporto las instrucciones de pago?`;
        break;
      default:
        console.log(`Unhandled export payment instructions operation type ${operation}`);
        return;
    }

    this.setSelectedExportData(true, operation, command, title, message);
  }


  private setDataList(data: PaymentInstructionDescriptor[], queryExecuted: boolean = true) {
    this.dataList = data ?? [];
    this.queryExecuted = queryExecuted;
  }


  private setSelectedData(data: PaymentInstructionHolder) {
    this.selectedData = data;
    this.displayTabbedView = !isEmpty(this.selectedData.paymentInstruction);
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


  private insertItemToList(data: PaymentInstructionHolder) {
    const dataToInsert = mapPaymentInstructionDescriptorFromPaymentInstruction(data.paymentInstruction);
    const dataListNew = ArrayLibrary.insertItemTop(this.dataList, dataToInsert, 'uid');
    this.setDataList(dataListNew);
    this.setSelectedData(data);
  }


  private removeItemFromList(dataUID: string) {
    const dataListNew = this.dataList.filter(x => x.uid !== dataUID);
    this.setDataList(dataListNew);
    this.setSelectedData(EmptyPaymentInstructionHolder);
  }

}
