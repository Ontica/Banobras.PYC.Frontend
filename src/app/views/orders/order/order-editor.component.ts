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

import { MessageBoxService } from '@app/shared/services';

import { OrderActions, Order, OrderFields, EmptyOrderActions, EmptyOrder, OrderTypeConfig,
         EmptyOrderTypeConfig } from '@app/models';

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

  @Input() config: OrderTypeConfig = EmptyOrderTypeConfig;

  @Input() order: Order = EmptyOrder;

  @Input() actions: OrderActions = EmptyOrderActions;

  @Output() orderEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private orderData: OrdersDataService,
              private messageBox: MessageBoxService) { }


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
        this.messageBox.showInDevelopment(`Editar ${this.config.orderNameSingular}`,
          event.payload.dataFields as OrderFields);
        return;
      case OrderHeaderEventType.DELETE:
        this.messageBox.showInDevelopment(`Eliminar ${this.config.orderNameSingular}`, this.order.uid);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
