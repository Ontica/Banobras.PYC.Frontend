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

import { PaymentOrdersDataService } from '@app/data-services';

import { EmptyPaymentOrderHolder, EmptyPaymentOrdersQuery, mapPaymentOrderDescriptorFromPaymentOrder,
         PaymentOrderHolder, PaymentOrderDescriptor, PaymentOrdersQuery } from '@app/models';

import { PaymentOrderCreatorEventType } from '../payment-order/payment-order-creator.component';

import { PaymentOrdersExplorerEventType } from '../payment-orders-explorer/payment-orders-explorer.component';

import { PaymentOrderTabbedViewEventType } from '../payment-order-tabbed-view/payment-order-tabbed-view.component';

@Component({
  selector: 'emp-pmt-payment-orders-main-page',
  templateUrl: './payment-orders-main-page.component.html',
})
export class PaymentOrdersMainPageComponent {

  query: PaymentOrdersQuery = Object.assign({}, EmptyPaymentOrdersQuery);

  dataList: PaymentOrderDescriptor[] = [];

  selectedData: PaymentOrderHolder = EmptyPaymentOrderHolder;

  displayTabbedView = false;

  displayCreator = false;

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;


  constructor(private paymentOrdersData: PaymentOrdersDataService,
              private messageBox: MessageBoxService)  { }


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


  private searchPaymentOrders(query: PaymentOrdersQuery) {
    this.isLoading = true;

    this.paymentOrdersData.searchPaymentOrders(query)
      .firstValue()
      .then(x => this.setDataList(x, true))
      .finally(() => this.isLoading = false);
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


  private setDataList(data: PaymentOrderDescriptor[], queryExecuted: boolean = true) {
    this.dataList = data ?? [];
    this.queryExecuted = queryExecuted;
  }


  private setSelectedData(data: PaymentOrderHolder) {
    this.selectedData = data;
    this.displayTabbedView = !isEmpty(this.selectedData.paymentOrder);
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
