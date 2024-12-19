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

import { OrderItem, EmptyOrderItem, Order, EmptyOrder, OrderTypeConfig,
         EmptyOrderTypeConfig } from '@app/models';

import { OrderItemsTableEventType } from './order-items-table.component';

import { MessageBoxService } from '@app/shared/services';


export enum OrderItemsEditionEventType {
  ITEMS_UPDATED = 'OrderItemsEditionComponent.Event.ItemsUpdated',
}

@Component({
  selector: 'emp-ng-order-items-edition',
  templateUrl: './order-items-edition.component.html',
})
export class OrderItemsEditionComponent {

  @Input() config: OrderTypeConfig = EmptyOrderTypeConfig;

  @Input() order: Order = EmptyOrder;

  @Input() items: OrderItem[] = [];

  @Input() canEdit = false;

  @Output() orderItemsEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;

  displayItemEditor = false;

  selectedItem = EmptyOrderItem;


  constructor(private ordersData: OrdersDataService,
              private messageBox: MessageBoxService) { }


  onAddItemButtonClicked() {
    this.messageBox.showInDevelopment('Agregar concepto');
  }


  onOrderItemsTableEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as OrderItemsTableEventType) {
      case OrderItemsTableEventType.REMOVE_ITEM_CLICKED:
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        this.messageBox.showInDevelopment('Eliminar concepto');
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
