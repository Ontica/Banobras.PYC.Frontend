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

import { OrderActions, Order, OrderFields, EmptyOrderActions, EmptyOrder, OrderExplorerTypeConfig,
         EmptyOrderExplorerTypeConfig, OrderHolder, ObjectTypes } from '@app/models';

import { OrderHeaderEventType } from './order-header.component';


export enum OrderEditorEventType {
  UPDATED = 'OrderEditorComponent.Event.OrderUpdated',
  DELETED = 'OrderEditorComponent.Event.OrderDeleted',
}

@Component({
  selector: 'emp-ng-order-editor',
  templateUrl: './order-editor.component.html',
})
export class OrderEditorComponent {

  @Input() config: OrderExplorerTypeConfig<ObjectTypes> = EmptyOrderExplorerTypeConfig;

  @Input() order: Order = EmptyOrder;

  @Input() actions: OrderActions = EmptyOrderActions;

  @Output() orderEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private orderData: OrdersDataService) { }


  get isSaved(): boolean {
    return !isEmpty(this.order);
  }


  onOrderHeaderEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as OrderHeaderEventType) {
      case OrderHeaderEventType.UPDATE:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.updateOrder(event.payload.dataFields as OrderFields);
        return;
      case OrderHeaderEventType.DELETE:
        this.deleteOrder();
        return;
      case OrderHeaderEventType.SUSPEND:
        this.suspendOrder();
        return;
      case OrderHeaderEventType.ACTIVATE:
        this.activateOrder();
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private updateOrder(orderFields: OrderFields) {
    this.submitted = true;

    this.orderData.updateOrder(this.order.uid, orderFields)
      .firstValue()
      .then(x => this.resolveOrderUpdated(x))
      .finally(() => this.submitted = false);
  }


  private deleteOrder() {
    this.submitted = true;

    this.orderData.deleteOrder(this.order.uid)
      .firstValue()
      .then(() => this.resolveOrderDeleted(this.order.uid))
      .finally(() => this.submitted = false);
  }


  private suspendOrder() {
    this.submitted = true;

    this.orderData.suspendOrder(this.order.uid)
      .firstValue()
      .then(x => this.resolveOrderUpdated(x))
      .finally(() => this.submitted = false);
  }


  private activateOrder() {
    this.submitted = true;

    this.orderData.activateOrder(this.order.uid)
      .firstValue()
      .then(x => this.resolveOrderUpdated(x))
      .finally(() => this.submitted = false);
  }


  private resolveOrderUpdated(data: OrderHolder) {
    const payload = { data };
    sendEvent(this.orderEditorEvent, OrderEditorEventType.UPDATED, payload);
  }


  private resolveOrderDeleted(orderUID: string) {
    const payload = { orderUID };
    sendEvent(this.orderEditorEvent, OrderEditorEventType.DELETED, payload);
  }

}
