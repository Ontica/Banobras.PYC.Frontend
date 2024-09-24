/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo, Identifiable } from '@app/core';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { EmptyRequestData, RequestData } from '@app/models';

import { RequestTasksListEventType } from './request-tasks-list.component';

export enum RequestTasksEditionEventType {
  REQUEST_UPDATED = 'RequestTasksEditionComponent.Event.RequestUpdated',
}

@Component({
  selector: 'emp-pyc-request-tasks-edition',
  templateUrl: './request-tasks-edition.component.html',
})
export class RequestTasksEditionComponent {

  @Input() requestData: RequestData = EmptyRequestData;

  @Output() requestTasksEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;

  groupByTypeList: Identifiable[] = [
    { uid: 'all',      name: 'Todas' },
    { uid: 'deadline', name: 'Deadline' },
    { uid: 'process',  name: 'Proceso' },
  ];

  groupBy: 'deadline' | 'process' | 'all' = 'all';


  constructor(private messageBox: MessageBoxService) { }


  onCreateTaskClicked() {
    this.messageBox.showInDevelopment('Agregar tarea');
  }


  onRequestTasksListEvent(event: EventInfo) {
    switch (event.type as RequestTasksListEventType) {
      case RequestTasksListEventType.SELECT_TASK_CLICKED:
        Assertion.assertValue(event.payload.task, 'event.payload.task');
        this.messageBox.showInDevelopment('Editar tarea', event.payload);
        return;
      case RequestTasksListEventType.DELETE_TASK_CLICKED:
        Assertion.assertValue(event.payload.task.uid, 'event.payload.task.uid');
        this.messageBox.showInDevelopment('Eliminar tarea', event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
