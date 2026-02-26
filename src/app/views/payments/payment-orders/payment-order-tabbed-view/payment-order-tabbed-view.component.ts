/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, DateStringLibrary, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyPaymentOrderHolder, ObjectTypes, PaymentOrderHolder } from '@app/models';

import { BudgetManagementEventType } from '@app/views/budgeting/budget-management/budget-management.component';

import { DocumentsEditionEventType } from '@app/views/entity-records/documents-edition/documents-edition.component';

import { PaymentOrderEditorEventType } from '../payment-order/payment-order-editor.component';

import { PaymentOrderItemsEditionEventType } from '../payment-order-items/payment-order-items-edition.component';

import { PaymentOrdersEditionEventType } from '../../payment-orders-edition/payment-orders-edition.component';


export enum PaymentOrderTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'PaymentOrderTabbedViewComponent.Event.CloseButtonClicked',
  DATA_UPDATED         = 'PaymentOrderTabbedViewComponent.Event.DataUpdated',
  DATA_DELETED         = 'PaymentOrderTabbedViewComponent.Event.DataDeleted',
  REFRESH_DATA         = 'PaymentOrderTabbedViewComponent.Event.RefreshData',
}

@Component({
  selector: 'emp-pmt-payment-order-tabbed-view',
  templateUrl: './payment-order-tabbed-view.component.html',
})
export class PaymentOrderTabbedViewComponent implements OnChanges{

  @Input() data: PaymentOrderHolder = EmptyPaymentOrderHolder;

  @Output() paymentOrderTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;

  ObjectTypes = ObjectTypes;


  ngOnChanges() {
    this.setTitle();
  }


  onCloseButtonClicked() {
    sendEvent(this.paymentOrderTabbedViewEvent, PaymentOrderTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onPaymentOrderEditorEvent(event: EventInfo) {
    switch (event.type as PaymentOrderEditorEventType) {
      case PaymentOrderEditorEventType.UPDATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        sendEvent(this.paymentOrderTabbedViewEvent, PaymentOrderTabbedViewEventType.DATA_UPDATED, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onBudgetManagementEvent(event: EventInfo) {
    switch (event.type as BudgetManagementEventType) {
      case BudgetManagementEventType.UPDATED:
        Assertion.assertValue(event.payload.baseObjectUID, 'event.payload.baseObjectUID');
        sendEvent(this.paymentOrderTabbedViewEvent,
          PaymentOrderTabbedViewEventType.REFRESH_DATA, { dataUID: event.payload.baseObjectUID });
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onPaymentOrderItemsEditionEvent(event: EventInfo) {
    switch (event.type as PaymentOrderItemsEditionEventType) {
      case PaymentOrderItemsEditionEventType.ITEMS_UPDATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        sendEvent(this.paymentOrderTabbedViewEvent, PaymentOrderTabbedViewEventType.DATA_UPDATED, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onPaymentOrdersEditionEvent(event: EventInfo) {
    switch (event.type as PaymentOrdersEditionEventType) {
      case PaymentOrdersEditionEventType.UPDATED:
        const payload = { dataUID: this.data.paymentOrder.uid };
        sendEvent(this.paymentOrderTabbedViewEvent, PaymentOrderTabbedViewEventType.REFRESH_DATA, payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onDocumentsEditionEvent(event: EventInfo) {
    switch (event.type as DocumentsEditionEventType) {
      case DocumentsEditionEventType.DOCUMENTS_UPDATED:
        const payload = { dataUID: this.data.paymentOrder.uid };
        sendEvent(this.paymentOrderTabbedViewEvent, PaymentOrderTabbedViewEventType.REFRESH_DATA, payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    const payableName = `(${this.data.paymentOrder.paymentOrderNo}) ${this.data.paymentOrder.paymentOrderType.name}`;

    const dueTime = !this.data.paymentOrder.dueTime ?
      'N/D' : DateStringLibrary.format(this.data.paymentOrder.dueTime);

    const status = this.data.paymentOrder.status.name === 'Eliminada' ?
      `<span class="tag tag-error tag-small">${this.data.paymentOrder.status.name}</span>` :
      `<span class="tag tag-small">${this.data.paymentOrder.status.name}</span>`;


    this.title = `${this.data.paymentOrder.paymentOrderNo}: ${this.data.paymentOrder.paymentOrderType.name}` + status;

    this.hint = `<strong>${payableName}</strong> &nbsp; &nbsp; | &nbsp; &nbsp;` +
      `${this.data.paymentOrder.payTo.name} &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${dueTime}`;
  }

}
