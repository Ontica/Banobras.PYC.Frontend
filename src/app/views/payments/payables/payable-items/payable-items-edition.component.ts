/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { SkipIf } from '@app/shared/decorators';

import { MessageBoxService } from '@app/shared/services';

import { EmptyPayableActions, PayableActions, PayableItem } from '@app/models';

import { PayableItemsTableEventType } from './payable-items-table.component';


export enum PayableItemsEditionEventType {
  ITEMS_UPDATED = 'PayableItemsEditionComponent.Event.ItemsUpdated',
}

@Component({
  selector: 'emp-pmt-payable-items-edition',
  templateUrl: './payable-items-edition.component.html',
})
export class PayableItemsEditionComponent {

  @Input() items: PayableItem[] = [];

  @Input() actions: PayableActions = EmptyPayableActions;

  @Output() payableItemsEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private messageBox: MessageBoxService) { }


  @SkipIf('submitted')
  onPayableItemsTableEvent(event: EventInfo) {
    switch (event.type as PayableItemsTableEventType) {
      case PayableItemsTableEventType.SELECT_ITEM_CLICKED:
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        return;
      case PayableItemsTableEventType.REMOVE_ITEM_CLICKED:
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        this.messageBox.showInDevelopment('Eliminar movimiento', event.payload.item);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
