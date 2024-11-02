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

export enum BillTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'BillTabbedViewComponent.Event.CloseButtonClicked',
}

@Component({
  selector: 'emp-ng-bill-tabbed-view',
  templateUrl: './bill-tabbed-view.component.html',
})
export class BillTabbedViewComponent implements OnChanges {

  @Input() billData: BillData = EmptyBillData;

  @Output() billTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;


  ngOnChanges() {
    this.setTitle();
  }


  onCloseButtonClicked() {
    sendEvent(this.billTabbedViewEvent, BillTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  private setTitle() {
    const issueDate = !this.billData.bill.issueDate ?
      'N/D' : DateStringLibrary.format(this.billData.bill.issueDate);

    const status = this.billData.bill.status.name === 'Eliminada' ?
      `<span class="tag tag-error tag-small">${this.billData.bill.status.name}</span>` :
      `<span class="tag tag-small">${this.billData.bill.status.name}</span>`;

    this.title = `${this.billData.bill.billNo}` + status;

    this.hint = `<strong>${this.billData.bill.billType?.name} </strong> &nbsp; &nbsp; | &nbsp; &nbsp;` +
      `Emisor: ${this.billData.bill.issuedBy.name} &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${issueDate}`;
  }

}
