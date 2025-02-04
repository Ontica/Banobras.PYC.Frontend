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

import { ObjectTypes, OrderExplorerTypeConfig, Order, PayableOrder, ContractOrder, OrderDescriptor,
         OrdersQuery, OrderHolder, EmptyOrderHolder, EmptyOrdersQuery, EmptyOrderExplorerTypeConfig,
         getOrderExplorerTypeConfig, mapOrderDescriptorFromOrder, mapPayableOrderDescriptorFromPayableOrder,
         mapContractOrderDescriptorFromContractOrder } from '@app/models';

import { OrderCreatorEventType } from '../order/order-creator.component';

import { OrdersExplorerEventType } from '../orders-explorer/orders-explorer.component';

import { OrderTabbedViewEventType } from '../order-tabbed-view/order-tabbed-view.component';


@Component({
  selector: 'emp-ng-orders-main-page',
  templateUrl: './orders-main-page.component.html',
})
export class OrdersMainPageComponent implements OnInit, OnDestroy {

  helper: SubscriptionHelper;

  config: OrderExplorerTypeConfig<ObjectTypes> = EmptyOrderExplorerTypeConfig;

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


  onOrderCreatorEvent(event: EventInfo) {
    switch (event.type as OrderCreatorEventType) {
      case OrderCreatorEventType.CLOSE_MODAL_CLICKED:
        this.displayCreator = false;
        return;
      case OrderCreatorEventType.CREATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        this.displayCreator = false;
        this.resolveOrderChange(event.payload.data as OrderHolder);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onOrdersExplorerEvent(event: EventInfo) {
    switch (event.type as OrdersExplorerEventType) {
      case OrdersExplorerEventType.CREATE_CLICKED:
        this.displayCreator = true;
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


  onOrderTabbedViewEvent(event: EventInfo) {
    switch (event.type as OrderTabbedViewEventType) {
      case OrderTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedData(EmptyOrderHolder);
        return;
      case OrderTabbedViewEventType.DATA_UPDATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        this.resolveOrderChange(event.payload.data as OrderHolder);
        return;
      case OrderTabbedViewEventType.DATA_DELETED:
        Assertion.assertValue(event.payload.orderUID, 'event.payload.orderUID');
        this.resolveOrderDeleted(event.payload.orderUID);
        return;
      case OrderTabbedViewEventType.REFRESH_DATA:
        Assertion.assertValue(event.payload.orderUID, 'event.payload.orderUID');
        this.refreshSelectedData(event.payload.orderUID);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private subscribeToCurrentViewChanges() {
    this.helper.select<View>(MainUIStateSelector.CURRENT_VIEW)
      .subscribe(x => this.setExplorerConfigFromCurrentView(x));
  }


  private setExplorerConfigFromCurrentView(view: View) {
    switch (view.name) {
      case 'Procurement.ContractOrders':
        this.config = getOrderExplorerTypeConfig(ObjectTypes.CONTRACT_ORDER)
        return;
      case 'Procurement.MinorPurchases':
        this.config = getOrderExplorerTypeConfig(ObjectTypes.PURCHASE_ORDER)
        return;
      case 'Payments.ExpensesAndReimbursement':
        this.config = getOrderExplorerTypeConfig(ObjectTypes.EXPENSE)
        return;
      default:
        this.config = getOrderExplorerTypeConfig(null);
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
  }


  private validateMapOrderDescriptorByType(order: Order): OrderDescriptor {
    switch (this.config.type) {
      case ObjectTypes.CONTRACT_ORDER:
        return mapContractOrderDescriptorFromContractOrder(order as ContractOrder);
      case ObjectTypes.PURCHASE_ORDER:
      case ObjectTypes.EXPENSE:
        return mapPayableOrderDescriptorFromPayableOrder(order as PayableOrder);
      default:
        return mapOrderDescriptorFromOrder(order);
    }
  }

}
