/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, DateStringLibrary, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyPayableHolder, ObjectTypes, PayableHolder } from '@app/models';

import { PayableEditorEventType } from '../payable/payable-editor.component';

import { BudgetManagementEventType } from '@app/views/budgeting/budgets/budget-management/budget-management.component';

import { PayableItemsEditionEventType } from '../payable-items/payable-items-edition.component';

import { DocumentsEditionEventType } from '@app/views/entity-records/documents-edition/documents-edition.component';


export enum PayableTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'PayableTabbedViewComponent.Event.CloseButtonClicked',
  DATA_UPDATED         = 'PayableTabbedViewComponent.Event.DataUpdated',
  DATA_DELETED         = 'PayableTabbedViewComponent.Event.DataDeleted',
  REFRESH_DATA         = 'PayableTabbedViewComponent.Event.RefreshData',
}

@Component({
  selector: 'emp-pmt-payable-tabbed-view',
  templateUrl: './payable-tabbed-view.component.html',
})
export class PayableTabbedViewComponent implements OnChanges{

  @Input() data: PayableHolder = EmptyPayableHolder;

  @Output() payableTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;

  ObjectTypes = ObjectTypes;


  ngOnChanges() {
    this.setTitle();
  }


  onCloseButtonClicked() {
    sendEvent(this.payableTabbedViewEvent, PayableTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onPayableEditorEvent(event: EventInfo) {
    switch (event.type as PayableEditorEventType) {
      case PayableEditorEventType.UPDATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        sendEvent(this.payableTabbedViewEvent, PayableTabbedViewEventType.DATA_UPDATED, event.payload);
        return;
      case PayableEditorEventType.DELETED:
        Assertion.assertValue(event.payload.dataUID, 'event.payload.dataUID');
        sendEvent(this.payableTabbedViewEvent, PayableTabbedViewEventType.DATA_DELETED, event.payload);
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
        sendEvent(this.payableTabbedViewEvent,
          PayableTabbedViewEventType.REFRESH_DATA, { dataUID: event.payload.baseObjectUID });
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
        sendEvent(this.payableTabbedViewEvent, PayableTabbedViewEventType.DATA_UPDATED, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onDocumentsEditionEvent(event: EventInfo) {
    switch (event.type as DocumentsEditionEventType) {
      case DocumentsEditionEventType.DOCUMENTS_UPDATED:
        const payload = { dataUID: this.data.payable.uid };
        sendEvent(this.payableTabbedViewEvent, PayableTabbedViewEventType.REFRESH_DATA, payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    const dueTime = !this.data.payable.dueTime ?
      'N/D' : DateStringLibrary.format(this.data.payable.dueTime);

    const status = this.data.payable.status.name === 'Eliminada' ?
      `<span class="tag tag-error tag-small">${this.data.payable.status.name}</span>` :
      `<span class="tag tag-small">${this.data.payable.status.name}</span>`;

    this.title = `${this.data.payable.payableNo}: ${this.data.payable.payableType.name}` + status;

    this.hint = `<strong>${this.data.payable.payTo.name} </strong> &nbsp; &nbsp; | &nbsp; &nbsp;` +
      `${this.data.payableEntity.entityNo}</strong> &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${this.data.payable.payTo.name} &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${dueTime}`;
  }

}
