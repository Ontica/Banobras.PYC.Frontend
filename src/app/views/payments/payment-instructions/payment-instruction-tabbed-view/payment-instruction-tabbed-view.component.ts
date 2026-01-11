/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, DateStringLibrary, EventInfo } from '@app/core';

import { FormatLibrary, sendEvent } from '@app/shared/utils';

import { EmptyPaymentInstructionHolder, PaymentInstructionHolder } from '@app/models';

import { PaymentInstructionEditorEventType } from '../payment-instruction/payment-instruction-editor.component';

import { DocumentsEditionEventType } from '@app/views/entity-records/documents-edition/documents-edition.component';


export enum PaymentInstructionTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'PaymentInstructionTabbedViewComponent.Event.CloseButtonClicked',
  DATA_UPDATED         = 'PaymentInstructionTabbedViewComponent.Event.DataUpdated',
  DATA_DELETED         = 'PaymentInstructionTabbedViewComponent.Event.DataDeleted',
  REFRESH_DATA         = 'PaymentInstructionTabbedViewComponent.Event.RefreshData',
}

@Component({
  selector: 'emp-pmt-payment-instruction-tabbed-view',
  templateUrl: './payment-instruction-tabbed-view.component.html',
})
export class PaymentInstructionTabbedViewComponent implements OnChanges {

  @Input() data: PaymentInstructionHolder = EmptyPaymentInstructionHolder;

  @Output() paymentInstructionTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;


  ngOnChanges() {
    this.setTitle();
  }


  onCloseButtonClicked() {
    sendEvent(this.paymentInstructionTabbedViewEvent, PaymentInstructionTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onPaymentInstructionEditorEvent(event: EventInfo) {
    switch (event.type as PaymentInstructionEditorEventType) {
      case PaymentInstructionEditorEventType.UPDATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        sendEvent(this.paymentInstructionTabbedViewEvent,
          PaymentInstructionTabbedViewEventType.DATA_UPDATED, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onDocumentsEditionEvent(event: EventInfo) {
    switch (event.type as DocumentsEditionEventType) {
      case DocumentsEditionEventType.DOCUMENTS_UPDATED:
        const payload = { dataUID: this.data.paymentInstruction.uid };
        sendEvent(this.paymentInstructionTabbedViewEvent, PaymentInstructionTabbedViewEventType.REFRESH_DATA, payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    const instruction = this.data.paymentInstruction;

    const requestedDate = !instruction.requestedTime ? 'N/D' :
      DateStringLibrary.format(instruction.requestedTime, 'DMY HH:mm');

    const status = instruction.status.name === 'Eliminada' ?
      `<span class="tag tag-error tag-small">${instruction.status.name}</span>` :
      `<span class="tag tag-small">${instruction.status.name}</span>`;

    const total = !instruction.total ? 'N/D' :
      FormatLibrary.numberWithCommas(instruction.total, '1.2-2');

    this.title = `${instruction.paymentInstructionNo}: ${instruction.paymentOrderType.name} ${status}`;

    this.hint = `<strong>${instruction.payTo.name}</strong> &nbsp; &nbsp; | &nbsp; &nbsp;` +
      `${total} &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${requestedDate}`;
  }

}
