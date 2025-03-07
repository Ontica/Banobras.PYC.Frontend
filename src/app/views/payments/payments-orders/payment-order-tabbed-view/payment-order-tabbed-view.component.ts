/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, DateStringLibrary, EventInfo } from '@app/core';

import { FormatLibrary, sendEvent } from '@app/shared/utils';

import { EmptyPaymentOrderHolder, PaymentOrderHolder } from '@app/models';

import { PaymentOrderEditorEventType } from '../payment-order/payment-order-editor.component';

import {
  DocumentsEditionEventType
} from '@app/views/documents/documents-edition/documents-edition.component';


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
export class PaymentOrderTabbedViewComponent implements OnChanges {

  @Input() data: PaymentOrderHolder = EmptyPaymentOrderHolder;

  @Output() paymentOrderTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;


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
        sendEvent(this.paymentOrderTabbedViewEvent,
          PaymentOrderTabbedViewEventType.DATA_UPDATED, event.payload);
        return;
      case PaymentOrderEditorEventType.DELETED:
        Assertion.assertValue(event.payload.paymentOrderUID, 'event.payload.paymentOrderUID');
        sendEvent(this.paymentOrderTabbedViewEvent,
          PaymentOrderTabbedViewEventType.DATA_DELETED, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onDocumentsEditionEvent(event: EventInfo) {
    switch (event.type as DocumentsEditionEventType) {
      case DocumentsEditionEventType.DOCUMENTS_UPDATED:
        const payload = { paymentOrderUID: this.data.paymentOrder.uid };
        sendEvent(this.paymentOrderTabbedViewEvent, PaymentOrderTabbedViewEventType.REFRESH_DATA, payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    const requestedDate = !this.data.paymentOrder.requestedDate ? 'N/D' :
      DateStringLibrary.format(this.data.paymentOrder.requestedDate);

    const status = this.data.paymentOrder.status.name === 'Eliminada' ?
      `<span class="tag tag-error tag-small">${this.data.paymentOrder.status.name}</span>` :
      `<span class="tag tag-small">${this.data.paymentOrder.status.name}</span>`;

    const total = !this.data.paymentOrder.total ? 'N/D' :
      FormatLibrary.numberWithCommas(this.data.paymentOrder.total, '1.2-2');

    this.title = `${this.data.paymentOrder.orderNo}: ${this.data.paymentOrder.paymentOrderType?.name} ${status}`;

    this.hint = `<strong>${this.data.paymentOrder.payTo.name} &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${total}</strong> &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${requestedDate}`;
  }

}
