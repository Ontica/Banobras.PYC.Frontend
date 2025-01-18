/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { SelectionModel } from '@angular/cdk/collections';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';

import { EventInfo } from '@app/core';

import { EmptyOrderExplorerTypeConfig, isEntityStatusInWarning, OrderDescriptor, OrdersOperationsList,
         OrderExplorerTypeConfig, ObjectTypes, Priority } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { ListControlsEventType } from '@app/views/_reports-controls/explorer/list-controls.component';


export enum OrdersDataEventType {
  SELECT_CLICKED            = 'OrdersDataComponent.Event.SelectClicked',
  EXECUTE_OPERATION_CLICKED = 'OrdersDataComponent.Event.ExecuteOperationClicked',
}

@Component({
  selector: 'emp-ng-orders-data',
  templateUrl: './orders-data.component.html',
})
export class OrdersDataComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() config: OrderExplorerTypeConfig<ObjectTypes> = EmptyOrderExplorerTypeConfig;

  @Input() dataList: OrderDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() queryExecuted = false;

  @Output() ordersDataEvent = new EventEmitter<EventInfo>();

  displayedColumns: string[] = ['check', 'order', 'manager', 'status'];

  dataSource: TableVirtualScrollDataSource<OrderDescriptor>;

  selection = new SelectionModel<OrderDescriptor>(true, []);

  operationsList = OrdersOperationsList;

  isEntityStatusInWarning = isEntityStatusInWarning;

  Priority = Priority;

  OrderType = ObjectTypes;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.clearSelection();
      this.setDataSource();
      this.scrollToTop();
    }
  }


  onListControlsEvent(event: EventInfo) {
    switch (event.type as ListControlsEventType) {
      case ListControlsEventType.EXECUTE_OPERATION_CLICKED:
        sendEvent(this.ordersDataEvent, OrdersDataEventType.EXECUTE_OPERATION_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onItemClicked(item: OrderDescriptor) {
    sendEvent(this.ordersDataEvent, OrdersDataEventType.SELECT_CLICKED, { item });
  }


  private clearSelection() {
    this.selection.clear();
  }


  private setDataSource() {
    this.dataSource = new TableVirtualScrollDataSource(this.dataList);
    this.resetColumns();
  }


  private resetColumns() {
    if (this.config.type === ObjectTypes.CONTRACT_ORDER) {
      this.displayedColumns = ['check', 'order', 'manager', 'especif', 'status'];
      return;
    }

    this.displayedColumns = ['check', 'order', 'manager', 'status'];
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(-1);
    }
  }

}
