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

import { MessageBoxService } from '@app/shared/services';

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


  constructor(private orderData: OrdersDataService,
              private messageBox: MessageBoxService) { }


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
        this.messageBox.showInDevelopment(`Agregar ${this.config.orderNameSingular}`,
          event.payload.dataFields as OrderFields);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
