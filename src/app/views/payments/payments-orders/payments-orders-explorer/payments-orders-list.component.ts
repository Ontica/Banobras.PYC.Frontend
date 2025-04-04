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

import { PaymentOrderDescriptor, PaymentsOrdersOperationsList } from '@app/models';

import { ListControlsEventType } from '@app/views/_reports-controls/explorer/list-controls.component';

import { PaymentsOrdersListItemEventType } from './payments-orders-list-item.component';


export enum PaymentsOrdersListEventType {
  SELECT_ITEM       = 'PaymentsOrdersListComponent.Event.SelectItem',
  EXECUTE_OPERATION = 'PaymentsOrdersListComponent.Event.ExecuteOperation',
}

@Component({
  selector: 'emp-pmt-payments-orders-list',
  templateUrl: './payments-orders-list.component.html',
})
export class PaymentsOrdersListComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() dataList: PaymentOrderDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() queryExecuted = false;

  @Output() paymentsOrdersListEvent = new EventEmitter<EventInfo>();

  selection = new SelectionModel<PaymentOrderDescriptor>(true, []);

  operationsList = PaymentsOrdersOperationsList;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.scrollToTop();
      this.selection.clear();
    }
  }


  onListControlsEvent(event: EventInfo) {
    switch (event.type as ListControlsEventType) {
      case ListControlsEventType.EXECUTE_OPERATION_CLICKED:
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
