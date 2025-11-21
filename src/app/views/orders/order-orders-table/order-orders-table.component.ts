/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { OrderDescriptor } from '@app/models';

export enum OrderOrdersTableEventType {
  SELECT_CLICKED = 'OrderOrdersTableComponent.Event.SelectClicked',
  REMOVE_CLICKED = 'OrderOrdersTableComponent.Event.RemoveClicked',
}

@Component({
  selector: 'emp-ng-order-orders-table',
  templateUrl: './order-orders-table.component.html',
})
export class OrderOrdersTableComponent implements OnChanges {

  @Input() orders: OrderDescriptor[] = [];

  @Input() ordersName = 'Orden';

  @Output() orderOrdersTableEvent = new EventEmitter<EventInfo>();

  displayedColumns: string[] = ['typeName', 'categoryName', 'orderNo', 'name',
                                'baseBudgetName', 'total', 'period'];

  dataSource: MatTableDataSource<OrderDescriptor>;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.orders) {
      this.setDataTable();
    }
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.orders);
  }

}
