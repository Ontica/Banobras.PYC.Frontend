/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyOrdersQuery, EmptyOrderTypeConfig, OrderDescriptor, OrdersQuery,
         OrderTypeConfig } from '@app/models';

import { OrdersFilterEventType } from './orders-filter.component';

import { OrdersDataEventType } from './orders-data.component';

export enum OrdersExplorerEventType {
  CREATE_CLICKED            = 'OrdersExplorerComponent.Event.CreateClicked',
  SEARCH_CLICKED            = 'OrdersExplorerComponent.Event.SearchClicked',
  CLEAR_CLICKED             = 'OrdersExplorerComponent.Event.ClearClicked',
  EXECUTE_OPERATION_CLICKED = 'OrdersExplorerComponent.Event.ExecuteOperationClicked',
  SELECT_CLICKED            = 'OrdersExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-ng-orders-explorer',
  templateUrl: './orders-explorer.component.html',
})
export class OrdersExplorerComponent implements OnChanges {

  @Input() config: OrderTypeConfig = EmptyOrderTypeConfig;

  @Input() query: OrdersQuery = Object.assign({}, EmptyOrdersQuery);

  @Input() dataList: OrderDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() ordersExplorerEvent = new EventEmitter<EventInfo>();

  cardHint = 'Seleccionar los filtros';

  showFilters = false;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.setText();
      this.showFilters = false;
    }
  }


  onCreateOrderClicked() {
    sendEvent(this.ordersExplorerEvent, OrdersExplorerEventType.CREATE_CLICKED);
  }


  onOrdersFilterEvent(event: EventInfo) {
    switch (event.type as OrdersFilterEventType) {
      case OrdersFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.ordersExplorerEvent, OrdersExplorerEventType.SEARCH_CLICKED,
          event.payload);
        return;
      case OrdersFilterEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.ordersExplorerEvent, OrdersExplorerEventType.CLEAR_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onOrdersDataEvent(event: EventInfo) {
    switch (event.type as OrdersDataEventType) {
      case OrdersDataEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        sendEvent(this.ordersExplorerEvent, OrdersExplorerEventType.EXECUTE_OPERATION_CLICKED,
          event.payload);
        return;
      case OrdersDataEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, 'event.payload.item');
        sendEvent(this.ordersExplorerEvent, OrdersExplorerEventType.SELECT_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setText() {
    if (!this.queryExecuted) {
      this.cardHint = 'Seleccionar los filtros';
      return;
    }

    this.cardHint = `${this.dataList.length} registros encontrados`;
  }

}
