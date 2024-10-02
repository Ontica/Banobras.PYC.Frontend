/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { Step, WorkflowGroups } from '@app/models';

import { RequestStepsListItemEventType } from './request-steps-list-item.component';


export enum RequestStepsListEventType {
  VIEW_STEP_CLICKED   = 'RequestStepsListComponent.Event.ViewStepClicked',
  UPDATE_STEP_CLICKED = 'RequestStepsListComponent.Event.UpdateStepClicked',
  REMOVE_STEP_CLICKED = 'RequestStepsListComponent.Event.RemoveStepClicked',
}


@Component({
  selector: 'emp-pyc-request-steps-list',
  templateUrl: './request-steps-list.component.html',
  styleUrls: ['./request-steps-list-item.component.scss'],
})
export class RequestStepsListComponent {

  @Input() steps: Step[] = [];

  @Input() groupBy: WorkflowGroups = WorkflowGroups.all;

  @Output() requestStepsListEvent = new EventEmitter<EventInfo>();


  onRequestStepsListItemEvent(event: EventInfo) {
    switch (event.type as RequestStepsListItemEventType) {
      case RequestStepsListItemEventType.VIEW_STEP_CLICKED:
        sendEvent(this.requestStepsListEvent, RequestStepsListEventType.VIEW_STEP_CLICKED, event.payload);
        return;
      case RequestStepsListItemEventType.UPDATE_STEP_CLICKED:
        sendEvent(this.requestStepsListEvent, RequestStepsListEventType.UPDATE_STEP_CLICKED, event.payload);
        return;
      case RequestStepsListItemEventType.REMOVE_STEP_CLICKED:
        sendEvent(this.requestStepsListEvent, RequestStepsListEventType.REMOVE_STEP_CLICKED, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
