/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { OrdersDataService } from '@app/data-services';

import { OrderItem, EmptyOrderItem, OrderItemFields, Order, EmptyOrder, OrderExplorerTypeConfig,
         EmptyOrderExplorerTypeConfig, ObjectTypes } from '@app/models';

import { OrderItemsTableEventType } from './order-items-table.component';

import { OrderItemEditorEventType } from './order-item-editor.component';


export enum OrderItemsEditionEventType {
  ITEMS_UPDATED = 'OrderItemsEditionComponent.Event.ItemsUpdated',
}

@Component({
  selector: 'emp-ng-order-items-edition',
  templateUrl: './order-items-edition.component.html',
})
export class OrderItemsEditionComponent {

  @Input() config: OrderExplorerTypeConfig<ObjectTypes> = EmptyOrderExplorerTypeConfig;

  @Input() order: Order = EmptyOrder;

  @Input() items: OrderItem[] = [];

  @Input() canEdit = false;

  @Output() orderItemsEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;

  displayItemEditor = false;

  selectedItem = EmptyOrderItem;


  constructor(private ordersData: OrdersDataService) { }


  onAddItemButtonClicked() {
    this.setSelectedItem(EmptyOrderItem, true);
  }


  onOrderItemEditorEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as OrderItemEditorEventType) {
      case OrderItemEditorEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedItem(EmptyOrderItem);
        return;
      case OrderItemEditorEventType.ADD_ITEM:
        Assertion.assertValue(event.payload.orderUID, 'event.payload.orderUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.addOrderItem(event.payload.orderUID, event.payload.dataFields);
        return;
      case OrderItemEditorEventType.UPDATE_ITEM:
        Assertion.assertValue(event.payload.orderUID, 'event.payload.orderUID');
        Assertion.assertValue(event.payload.orderItemUID, 'event.payload.orderItemUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.updateOrderItem(event.payload.orderUID, event.payload.orderItemUID,
          event.payload.dataFields);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onOrderItemsTableEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as OrderItemsTableEventType) {
      case OrderItemsTableEventType.SELECT_ITEM_CLICKED:
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        this.setSelectedItem(event.payload.item as OrderItem);
        return;
      case OrderItemsTableEventType.REMOVE_ITEM_CLICKED:
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        this.removeOrderItem(this.order.uid, event.payload.item.uid);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private addOrderItem(orderUID: string, dataFields: OrderItemFields) {
    this.submitted = true;

    this.ordersData.addOrderItem(orderUID, dataFields)
      .firstValue()
      .then(x => this.resolveOrderUpdated())
      .finally(() => this.submitted = false);
  }


  private updateOrderItem(orderUID: string, orderItemUID: string, dataFields: OrderItemFields) {
    this.submitted = true;

    this.ordersData.updateOrderItem(orderUID, orderItemUID, dataFields)
      .firstValue()
      .then(x => this.resolveOrderUpdated())
      .finally(() => this.submitted = false);
  }


  private removeOrderItem(orderUID: string, orderItemUID: string) {
    this.submitted = true;

    this.ordersData.removeOrderItem(orderUID, orderItemUID)
      .firstValue()
      .then(x => this.resolveOrderUpdated())
      .finally(() => this.submitted = false);
  }


  private resolveOrderUpdated() {
    const payload = { orderUID: this.order.uid };
    sendEvent(this.orderItemsEditionEvent, OrderItemsEditionEventType.ITEMS_UPDATED, payload);
    this.setSelectedItem(EmptyOrderItem);
  }


  private setSelectedItem(item: OrderItem, display?: boolean) {
    this.selectedItem = item;
    this.displayItemEditor = display ?? !isEmpty(item);
  }

}
