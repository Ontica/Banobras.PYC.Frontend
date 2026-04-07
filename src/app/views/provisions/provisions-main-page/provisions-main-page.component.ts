/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { View } from '@app/data';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { MainUIStateSelector } from '@app/presentation/exported.presentation.types';

import { MessageBoxService } from '@app/shared/services';

import { OrdersDataService, ProvisionsDataService } from '@app/data-services';

import { EmptyOrderHolder, EmptyProvisionHolder, EmptyProvisionsQuery, OrderHolder, ProvisionHolder,
         ProvisionDescriptor, ProvisionsQuery, getOrderExplorerTypeConfig, ObjectTypes, ProvisionQueryTypes,
         ProvisionsOperationType, ExplorerOperationCommand, ExplorerOperationResult } from '@app/models';

import { OrderTabbedViewEventType } from '@app/views/orders/order-tabbed-view/order-tabbed-view.component';

import { ProvisionsExplorerEventType } from '../provisions-explorer/provisions-explorer.component';



@Component({
  selector: 'emp-ng-provisions-main-page',
  templateUrl: './provisions-main-page.component.html',
})
export class ProvisionsMainPageComponent implements OnInit, OnDestroy {

  helper: SubscriptionHelper;

  queryType: ProvisionQueryTypes = ProvisionQueryTypes.All;

  query: ProvisionsQuery = Object.assign({}, EmptyProvisionsQuery);

  dataList: ProvisionDescriptor[] = [];

  selectedData: ProvisionHolder = EmptyProvisionHolder;

  displayTabbedView = false;

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;


  constructor(private uiLayer: PresentationLayer,
              private provisionsData: ProvisionsDataService,
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


  onProvisionsExplorerEvent(event: EventInfo) {
    switch (event.type as ProvisionsExplorerEventType) {
      case ProvisionsExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as ProvisionsQuery);
        this.searchProvisions(this.query);
        return;
      case ProvisionsExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as ProvisionsQuery);
        return;
      case ProvisionsExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, ' event.payload.item');
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        this.getOrder(event.payload.item.uid);
        return;
      case ProvisionsExplorerEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        Assertion.assertValue(event.payload.command, 'event.payload.command');
        Assertion.assertValue(event.payload.command.items, 'event.payload.command.items');
        this.validateBulkOperationProvisions(event.payload.operation as ProvisionsOperationType,
                                             event.payload.command as ExplorerOperationCommand);
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
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private subscribeToCurrentViewChanges() {
    this.helper.select<View>(MainUIStateSelector.CURRENT_VIEW)
      .subscribe(x => this.setQueryTypeFromCurrentView(x));
  }


  private setQueryTypeFromCurrentView(view: View) {
    switch (view.name) {
      case 'Procurement.Provisions':
        this.queryType = ProvisionQueryTypes.Procurement;
        return;
      case 'Budget.Provisions':
        this.queryType = ProvisionQueryTypes.Budget;
        return;
      default:
        this.queryType = ProvisionQueryTypes.All;
        return;
    }
  }


  private searchProvisions(query: ProvisionsQuery) {
    this.isLoading = true;

    this.provisionsData.searchProvisions(query)
      .firstValue()
      .then(x => this.setDataList(x, true))
      .finally(() => this.isLoading = false);
  }


  private bulkOperationProvisions(operation: ProvisionsOperationType,
                                  command: ExplorerOperationCommand) {
    this.isLoadingSelection = true;

    this.provisionsData.bulkOperationProvisions(operation, command)
      .firstValue()
      .then(x => this.resolveBulkOperationResponse(operation, x))
      .finally(() => this.isLoadingSelection = false);
  }


  private getOrder(orderUID: string) {
    this.isLoadingSelection = true;

    this.ordersData.getOrder(orderUID)
      .firstValue()
      .then(x => this.setSelectedData(x))
      .finally(() => this.isLoadingSelection = false);
  }


  private setQueryAndClearExplorerData(query: ProvisionsQuery) {
    this.query = Object.assign({}, query);
    this.setDataList([], false);
    this.setSelectedData(EmptyOrderHolder);
  }


  private setDataList(data: ProvisionDescriptor[], queryExecuted: boolean = true) {
    this.dataList = data ?? [];
    this.queryExecuted = queryExecuted;
  }


  private setSelectedData(data: OrderHolder) {
    const orderType = data.order?.type?.uid as ObjectTypes ?? null;
    this.selectedData = Object.assign({}, { order: data, config: getOrderExplorerTypeConfig(orderType) });
    this.displayTabbedView = !isEmpty(this.selectedData.order.order);
  }


  private refreshData(selectedData: OrderHolder = EmptyOrderHolder) {
    this.searchProvisions(this.query);
    this.setSelectedData(selectedData);
  }


  private validateBulkOperationProvisions(operation: ProvisionsOperationType,
                                          command: ExplorerOperationCommand) {
    switch (operation) {
      case ProvisionsOperationType.provision:
      case ProvisionsOperationType.deprovision:
      case ProvisionsOperationType.accept:
      case ProvisionsOperationType.reject:
        this.bulkOperationProvisions(operation, command);
        return;
      default:
        console.log(`Unhandled user interface event ${operation}`);
        return;
    }
  }


  private resolveBulkOperationResponse(operation: ProvisionsOperationType,
                                       result: ExplorerOperationResult) {
    switch (operation) {
      case ProvisionsOperationType.provision:
      case ProvisionsOperationType.deprovision:
      case ProvisionsOperationType.accept:
      case ProvisionsOperationType.reject:
        this.messageBox.show(result.message, 'Ejecutar operacion');
        this.refreshData();
        return;
      default:
        console.log(`Unhandled user interface event ${operation}`);
        return;
    }
  }

}
