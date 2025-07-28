/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { sendEvent } from '@app/shared/utils';

import { SkipIf } from '@app/shared/decorators';

import { StepsDataService } from '@app/data-services';

import { EmptyRequestData, EmptyStep, RequestData, RequestsList, Step, StepFields,
         WorkflowGroups } from '@app/models';

import { RequestStepsListControlsEventType } from './request-steps-list-controls.component';

import { RequestStepsListEventType } from './request-steps-list.component';

import { RequestStepEditorEventType } from './request-step-editor.component';

export enum RequestStepsEditionEventType {
  REQUEST_UPDATED = 'RequestStepsEditionComponent.Event.RequestUpdated',
}

@Component({
  selector: 'emp-pyc-request-steps-edition',
  templateUrl: './request-steps-edition.component.html',
})
export class RequestStepsEditionComponent {

  @Input() requestsList: RequestsList = RequestsList.budgeting;

  @Input() requestData: RequestData = EmptyRequestData;

  @Output() requestStepsEditionEvent = new EventEmitter<EventInfo>();

  groupBy: WorkflowGroups = WorkflowGroups.all;

  displayStepEditor = false;

  selectedStep: Step = EmptyStep;

  submitted = false;


  constructor(private stepsData: StepsDataService,
              private messageBox: MessageBoxService) { }


  onRequestStepsListControlsEvent(event: EventInfo) {
    switch (event.type as RequestStepsListControlsEventType) {
      case RequestStepsListControlsEventType.GROUP_BY_CHANGE:
        Assertion.assertValue(event.payload.groupBy, 'event.payload.groupBy');
        this.groupBy = event.payload.groupBy.uid;
        return;
      case RequestStepsListControlsEventType.INSERT_STEP_CLICKED:
        this.setSelectedStep(EmptyStep, true);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onRequestStepsListEvent(event: EventInfo) {
    switch (event.type as RequestStepsListEventType) {
      case RequestStepsListEventType.UPDATE_STEP_CLICKED:
        Assertion.assertValue(event.payload.step, 'event.payload.step');
        this.setSelectedStep(event.payload.step);
        return;
      case RequestStepsListEventType.REMOVE_STEP_CLICKED:
        Assertion.assertValue(event.payload.step.uid, 'event.payload.step.uid');
        Assertion.assertValue(event.payload.step.workflowInstance.uid, 'event.payload.step.workflowInstance.uid');
        this.removeStep(event.payload.step.workflowInstance.uid, event.payload.step.uid);
        return;
      case RequestStepsListEventType.VIEW_STEP_CLICKED:
        Assertion.assertValue(event.payload.step, 'event.payload.step');
        this.messageBox.showInDevelopment('Ver ejecución de tarea', event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  @SkipIf('submitted')
  onRequestStepEditorEvent(event: EventInfo) {
    switch (event.type as RequestStepEditorEventType) {
      case RequestStepEditorEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedStep(EmptyStep);
        return;
      case RequestStepEditorEventType.INSERT_STEP:
        Assertion.assertValue(event.payload.workflowInstanceUID, 'event.payload.workflowInstanceUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.insertStep(event.payload.workflowInstanceUID, event.payload.dataFields);
        return;
      case RequestStepEditorEventType.UPDATE_STEP:
        Assertion.assertValue(event.payload.workflowInstanceUID, 'event.payload.workflowInstanceUID');
        Assertion.assertValue(event.payload.stepUID, 'event.payload.stepUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.updateStep(event.payload.workflowInstanceUID, event.payload.stepUID, event.payload.dataFields);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private insertStep(workflowInstanceUID: string, dataFields: StepFields) {
    this.submitted = true;

    this.stepsData.insertWorkflowStep(workflowInstanceUID, dataFields)
      .firstValue()
      .then(x => this.resolveRequestUpdated())
      .finally(() => this.submitted = false);
  }


  private updateStep(workflowInstanceUID: string, stepUID: string, dataFields: StepFields) {
    this.submitted = true;

    this.stepsData.updateWorkflowStep(workflowInstanceUID, stepUID, dataFields)
      .firstValue()
      .then(x => this.resolveRequestUpdated())
      .finally(() => this.submitted = false);
  }


  private removeStep(workflowInstanceUID: string, stepUID: string) {
    this.submitted = true;

    this.stepsData.removeWorkflowStep(workflowInstanceUID, stepUID)
      .firstValue()
      .then(x => this.resolveRequestUpdated())
      .finally(() => this.submitted = false);
  }


  private resolveRequestUpdated() {
    const payload = { requestUID: this.requestData.request.uid };
    sendEvent(this.requestStepsEditionEvent, RequestStepsEditionEventType.REQUEST_UPDATED, payload);
    this.setSelectedStep(EmptyStep);
  }


  private setSelectedStep(step: Step, display?: boolean) {
    this.selectedStep = step;
    this.displayStepEditor = display ?? !isEmpty(step);
  }

}
