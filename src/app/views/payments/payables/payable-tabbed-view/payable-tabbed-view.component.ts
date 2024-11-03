/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, DateStringLibrary, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyPayableData, PayableData } from '@app/models';

import { PayableEditorEventType } from '../payable/payable-editor.component';

import { PayableItemsEditionEventType } from '../payable-items/payable-items-edition.component';

import { DocumentsEditionEventType } from '@app/views/documents/documents-edition/documents-edition.component';


export enum PayableTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'PayableTabbedViewComponent.Event.CloseButtonClicked',
  PAYABLE_UPDATED      = 'PayableTabbedViewComponent.Event.PayableUpdated',
  PAYABLE_DELETED      = 'PayableTabbedViewComponent.Event.PayableDeleted',
  DOCUMENTS_UPDATED    = 'PayableTabbedViewComponent.Event.DocumentsUpdated',
}

@Component({
  selector: 'emp-pmt-payable-tabbed-view',
  templateUrl: './payable-tabbed-view.component.html',
})
export class PayableTabbedViewComponent implements OnChanges{

  @Input() payableData: PayableData = EmptyPayableData;

  @Output() payableTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;


  ngOnChanges() {
    this.setTitle();
  }


  onCloseButtonClicked() {
    sendEvent(this.payableTabbedViewEvent, PayableTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onPayableEditorEvent(event: EventInfo) {
    switch (event.type as PayableEditorEventType) {
      case PayableEditorEventType.PAYABLE_UPDATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        sendEvent(this.payableTabbedViewEvent, PayableTabbedViewEventType.PAYABLE_UPDATED, event.payload);
        return;
      case PayableEditorEventType.PAYABLE_DELETED:
        Assertion.assertValue(event.payload.payableUID, 'event.payload.payableUID');
        sendEvent(this.payableTabbedViewEvent, PayableTabbedViewEventType.PAYABLE_DELETED, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onPayableItemsEditionEvent(event: EventInfo) {
    switch (event.type as PayableItemsEditionEventType) {
      case PayableItemsEditionEventType.ITEMS_UPDATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        sendEvent(this.payableTabbedViewEvent, PayableTabbedViewEventType.PAYABLE_UPDATED, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onDocumentsEditionEvent(event: EventInfo) {
    switch (event.type as DocumentsEditionEventType) {
      case DocumentsEditionEventType.DOCUMENTS_UPDATED:
        const payload = { payableUID: this.payableData.payable.uid };
        sendEvent(this.payableTabbedViewEvent, PayableTabbedViewEventType.DOCUMENTS_UPDATED, payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    const dueTime = !this.payableData.payable.dueTime ?
      'N/D' : DateStringLibrary.format(this.payableData.payable.dueTime);

    const status = this.payableData.payable.status.name === 'Eliminada' ?
      `<span class="tag tag-error tag-small">${this.payableData.payable.status.name}</span>` :
      `<span class="tag tag-small">${this.payableData.payable.status.name}</span>`;

    this.title = `${this.payableData.payable.payableNo}: ${this.payableData.payable.payableType.name}` + status;

    this.hint = `<strong>${this.payableData.payable.payTo.name} </strong> &nbsp; &nbsp; | &nbsp; &nbsp;` +
      `${this.payableData.payableEntity.entityNo}</strong> &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${this.payableData.payable.payTo.name} &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${dueTime}`;
  }

}
