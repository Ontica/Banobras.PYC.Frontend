/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, DateStringLibrary, EventInfo, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { BillHolder, EmptyBillHolder, ObjectTypes } from '@app/models';

import { BillEditorEventType } from '../bill/bill-editor.component';

import {
  DocumentsEditionEventType
} from '@app/views/entity-records/documents-edition/documents-edition.component';

export enum BillTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'BillTabbedViewComponent.Event.CloseButtonClicked',
  REFRESH_DATA         = 'BillTabbedViewComponent.Event.RefreshData',
}

@Component({
  selector: 'emp-ng-bill-tabbed-view',
  templateUrl: './bill-tabbed-view.component.html',
})
export class BillTabbedViewComponent implements OnChanges {

  @Input() data: BillHolder = EmptyBillHolder;

  @Output() billTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;


  ngOnChanges() {
    this.setTitle();
  }


  get showPaymentOrder(): boolean {
    return !isEmpty(this.data.paymentOrder)
  }


  get baseObjectType(): ObjectTypes {
    return isEmpty(this.data.baseEntity) ? null : this.data.baseEntity.type.uid as ObjectTypes;
  }


  onCloseButtonClicked() {
    sendEvent(this.billTabbedViewEvent, BillTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onBillEditorEvent(event: EventInfo) {
    switch (event.type as BillEditorEventType) {
      case BillEditorEventType.UPDATED:
      case BillEditorEventType.DELETED:
        Assertion.assertValue(event.payload.billUID, 'event.payload.billUID');
        sendEvent(this.billTabbedViewEvent,
          BillTabbedViewEventType.REFRESH_DATA, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onDocumentsEditionEvent(event: EventInfo) {
    switch (event.type as DocumentsEditionEventType) {
      case DocumentsEditionEventType.DOCUMENTS_UPDATED:
        const payload = { billUID: this.data.bill.uid };
        sendEvent(this.billTabbedViewEvent, BillTabbedViewEventType.REFRESH_DATA, payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    const issueDate = !this.data.bill.issueDate ?
      'N/D' : DateStringLibrary.format(this.data.bill.issueDate);

    const status = this.data.bill.status.name === 'Eliminada' ?
      `<span class="tag tag-error tag-small">${this.data.bill.status.name}</span>` :
      `<span class="tag tag-small">${this.data.bill.status.name}</span>`;

    this.title = `${this.data.bill.billNo}` + status;

    this.hint = `<strong>${this.data.bill.billType?.name} </strong> &nbsp; &nbsp; | &nbsp; &nbsp;` +
      `Emisor: ${this.data.bill.issuedBy.name} &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${issueDate}`;
  }

}
