/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { EmptyRequestData, RequestData, WorkflowGroups } from '@app/models';

import { RequestStepsListControlsEventType } from './request-steps-list-controls.component';

import { RequestStepsListEventType } from './request-steps-list.component';

export enum RequestStepsEditionEventType {
  REQUEST_UPDATED = 'RequestStepsEditionComponent.Event.RequestUpdated',
}

@Component({
  selector: 'emp-pyc-request-steps-edition',
  templateUrl: './request-steps-edition.component.html',
})
export class RequestStepsEditionComponent {

  @Input() requestData: RequestData = EmptyRequestData;

  @Output() requestStepsEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;

  groupBy: WorkflowGroups = WorkflowGroups.all;


  constructor(private messageBox: MessageBoxService) { }


  onRequestStepsListControlsEvent(event: EventInfo) {
    switch (event.type as RequestStepsListControlsEventType) {
      case RequestStepsListControlsEventType.GROUP_BY_CHANGE:
        Assertion.assertValue(event.payload.groupBy, 'event.payload.groupBy');
        this.groupBy = event.payload.groupBy.uid;
        return;
      case RequestStepsListControlsEventType.CREATE_STEP:
        this.messageBox.showInDevelopment('Agregar tarea');
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onRequestStepsListEvent(event: EventInfo) {
    switch (event.type as RequestStepsListEventType) {
      case RequestStepsListEventType.VIEW_STEP:
        Assertion.assertValue(event.payload.step, 'event.payload.step');
        this.messageBox.showInDevelopment('Ver ejecución de tarea', event.payload);
        return;
      case RequestStepsListEventType.UPDATE_STEP:
        Assertion.assertValue(event.payload.step, 'event.payload.step');
        this.messageBox.showInDevelopment('Editar tarea', event.payload);
        return;
      case RequestStepsListEventType.DELETE_STEP:
        Assertion.assertValue(event.payload.step.uid, 'event.payload.step.uid');
        this.messageBox.showInDevelopment('Eliminar tarea', event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
