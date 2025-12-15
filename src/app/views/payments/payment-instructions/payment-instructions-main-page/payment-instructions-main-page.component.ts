/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { ArrayLibrary } from '@app/shared/utils';

import { PaymentInstructionsDataService } from '@app/data-services';

import { EmptyPaymentInstructionHolder, EmptyPaymentInstructionsQuery,
         mapPaymentInstructionDescriptorFromPaymentInstruction, PaymentInstructionHolder,
         PaymentInstructionDescriptor, PaymentInstructionsQuery } from '@app/models';

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

  displayTabbedView = false;

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;


  constructor(private paymentInstructionsData: PaymentInstructionsDataService,
              private messageBox: MessageBoxService)  { }


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
        this.messageBox.showInDevelopment('Ejecutar operación', event.payload);
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


  private searchPaymentInstructions(query: PaymentInstructionsQuery) {
    this.isLoading = true;

    this.paymentInstructionsData.searchPaymentInstructions(query)
      .firstValue()
      .then(x => this.setDataList(x, true))
      .finally(() => this.isLoading = false);
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


  private setDataList(data: PaymentInstructionDescriptor[], queryExecuted: boolean = true) {
    this.dataList = data ?? [];
    this.queryExecuted = queryExecuted;
  }


  private setSelectedData(data: PaymentInstructionHolder) {
    this.selectedData = data;
    this.displayTabbedView = !isEmpty(this.selectedData.paymentInstruction);
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
