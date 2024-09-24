/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { EventInfo, Identifiable } from '@app/core';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { sendEvent } from '@app/shared/utils';

import { RequestTask } from '@app/models';

export enum RequestTasksListEventType {
  SELECT_TASK_CLICKED = 'RequestTasksListComponent.Event.SelectTaskClicked',
  DELETE_TASK_CLICKED = 'RequestTasksListComponent.Event.DeleteTaskClicked',
}


interface RequestTaskGroup {
  group: Identifiable;
  tasks: RequestTask[];
}

@Component({
  selector: 'emp-pyc-request-tasks-list',
  templateUrl: './request-tasks-list.component.html',
  styleUrls: ['./request-tasks-list.component.scss'],
})
export class RequestTasksListComponent implements OnChanges {

  @Input() tasks: RequestTask[] = [];

  @Input() groupBy: 'all' | 'deadline' | 'process' = 'all';

  @Input() canEdit = true;

  @Output() requestTasksListEvent = new EventEmitter<EventInfo>();

  requestTaskGroupsList: RequestTaskGroup[] = [];


  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.tasks || changes.groupBy) {
      this.buildRequestTaskGroupsList();
    }
  }


  onTaskClicked(task: RequestTask) {
    sendEvent(this.requestTasksListEvent, RequestTasksListEventType.SELECT_TASK_CLICKED, { task });
  }


  onDeleteTaskClicked(task: RequestTask) {
    this.confirmDeleteTask(task);
  }


  private confirmDeleteTask(task: RequestTask) {
    const message = `Esta operación eliminará la tarea ` +
      `<strong>${task.taskNo}: ${task.name}</strong><br><br>¿Elimino la tarea?`;

    this.messageBox.confirm(message, 'Eliminar tarea', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.requestTasksListEvent,
            RequestTasksListEventType.DELETE_TASK_CLICKED, { task });
        }
      });
  }


  private buildRequestTaskGroupsList() {
    const taskGroupsList: RequestTaskGroup[] = [];

    this.tasks.forEach((task) => {
      let groupKey: Identifiable;

      switch (this.groupBy) {
        case 'process':
          groupKey = task.workflowInstance;
          break;
        case 'deadline':
          const date = task.dueTime.toString().split('T')[0];
          groupKey = {
            uid: !date ? 'N/D' : date,
            name: !date ? 'Deadline no definido' : date,
          };
          break;
        case 'all':
          groupKey = { uid: 'all', name: 'Todas las tareas' };
          break;
        default:
          throw new Error(`Unsupported groupBy type: ${this.groupBy}`);
      }

      let existingGroup = taskGroupsList.find(group => group.group.uid === groupKey.uid);

      if (!existingGroup) {
        existingGroup = { group: groupKey, tasks: [] };
        taskGroupsList.push(existingGroup);
      }

      existingGroup.tasks.push(task);
    });

    this.requestTaskGroupsList = taskGroupsList;
  }
}
