/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { SkipIf } from '@app/shared/decorators';

import { RequestsDataService } from '@app/data-services';

import { EmptyRequest, Request, RequestFields, RequestsList } from '@app/models';

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

  @Output() requestEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private requestData: RequestsDataService) { }


  get isSaved(): boolean {
    return !isEmpty(this.request);
  }


  @SkipIf('submitted')
  onRequestHeaderEvent(event: EventInfo) {
    switch (event.type as RequestHeaderEventType) {
      case RequestHeaderEventType.UPDATE_REQUEST:
        Assertion.assertValue(event.payload.requestFields, 'event.payload.requestFields');
        this.updateRequest(event.payload.requestFields as RequestFields);
        return;
      case RequestHeaderEventType.DELETE_REQUEST:
        this.deleteRequest();
        return;
      case RequestHeaderEventType.SUSPEND_REQUEST:
        this.suspendRequest();
        return;
      case RequestHeaderEventType.CANCEL_REQUEST:
        this.cancelRequest();
        return;
      case RequestHeaderEventType.START_REQUEST:
        this.startRequest();
        return;
      case RequestHeaderEventType.ACTIVATE_REQUEST:
        this.activateRequest();
        return;
      case RequestHeaderEventType.CLOSE_REQUEST:
        this.closeRequest();
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private updateRequest(requestFields: RequestFields) {
    this.submitted = true;

    this.requestData.updateRequest(this.request.uid, requestFields)
      .firstValue()
      .then(x => this.resolveRequestUpdated(x.request.uid))
      .finally(() => this.submitted = false);
  }


  private deleteRequest() {
    this.submitted = true;

    this.requestData.deleteRequest(this.request.uid)
      .firstValue()
      .then(x => this.resolveRequestDeleted(this.request.uid))
      .finally(() => this.submitted = false);
  }


  private suspendRequest() {
    this.submitted = true;

    this.requestData.suspendRequest(this.request.uid)
      .firstValue()
      .then(x => this.resolveRequestUpdated(x.request.uid))
      .finally(() => this.submitted = false);
  }


  private cancelRequest() {
    this.submitted = true;

    this.requestData.cancelRequest(this.request.uid)
      .firstValue()
      .then(x => this.resolveRequestUpdated(x.request.uid))
      .finally(() => this.submitted = false);
  }


  private startRequest() {
    this.submitted = true;

    this.requestData.startRequest(this.request.uid)
      .firstValue()
      .then(x => this.resolveRequestUpdated(x.request.uid))
      .finally(() => this.submitted = false);
  }


  private closeRequest() {
    this.submitted = true;

    this.requestData.closeRequest(this.request.uid)
      .firstValue()
      .then(x => this.resolveRequestUpdated(x.request.uid))
      .finally(() => this.submitted = false);
  }


  private activateRequest() {
    this.submitted = true;

    this.requestData.activateRequest(this.request.uid)
      .firstValue()
      .then(x => this.resolveRequestUpdated(x.request.uid))
      .finally(() => this.submitted = false);
  }


  private resolveRequestUpdated(requestUID: string) {
    const payload = { requestUID };
    sendEvent(this.requestEditorEvent, RequestEditorEventType.REQUEST_UPDATED, payload);
  }


  private resolveRequestDeleted(requestUID: string) {
    const payload = { requestUID };
    sendEvent(this.requestEditorEvent, RequestEditorEventType.REQUEST_DELETED, payload);
  }

}
