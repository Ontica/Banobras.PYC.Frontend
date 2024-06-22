/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { RequestsDataService } from '@app/data-services';

import { EmptyRequest, EmptyRequestActions, Request, RequestActions, RequestsList } from '@app/models';

import { RequestHeaderEventType } from './request-header.component';


export enum RequestEditorEventType {
  REQUEST_UPDATED = 'RequestEditorComponent.Event.RequestUpdated',
  REQUEST_DELETED = 'RequestEditorComponent.Event.RequestDeleted',
}

@Component({
  selector: 'emp-pyc-request-editor',
  templateUrl: './request-editor.component.html',
})
export class RequestEditorComponent {

  @Input() requestsList: RequestsList = RequestsList.budgeting;

  @Input() request: Request = EmptyRequest;

  @Input() actions: RequestActions = EmptyRequestActions;

  @Output() requestEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private requestData: RequestsDataService,
              private messageBox: MessageBoxService) { }


  get isSaved(): boolean {
    return !isEmpty(this.request);
  }


  onRequestHeaderEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as RequestHeaderEventType) {
      case RequestHeaderEventType.START_REQUEST:
        this.messageBox.showInDevelopment('Iniciar proceso');
        return;

      case RequestHeaderEventType.SUSPEND_REQUEST:
        this.messageBox.showInDevelopment('Suspender solicitud');
        return;

      case RequestHeaderEventType.ACTIVATE_REQUEST:
        this.messageBox.showInDevelopment('Reactivar solicitud');
        return;

      case RequestHeaderEventType.DELETE_REQUEST:
        this.deleteRequest();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private deleteRequest() {
    this.submitted = true;

    this.requestData.deleteRequest(this.request.uid)
      .firstValue()
      .then(x => this.resolveDeleteRequest(this.request.uid))
      .finally(() => this.submitted = false);
  }


  private resolveDeleteRequest(requestUID: string) {
    const payload = { requestUID };
    sendEvent(this.requestEditorEvent, RequestEditorEventType.REQUEST_DELETED, payload);
  }

}
