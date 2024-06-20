/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { RequestDescriptor } from '@app/models';

export enum RequestsListItemEventType {
  ITEM_CLICKED  = 'RequestsListItemComponent.Event.ItemClicked',
  CHECK_CLICKED = 'RequestsListItemComponent.Event.CheckClicked',
}

@Component({
  selector: 'emp-pyc-requests-list-item',
  templateUrl: './requests-list-item.component.html',
  styleUrls: ['./requests-list-item.component.scss'],
})
export class RequestsListItemComponent {

  @Input() request: RequestDescriptor;

  @Input() selected = false;

  @Output() requestsListItemEvent = new EventEmitter<EventInfo>();


  onRequestClicked() {
    sendEvent(this.requestsListItemEvent, RequestsListItemEventType.ITEM_CLICKED, { request: this.request });
  }


  onCheckRequestClicked() {
    sendEvent(this.requestsListItemEvent, RequestsListItemEventType.CHECK_CLICKED, { request: this.request });
  }

}
