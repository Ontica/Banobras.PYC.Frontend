/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { DateStringLibrary, EventInfo } from '@app/core';

import { ArrayLibrary, sendEvent } from '@app/shared/utils';

import { Step, StepGroupData, WorkflowGroups } from '@app/models';

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
export class RequestStepsListComponent implements OnChanges {

  @Input() steps: Step[] = [];

  @Input() groupBy: WorkflowGroups = WorkflowGroups.all;

  @Output() requestStepsListEvent = new EventEmitter<EventInfo>();

  requestStepGroupsList: StepGroupData[] = [];


  ngOnChanges(changes: SimpleChanges) {
    if (changes.steps || changes.groupBy) {
      this.buildRequestStepGroupDatasList();
    }
  }


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


  private buildRequestStepGroupDatasList() {
    const stepGroupsList: StepGroupData[] = [];

    this.steps.forEach((step) => {
      let currentGroup: StepGroupData;

      switch (this.groupBy) {
        case WorkflowGroups.process:
          currentGroup = { groupUID: step.workflowInstance.uid, groupName: step.workflowInstance.name };
          break;
        case WorkflowGroups.deadline:
          const date = step.dueTime.toString().split('T')[0];
          const dataString = !date ? 'Fecha límite no definida' : DateStringLibrary.format(date);
          currentGroup = {
            groupUID: !date ? 'N/D' : date,
            groupName: dataString,
            groupDate: new Date(date),
          };
          break;
        case WorkflowGroups.all:
        default:
          currentGroup = { groupUID: 'all', groupName: 'Todas las tareas' };
          break;
      }

      let existingGroup = stepGroupsList.find(group => group.groupUID === currentGroup.groupUID);

      if (!existingGroup) {
        existingGroup = {...{}, ...currentGroup, ...{steps: []}};
        stepGroupsList.push(existingGroup);
      }

      existingGroup.steps.push(step);
    });

    if (this.groupBy === WorkflowGroups.deadline) {
      ArrayLibrary.sortByKey(stepGroupsList, 'groupDate');
    }

    this.requestStepGroupsList = stepGroupsList;
  }

}
