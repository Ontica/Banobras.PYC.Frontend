/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { RequestsDataService } from '@app/data-services';

import { RequestData, RequestFields, RequestsList } from '@app/models';

import { RequestHeaderEventType } from './request-header.component';

export enum RequestCreatorEventType {
  CLOSE_MODAL_CLICKED = 'RequestCreatorComponent.Event.CloseModalClicked',
  REQUEST_CREATED     = 'RequestCreatorComponent.Event.RequestCreated',
}

@Component({
  selector: 'emp-pyc-request-creator',
  templateUrl: './request-creator.component.html',
})
export class RequestCreatorComponent {

  @Input() requestsList: RequestsList = RequestsList.budgeting;

  @Output() requestCreatorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private requestData: RequestsDataService) { }


  onCloseModalClicked() {
    sendEvent(this.requestCreatorEvent, RequestCreatorEventType.CLOSE_MODAL_CLICKED);
  }


  onRequestHeaderEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as RequestHeaderEventType) {
      case RequestHeaderEventType.CREATE_REQUEST:
        Assertion.assertValue(event.payload.requestFields, 'event.payload.requestFields');
        this.createRequest(event.payload.requestFields as RequestFields);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private createRequest(requestFields: RequestFields) {
    this.submitted = true;

    this.requestData.createRequest(requestFields)
      .firstValue()
      .then(x => this.resolveCreateRequest(x))
      .finally(() => this.submitted = false);
  }


  private resolveCreateRequest(data: RequestData) {
    sendEvent(this.requestCreatorEvent, RequestCreatorEventType.REQUEST_CREATED, { request: data });
  }

}
