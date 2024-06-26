/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, DateStringLibrary, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyRequestData, RequestData, RequestsList } from '@app/models';

import { RequestEditorEventType } from '../request/request-editor.component';

export enum RequestTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'RequestTabbedViewComponent.Event.CloseButtonClicked',
  REQUEST_UPDATED      = 'RequestTabbedViewComponent.Event.RequestUpdated',
  REQUEST_DELETED      = 'RequestTabbedViewComponent.Event.RequestDeleted',
}

@Component({
  selector: 'emp-pyc-request-tabbed-view',
  templateUrl: './request-tabbed-view.component.html',
})
export class RequestTabbedViewComponent implements OnChanges {

  @Input() requestsList: RequestsList = RequestsList.budgeting;

  @Input() requestData: RequestData = EmptyRequestData;

  @Output() requestTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 1;


  ngOnChanges() {
    this.setTitle();
    this.validateSelectedTab();
  }


  onCloseButtonClicked() {
    sendEvent(this.requestTabbedViewEvent, RequestTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onRequestEditorEvent(event: EventInfo) {
    switch (event.type as RequestEditorEventType) {
      case RequestEditorEventType.REQUEST_UPDATED:
        Assertion.assertValue(event.payload.request, 'event.payload.request');
        sendEvent(this.requestTabbedViewEvent, RequestTabbedViewEventType.REQUEST_UPDATED, event.payload);
        return;

      case RequestEditorEventType.REQUEST_DELETED:
        Assertion.assertValue(event.payload.requestUID, 'event.payload.requestUID');
        sendEvent(this.requestTabbedViewEvent, RequestTabbedViewEventType.REQUEST_DELETED, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    const postingTime = !this.requestData.request.filingTime ?
      'N/D' : DateStringLibrary.format(this.requestData.request.filingTime);

    const status = this.requestData.request.status === 'Eliminada' ?
      `<span class="tag tag-error tag-small">${this.requestData.request.status}</span>` :
      `<span class="tag tag-small">${this.requestData.request.status}</span>`;

    this.title = `${this.requestData.request.uniqueID}: ${this.requestData.request.requestType.name}` + status;

    this.hint = `<strong>${this.requestData.request.requesterOrgUnit.name} </strong>` +
      ` &nbsp; &nbsp; | &nbsp; &nbsp; ${postingTime}`;
  }


  private validateSelectedTab() {
    if (this.selectedTabIndex === 1 && this.requestData.tasks.length === 0) {
      this.selectedTabIndex = 0;
    }

    if (this.selectedTabIndex === 0 && this.requestData.tasks.length > 0) {
      this.selectedTabIndex = 1;
    }
  }

}
