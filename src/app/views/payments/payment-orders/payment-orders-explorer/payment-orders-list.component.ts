/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { SelectionModel } from '@angular/cdk/collections';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { PaymentOrderDescriptor, PaymentOrdersOperationsList } from '@app/models';

import { ListControlsEventType } from '@app/views/_reports-controls/explorer/list-controls.component';

import { PaymentOrdersListItemEventType } from './payment-orders-list-item.component';


export enum PaymentOrdersListEventType {
  SELECT_CLICKED            = 'PaymentOrdersListComponent.Event.SelectClicked',
  EXECUTE_OPERATION_CLICKED = 'PaymentOrdersListComponent.Event.ExecuteOperationClicked',
}

@Component({
  selector: 'emp-pmt-payment-orders-list',
  templateUrl: './payment-orders-list.component.html',
})
export class PaymentOrdersListComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() dataList: PaymentOrderDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() queryExecuted = false;

  @Output() paymentOrdersListEvent = new EventEmitter<EventInfo>();

  selection = new SelectionModel<PaymentOrderDescriptor>(true, []);

  operationsList = PaymentOrdersOperationsList;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.scrollToTop();
      this.selection.clear();
    }
  }


  onListControlsEvent(event: EventInfo) {
    switch (event.type as ListControlsEventType) {
      case ListControlsEventType.EXECUTE_OPERATION_CLICKED:
        sendEvent(this.paymentOrdersListEvent, PaymentOrdersListEventType.EXECUTE_OPERATION_CLICKED, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onPaymentOrdersListItemEvent(event: EventInfo) {
    switch (event.type as PaymentOrdersListItemEventType) {
      case PaymentOrdersListItemEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, 'event.payload.item');
        sendEvent(this.paymentOrdersListEvent, PaymentOrdersListEventType.SELECT_CLICKED, event.payload);
        return;
      case PaymentOrdersListItemEventType.CHECK_CLICKED:
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
