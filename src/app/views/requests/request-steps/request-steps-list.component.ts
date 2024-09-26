/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { EventInfo, Identifiable } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { Step, WorkflowGroups } from '@app/models';

import { RequestStepsListItemEventType } from './request-steps-list-item.component';

export enum RequestStepsListEventType {
  VIEW_STEP   = 'RequestStepsListComponent.Event.ViewStep',
  UPDATE_STEP = 'RequestStepsListComponent.Event.UpdateStep',
  DELETE_STEP = 'RequestStepsListComponent.Event.DeleteStep',
}


interface RequestStepGroup {
  group: Identifiable;
  steps: Step[];
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

  requestStepGroupsList: RequestStepGroup[] = [];


  ngOnChanges(changes: SimpleChanges) {
    if (changes.steps || changes.groupBy) {
      this.buildRequestStepGroupsList();
    }
  }


  onRequestStepsListItemEvent(event: EventInfo) {
    switch (event.type as RequestStepsListItemEventType) {
      case RequestStepsListItemEventType.VIEW_STEP_CLICKED:
        sendEvent(this.requestStepsListEvent, RequestStepsListEventType.VIEW_STEP, event.payload);
        return;
      case RequestStepsListItemEventType.UPDATE_STEP_CLICKED:
        sendEvent(this.requestStepsListEvent, RequestStepsListEventType.UPDATE_STEP, event.payload);
        return;
      case RequestStepsListItemEventType.DELETE_STEP_CLICKED:
        sendEvent(this.requestStepsListEvent, RequestStepsListEventType.DELETE_STEP, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private buildRequestStepGroupsList() {
    const stepGroupsList: RequestStepGroup[] = [];

    this.steps.forEach((step) => {
      let groupKey: Identifiable;

      switch (this.groupBy) {
        case WorkflowGroups.process:
          groupKey = step.workflowInstance;
          break;
        case WorkflowGroups.deadline:
          const date = step.dueTime.toString().split('T')[0];
          groupKey = { uid: !date ? 'N/D' : date, name: !date ? 'Fecha límite no definida' : date };
          break;
        case WorkflowGroups.all:
        default:
          groupKey = { uid: 'all', name: 'Todas las tareas' };
          break;
      }

      let existingGroup = stepGroupsList.find(group => group.group.uid === groupKey.uid);

      if (!existingGroup) {
        existingGroup = { group: groupKey, steps: [] };
        stepGroupsList.push(existingGroup);
      }

      existingGroup.steps.push(step);
    });

    this.requestStepGroupsList = stepGroupsList;
  }

}
