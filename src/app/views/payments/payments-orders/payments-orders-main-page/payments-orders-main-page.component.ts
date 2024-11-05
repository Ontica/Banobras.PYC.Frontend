/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { ArrayLibrary } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { PaymentOrdersDataService } from '@app/data-services';

import { EmptyPaymentOrderData, EmptyPaymentsOrdersQuery, mapPaymentOrderDescriptorFromPaymentOrder,
         PaymentOrderData, PaymentOrderDescriptor, PaymentsOrdersQuery } from '@app/models';

import {
  PaymentsOrdersExplorerEventType
} from '../payments-orders-explorer/payments-orders-explorer.component';

import {
  PaymentOrderTabbedViewEventType
} from '../payment-order-tabbed-view/payment-order-tabbed-view.component';


@Component({
  selector: 'emp-pmt-payments-orders-main-page',
  templateUrl: './payments-orders-main-page.component.html',
})
export class PaymentsOrdersMainPageComponent {

  query: PaymentsOrdersQuery = Object.assign({}, EmptyPaymentsOrdersQuery);

  dataList: PaymentOrderDescriptor[] = [];

  selectedData: PaymentOrderData = EmptyPaymentOrderData;

  displayTabbedView = false;

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;


  constructor(private paymentOrdersData: PaymentOrdersDataService,
              private messageBox: MessageBoxService)  { }


  onPaymentsOrdersExplorerEvent(event: EventInfo) {
    switch (event.type as PaymentsOrdersExplorerEventType) {
      case PaymentsOrdersExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as PaymentsOrdersQuery);
        this.searchPaymentsOrders(this.query);
        return;
      case PaymentsOrdersExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as PaymentsOrdersQuery);
        return;
      case PaymentsOrdersExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, ' event.payload.item');
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        this.getPaymentOrderData(event.payload.item.uid);
        return;
      case PaymentsOrdersExplorerEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        this.messageBox.showInDevelopment('Ejecutar operación', event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onPaymentOrderTabbedViewEvent(event: EventInfo) {
    switch (event.type as PaymentOrderTabbedViewEventType) {
      case PaymentOrderTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedData(EmptyPaymentOrderData);
        return;
      case PaymentOrderTabbedViewEventType.DATA_UPDATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        this.insertItemToList(event.payload.data as PaymentOrderData);
        return;
      case PaymentOrderTabbedViewEventType.DATA_DELETED:
        Assertion.assertValue(event.payload.paymentOrderUID, 'event.payload.paymentOrderUID');
        this.removeItemFromList(event.payload.paymentOrderUID);
        return;
      case PaymentOrderTabbedViewEventType.REFRESH_DATA:
        Assertion.assertValue(event.payload.paymentOrderUID, 'event.payload.paymentOrderUID');
        this.refreshSelectedData(event.payload.paymentOrderUID);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchPaymentsOrders(query: PaymentsOrdersQuery) {
    this.isLoading = true;

    this.paymentOrdersData.searchPaymentsOrders(query)
      .firstValue()
      .then(x => this.setDataList(x, true))
      .finally(() => this.isLoading = false);
  }


  private getPaymentOrderData(paymentOrderUID: string) {
    this.isLoadingSelection = true;

    this.paymentOrdersData.getPaymentOrderData(paymentOrderUID)
      .firstValue()
      .then(x => this.setSelectedData(x))
      .finally(() => this.isLoadingSelection = false);
  }


  private refreshSelectedData(paymentOrderUID: string) {
    this.getPaymentOrderData(paymentOrderUID);
  }


  private setQueryAndClearExplorerData(query: PaymentsOrdersQuery) {
    this.query = Object.assign({}, query);
    this.clearDataList();
  }


  private clearDataList() {
    this.setDataList([], false);
  }


  private setDataList(data: PaymentOrderDescriptor[], queryExecuted: boolean = true) {
    this.dataList = data ?? [];
    this.queryExecuted = queryExecuted;
  }


  private setSelectedData(data: PaymentOrderData) {
    this.selectedData = data;
    this.displayTabbedView = !isEmpty(this.selectedData.paymentOrder);
  }


  private insertItemToList(data: PaymentOrderData) {
    const dataToInsert = mapPaymentOrderDescriptorFromPaymentOrder(data);
    const dataListNew = ArrayLibrary.insertItemTop(this.dataList, dataToInsert, 'uid');
    this.setDataList(dataListNew);
    this.setSelectedData(data);
  }


  private removeItemFromList(dataUID: string) {
    const dataListNew = this.dataList.filter(x => x.uid !== dataUID);
    this.setDataList(dataListNew);
    this.setSelectedData(EmptyPaymentOrderData);
  }

}
