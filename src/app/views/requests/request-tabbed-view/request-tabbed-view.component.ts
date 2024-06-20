/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { DateStringLibrary, EventInfo } from '@app/core';

import { EmptyRequestDescriptor, RequestDescriptor } from '@app/models';

import { sendEvent } from '@app/shared/utils';

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

  @Input() request: RequestDescriptor = EmptyRequestDescriptor;

  @Output() requestTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;

  ngOnChanges() {
    this.setTitle();
  }


  onCloseButtonClicked() {
    sendEvent(this.requestTabbedViewEvent, RequestTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  private setTitle() {
    const postingTime = !this.request.filingTime ? '' : DateStringLibrary.format(this.request.filingTime);

    this.title = `${this.request.requestTypeName} - ${this.request.uniqueID}` +
      `<span class="tag tag-small">${this.request.status}</span>`;

    this.hint = `<strong>${this.request.requesterOrgUnitName} </strong>` +
      ` &nbsp; &nbsp; | &nbsp; &nbsp; ${postingTime}`;
  }

}
