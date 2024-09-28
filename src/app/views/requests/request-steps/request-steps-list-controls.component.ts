/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo, Identifiable } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { WorkflowGroups, WorkflowGroupsList } from '@app/models';

export enum RequestStepsListControlsEventType {
  GROUP_BY_CHANGE     = 'RequestStepsListControlsComponent.Event.GroupByChange',
  INSERT_STEP_CLICKED = 'RequestStepsListControlsComponent.Event.InsertStepClicked',
}

@Component({
  selector: 'emp-payments-request-steps-list-controls',
  templateUrl: './request-steps-list-controls.component.html',
})
export class RequestStepsListControlsComponent {

  @Input() groupBy: WorkflowGroups = WorkflowGroups.all;

  @Input() canInsertStep = false;

  @Output() requestStepsListControlsEvent = new EventEmitter<EventInfo>();

  groupByTypeList: Identifiable[] = WorkflowGroupsList;


  onGroupByChanges(groupBy: Identifiable) {
    sendEvent(this.requestStepsListControlsEvent,
      RequestStepsListControlsEventType.GROUP_BY_CHANGE, { groupBy });
  }


  onInsertStepClicked() {
    sendEvent(this.requestStepsListControlsEvent, RequestStepsListControlsEventType.INSERT_STEP_CLICKED);
  }

}
