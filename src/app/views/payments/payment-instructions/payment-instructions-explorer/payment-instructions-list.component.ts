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

import { PaymentInstructionDescriptor, PaymentInstructionsOperationsList } from '@app/models';

import { ListControlsEventType } from '@app/views/_reports-controls/explorer/list-controls.component';

import { PaymentInstructionsListItemEventType } from './payment-instructions-list-item.component';


export enum PaymentInstructionsListEventType {
  SELECT_ITEM       = 'PaymentInstructionsListComponent.Event.SelectItem',
  EXECUTE_OPERATION = 'PaymentInstructionsListComponent.Event.ExecuteOperation',
}

@Component({
  selector: 'emp-pmt-payment-instructions-list',
  templateUrl: './payment-instructions-list.component.html',
})
export class PaymentInstructionsListComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() dataList: PaymentInstructionDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() queryExecuted = false;

  @Output() paymentInstructionsListEvent = new EventEmitter<EventInfo>();

  selection = new SelectionModel<PaymentInstructionDescriptor>(true, []);

  operationsList = PaymentInstructionsOperationsList;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.scrollToTop();
      this.selection.clear();
    }
  }


  onListControlsEvent(event: EventInfo) {
    switch (event.type as ListControlsEventType) {
      case ListControlsEventType.EXECUTE_OPERATION_CLICKED:
        sendEvent(this.paymentInstructionsListEvent, PaymentInstructionsListEventType.EXECUTE_OPERATION, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onPaymentInstructionsListItemEvent(event: EventInfo) {
    switch (event.type as PaymentInstructionsListItemEventType) {
      case PaymentInstructionsListItemEventType.ITEM_CLICKED:
        sendEvent(this.paymentInstructionsListEvent, PaymentInstructionsListEventType.SELECT_ITEM,
          event.payload);
        return;

      case PaymentInstructionsListItemEventType.CHECK_CLICKED:
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
