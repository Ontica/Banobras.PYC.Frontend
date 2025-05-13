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

import { RequestStepsEditionEventType } from '../request-steps/request-steps-edition.component';

import { DocumentsEditionEventType } from '@app/views/entity-records/documents-edition/documents-edition.component';


export enum RequestTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'RequestTabbedViewComponent.Event.CloseButtonClicked',
  DATA_UPDATED         = 'RequestTabbedViewComponent.Event.DataUpdated',
  DATA_DELETED         = 'RequestTabbedViewComponent.Event.DataDeleted',
  REFRESH_DATA         = 'RequestTabbedViewComponent.Event.RefreshData',
}

@Component({
  selector: 'emp-pyc-request-tabbed-view',
  templateUrl: './request-tabbed-view.component.html',
})
export class RequestTabbedViewComponent implements OnChanges {

  @Input() requestsList: RequestsList = RequestsList.budgeting;

  @Input() data: RequestData = EmptyRequestData;

  @Output() requestTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 1;


  ngOnChanges() {
    this.setTitle();
  }


  onCloseButtonClicked() {
    sendEvent(this.requestTabbedViewEvent, RequestTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onRequestEditorEvent(event: EventInfo) {
    switch (event.type as RequestEditorEventType) {
      case RequestEditorEventType.REQUEST_UPDATED:
        Assertion.assertValue(event.payload.requestUID, 'event.payload.requestUID');
        sendEvent(this.requestTabbedViewEvent, RequestTabbedViewEventType.DATA_UPDATED, event.payload);
        return;
      case RequestEditorEventType.REQUEST_DELETED:
        Assertion.assertValue(event.payload.requestUID, 'event.payload.requestUID');
        sendEvent(this.requestTabbedViewEvent, RequestTabbedViewEventType.DATA_DELETED, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onRequestStepsEditionEvent(event: EventInfo) {
    switch (event.type as RequestStepsEditionEventType) {
      case RequestStepsEditionEventType.REQUEST_UPDATED:
        Assertion.assertValue(event.payload.requestUID, 'event.payload.requestUID');
        sendEvent(this.requestTabbedViewEvent, RequestTabbedViewEventType.DATA_UPDATED, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onDocumentsEditionEvent(event: EventInfo) {
    switch (event.type as DocumentsEditionEventType) {
      case DocumentsEditionEventType.DOCUMENTS_UPDATED:
        const payload = { requestUID: this.data.request.uid };
        sendEvent(this.requestTabbedViewEvent, RequestTabbedViewEventType.REFRESH_DATA, payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    const startTime = !this.data.request.startTime ?
      'N/D' : DateStringLibrary.format(this.data.request.startTime);

    const status = this.data.request.status === 'Eliminada' ?
      `<span class="tag tag-error tag-small">${this.data.request.status}</span>` :
      `<span class="tag tag-small">${this.data.request.status}</span>`;

    this.title = `${this.data.request.requestNo}: ${this.data.request.name}` + status;

    this.hint = `<strong>${this.data.request.requestedByOrgUnit.name} </strong>` +
      ` &nbsp; &nbsp; | &nbsp; &nbsp; ${startTime}`;
  }

}
