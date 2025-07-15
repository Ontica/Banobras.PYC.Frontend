/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { AssetsAssignmentsDataService } from '@app/data-services';

import { AssetsAssignment, AssetsAssignmentFields, AssetsAssignmentHolder, EmptyAssetsAssignment,
         EmptyBaseActions, BaseActions } from '@app/models';

import { AssignmentHeaderEventType } from './assignment-header.component';


export enum AssignmentEditorEventType {
  UPDATED = 'AssetsAssignmentEditorComponent.Event.Updated',
  DELETED = 'AssetsAssignmentEditorComponent.Event.Deleted',
}

@Component({
  selector: 'emp-inv-assignment-editor',
  templateUrl: './assignment-editor.component.html',
})
export class AssetsAssignmentEditorComponent {

  @Input() assignment: AssetsAssignment = EmptyAssetsAssignment;

  @Input() actions: BaseActions = EmptyBaseActions;

  @Output() assignmentEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private assignmentsData: AssetsAssignmentsDataService,
              private messageBox: MessageBoxService) { }


  get isSaved(): boolean {
    return !isEmpty(this.assignment);
  }


  onAssignmentHeaderEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as AssignmentHeaderEventType) {
      case AssignmentHeaderEventType.UPDATE:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.updateAssignment(this.assignment.uid, event.payload.dataFields as AssetsAssignmentFields);
        return;
      case AssignmentHeaderEventType.DELETE:
        this.deleteAssignment(this.assignment.uid);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private updateAssignment(dataUID: string, dataFields: AssetsAssignmentFields) {
    this.submitted = true;

    setTimeout(() => {
      this.messageBox.showInDevelopment('Actualizar resguardo', { dataUID, dataFields });
      this.submitted = false
    }, 500);


    // this.assignmentsData.updateAssetsAssignment(dataUID, dataFields)
    //   .firstValue()
    //   .then(x => this.resolveAssignmentUpdated(x))
    //   .finally(() => this.submitted = false);
  }


  private deleteAssignment(dataUID: string) {
    this.submitted = true;

    setTimeout(() => {
      this.messageBox.showInDevelopment('Eliminar resguardo', { dataUID });
      this.submitted = false;
    }, 500);

    // this.assignmentsData.deleteAssetsAssignment(dataUID)
    //   .firstValue()
    //   .then(() => this.resolveAssignmentDeleted(dataUID))
    //   .finally(() => this.submitted = false);
  }


  private resolveAssignmentUpdated(data: AssetsAssignmentHolder) {
    sendEvent(this.assignmentEditorEvent, AssignmentEditorEventType.UPDATED, { data });
  }


  private resolveAssignmentDeleted(dataUID: string) {
    sendEvent(this.assignmentEditorEvent, AssignmentEditorEventType.DELETED, { dataUID });
  }

}
