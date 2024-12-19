/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { View } from '@app/main-layout';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { MainUIStateSelector } from '@app/presentation/exported.presentation.types';

import { MessageBoxService } from '@app/shared/services';

import { ArrayLibrary } from '@app/shared/utils';

import { OrdersDataService } from '@app/data-services';

import { OrderHolder, OrderDescriptor, OrdersQuery, EmptyOrderHolder, EmptyOrdersQuery,
         mapOrderDescriptorFromOrder, OrderTypes, OrderTypeConfig, EmptyOrderTypeConfig, getOrderTypeConfig,
         Order, mapPayableOrderDescriptorFromPayableOrder, PayableOrder } from '@app/models';

import { OrdersExplorerEventType } from '../orders-explorer/orders-explorer.component';


@Component({
  selector: 'emp-ng-orders-main-page',
  templateUrl: './orders-main-page.component.html',
})
export class OrdersMainPageComponent implements OnInit, OnDestroy {

  helper: SubscriptionHelper;

  orderTypeConfig: OrderTypeConfig = EmptyOrderTypeConfig;

  query: OrdersQuery = Object.assign({}, EmptyOrdersQuery);

  dataList: OrderDescriptor[] = [];

  selectedData: OrderHolder = EmptyOrderHolder;

  displayTabbedView = false;

  displayCreator = false;

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;


  constructor(private uiLayer: PresentationLayer,
              private ordersData: OrdersDataService,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.subscribeToCurrentViewChanges();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onOrdersExplorerEvent(event: EventInfo) {
    switch (event.type as OrdersExplorerEventType) {
      case OrdersExplorerEventType.CREATE_CLICKED:
        this.displayCreator = true;
        this.messageBox.showInDevelopment('Agregar ' + this.orderTypeConfig.orderNameSingular, event.payload);
        return;
      case OrdersExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as OrdersQuery);
        this.searchOrders(this.query);
        return;
      case OrdersExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as OrdersQuery);
        return;
      case OrdersExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, ' event.payload.item');
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        this.getOrder(event.payload.item.uid);
        return;
      case OrdersExplorerEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        this.messageBox.showInDevelopment('Ejecutar operación', event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private subscribeToCurrentViewChanges() {
    this.helper.select<View>(MainUIStateSelector.CURRENT_VIEW)
      .subscribe(x => this.setRequestsListFromCurrentView(x));
  }


  private setRequestsListFromCurrentView(view: View) {
    switch (view.name) {
      case 'Procurement.Milestones':
        this.orderTypeConfig = getOrderTypeConfig(OrderTypes.PAYABLE_ORDERS)
        return;
      case 'Procurement.MinorPurchases':
        this.orderTypeConfig = getOrderTypeConfig(OrderTypes.MINOR_PURCHASES)
        return;
      case 'Payments.ExpensesAndReimbursement':
        this.orderTypeConfig = getOrderTypeConfig(OrderTypes.EXPENSES)
        return;
      default:
        this.orderTypeConfig = getOrderTypeConfig(null);
        return;
    }
  }


  private searchOrders(query: OrdersQuery) {
    this.isLoading = true;

    this.ordersData.searchOrders(query)
      .firstValue()
      .then(x => this.setDataList(x, true))
      .finally(() => this.isLoading = false);
  }


  private getOrder(orderUID: string, refresh: boolean = false) {
    this.isLoadingSelection = true;

    this.ordersData.getOrder(orderUID)
      .firstValue()
      .then(x => this.resolveGetOrder(x, refresh))
      .finally(() => this.isLoadingSelection = false);
  }


  private resolveGetOrder(data: OrderHolder, refresh: boolean = false) {
    this.setSelectedData(data);

    if (refresh) {
      this.insertItemToList(data);
    }
  }


  private resolveOrderChange(data: OrderHolder) {
    this.insertItemToList(data);
    this.setSelectedData(data);
  }


  private resolveOrderDeleted(orderUID: string) {
    this.removeItemFromList(orderUID);
    this.setSelectedData(EmptyOrderHolder);
  }


  private refreshSelectedData(orderUID: string) {
    this.getOrder(orderUID, true);
  }


  private setQueryAndClearExplorerData(query: OrdersQuery) {
    this.query = Object.assign({}, query);
    this.setDataList([], false);
    this.setSelectedData(EmptyOrderHolder);
  }


  private setDataList(data: OrderDescriptor[], queryExecuted: boolean = true) {
    this.dataList = data ?? [];
    this.queryExecuted = queryExecuted;
  }


  private setSelectedData(data: OrderHolder) {
    this.selectedData = data;
    this.displayTabbedView = !isEmpty(this.selectedData.order);
  }


  private insertItemToList(data: OrderHolder) {
    const dataToInsert = this.validateMapOrderDescriptorByType(data.order);
    const dataListNew = ArrayLibrary.insertItemTop(this.dataList, dataToInsert, 'uid');
    this.setDataList(dataListNew, true);
  }


  private removeItemFromList(orderUID: string) {
    const data = this.dataList.filter(x => x.uid !== orderUID);
    this.setDataList(data);
    this.setSelectedData(EmptyOrderHolder);
  }


  private validateMapOrderDescriptorByType(order: Order): OrderDescriptor {
    switch (this.orderTypeConfig.orderType) {
      case OrderTypes.PAYABLE_ORDERS:
        return mapPayableOrderDescriptorFromPayableOrder(order as PayableOrder);
      default:
        return mapOrderDescriptorFromOrder(order);
    }
  }

}
