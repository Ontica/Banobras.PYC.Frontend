/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { OrdersDataService } from '@app/data-services';

import { EmptyOrderTypeConfig, OrderFields, OrderTypeConfig } from '@app/models';

import { OrderHeaderEventType } from './order-header.component';


export enum OrderCreatorEventType {
  CLOSE_MODAL_CLICKED = 'OrderCreatorComponent.Event.CloseModalClicked',
  CREATED             = 'OrderCreatorComponent.Event.OrderCreated',
}

@Component({
  selector: 'emp-ng-order-creator',
  templateUrl: './order-creator.component.html',
})
export class OrderCreatorComponent {

  @Input() config: OrderTypeConfig = EmptyOrderTypeConfig;

  @Output() orderCreatorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private orderData: OrdersDataService) { }


  onCloseModalClicked() {
    sendEvent(this.orderCreatorEvent, OrderCreatorEventType.CLOSE_MODAL_CLICKED);
  }


  onOrderHeaderEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as OrderHeaderEventType) {
      case OrderHeaderEventType.CREATE:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.createOrder(event.payload.dataFields as OrderFields);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private createOrder(dataFields: OrderFields) {
    this.submitted = true;

    this.orderData.createOrder(dataFields)
      .firstValue()
      .then(x => sendEvent(this.orderCreatorEvent, OrderCreatorEventType.CREATED, { data: x }))
      .finally(() => this.submitted = false);
  }

}
