/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { DateStringLibrary, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { BillData, EmptyBillData } from '@app/models';

import { DocumentsEditionEventType } from '@app/views/documents/documents-edition/documents-edition.component';

export enum BillTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'BillTabbedViewComponent.Event.CloseButtonClicked',
  REFRESH_DATA         = 'BillTabbedViewComponent.Event.RefreshData',
}

@Component({
  selector: 'emp-ng-bill-tabbed-view',
  templateUrl: './bill-tabbed-view.component.html',
})
export class BillTabbedViewComponent implements OnChanges {

  @Input() data: BillData = EmptyBillData;

  @Output() billTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 2;


  ngOnChanges() {
    this.setTitle();
  }


  onCloseButtonClicked() {
    sendEvent(this.billTabbedViewEvent, BillTabbedViewEventType.CLOSE_BUTTON_CLICKED);
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
