/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { SelectionModel } from '@angular/cdk/collections';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { PaymentOrderDescriptor } from '@app/models';

import { PaymentsOrdersListControlsEventType } from './payments-orders-list-controls.component';

import { PaymentsOrdersListItemEventType } from './payments-orders-list-item.component';


export enum PaymentsOrdersListEventType {
  SELECT_ITEM       = 'PaymentsOrdersListComponent.Event.SelectItem',
  EXECUTE_OPERATION = 'PaymentsOrdersListComponent.Event.ExecuteOperation',
}

@Component({
  selector: 'emp-payments-orders-list',
  templateUrl: './payments-orders-list.component.html',
})
export class PaymentsOrdersListComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() paymentsOrdersList: PaymentOrderDescriptor[] = [];

  @Input() selectedPaymentOrderUID = '';

  @Input() queryExecuted = false;

  @Output() paymentsOrdersListEvent = new EventEmitter<EventInfo>();

  selection = new SelectionModel<PaymentOrderDescriptor>(true, []);


  ngOnChanges(changes: SimpleChanges) {
    if (changes.paymentsOrdersList) {
      this.scrollToTop();
      this.selection.clear();
    }
  }


  onPaymentsOrdersListControlsEvent(event: EventInfo) {
    switch (event.type as PaymentsOrdersListControlsEventType) {
      case PaymentsOrdersListControlsEventType.EXECUTE_OPERATION_CLICKED:
        sendEvent(this.paymentsOrdersListEvent, PaymentsOrdersListEventType.EXECUTE_OPERATION, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onPaymentsOrdersListItemEvent(event: EventInfo) {
    switch (event.type as PaymentsOrdersListItemEventType) {
      case PaymentsOrdersListItemEventType.ITEM_CLICKED:
        sendEvent(this.paymentsOrdersListEvent, PaymentsOrdersListEventType.SELECT_ITEM,
          event.payload);
        return;

      case PaymentsOrdersListItemEventType.CHECK_CLICKED:
        Assertion.assertValue(event.payload.item, 'event.payload.item');
        this.selection.toggle(event.payload.item);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(0);
    }
  }

}
