/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { EventInfo, Identifiable } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { EmptyStep, Priority, Step, StepStatus } from '@app/models';

export enum RequestStepsListItemEventType {
  VIEW_STEP_CLICKED   = 'RequestStepsListItemComponent.Event.ViewStepClicked',
  UPDATE_STEP_CLICKED = 'RequestStepsListItemComponent.Event.UpdateStepClicked',
  DELETE_STEP_CLICKED = 'RequestStepsListItemComponent.Event.DeleteStepClicked',
}


enum RequestStepOptions {
  Update = 'Update',
  Delete = 'Delete',
}

@Component({
  selector: 'emp-payments-request-steps-list-item',
  templateUrl: './request-steps-list-item.component.html',
  styleUrls: ['./request-steps-list-item.component.scss']
})
export class RequestStepsListItemComponent implements OnInit {

  @Input() step: Step = EmptyStep;

  @Output() requestStepsListItemEvent = new EventEmitter<EventInfo>();

  StepStatus = StepStatus;

  Priority = Priority;

  stepOptions: Identifiable[] = []


  constructor(private messageBox: MessageBoxService) { }


  ngOnInit() {
    this.setStepOptions();
  }


  onStepClicked(step: Step) {
    sendEvent(this.requestStepsListItemEvent, RequestStepsListItemEventType.VIEW_STEP_CLICKED, { step });
  }


  onClickStepOption(option: string, step: Step) {
    switch (option) {
      case RequestStepOptions.Update:
        sendEvent(this.requestStepsListItemEvent, RequestStepsListItemEventType.UPDATE_STEP_CLICKED, { step });
        return;
      case RequestStepOptions.Delete:
        this.confirmDeleteStep(step);
        return;
      default:
        break;
    }
  }


  private setStepOptions() {
    let options = [];

    if (this.step.actions.canUpdate) {
      options.push({ uid: RequestStepOptions.Update, name: 'Actualizar tarea' });
    }

    if (this.step.actions.canDelete) {
      options.push({ uid: RequestStepOptions.Delete, name: 'Eliminar tarea' });
    }

    this.stepOptions = options;
  }


  private confirmDeleteStep(step: Step) {
    const message = `Esta operación eliminará la tarea ` +
      `<strong>${step.stepNo}: ${step.name}</strong><br><br>¿Elimino la tarea?`;

    this.messageBox.confirm(message, 'Eliminar tarea', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.requestStepsListItemEvent,
            RequestStepsListItemEventType.DELETE_STEP_CLICKED, { step });
        }
      });
  }

}
