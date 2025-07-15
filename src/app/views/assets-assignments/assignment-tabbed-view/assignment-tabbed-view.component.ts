/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyAssetsAssignmentHolder, AssetsAssignmentHolder } from '@app/models';

import { AssignmentEditorEventType } from '../assignment/assignment-editor.component';

import { AssignmentAssetsEditionEventType } from '../assignment-assets-edition/assignment-assets-edition.component';

import { DocumentsEditionEventType } from '@app/views/entity-records/documents-edition/documents-edition.component';


export enum AssignmentTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'AssetsAssignmentTabbedViewComponent.Event.CloseButtonClicked',
  DATA_UPDATED         = 'AssetsAssignmentTabbedViewComponent.Event.DataUpdated',
  DATA_DELETED         = 'AssetsAssignmentTabbedViewComponent.Event.DataDeleted',
  REFRESH_DATA         = 'AssetsAssignmentTabbedViewComponent.Event.RefreshData',
}

@Component({
  selector: 'emp-inv-assignment-tabbed-view',
  templateUrl: './assignment-tabbed-view.component.html',
})
export class AssetsAssignmentsAssignmentTabbedViewComponent implements OnChanges {

  @Input() data: AssetsAssignmentHolder = EmptyAssetsAssignmentHolder;

  @Output() assignmentTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;


  ngOnChanges() {
    this.setTitle();
  }


  onCloseButtonClicked() {
    sendEvent(this.assignmentTabbedViewEvent, AssignmentTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onAssignmentEditorEvent(event: EventInfo) {
    switch (event.type as AssignmentEditorEventType) {
      case AssignmentEditorEventType.UPDATED:
        Assertion.assertValue(event.payload.assignmentUID, 'event.payload.assignmentUID');
        sendEvent(this.assignmentTabbedViewEvent,
          AssignmentTabbedViewEventType.DATA_UPDATED, event.payload);
        return;
      case AssignmentEditorEventType.DELETED:
        Assertion.assertValue(event.payload.assignmentUID, 'event.payload.assignmentUID');
        sendEvent(this.assignmentTabbedViewEvent,
          AssignmentTabbedViewEventType.DATA_DELETED, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onAssignmentAssetsEditionEvent(event: EventInfo) {
    switch (event.type as AssignmentAssetsEditionEventType) {
      case AssignmentAssetsEditionEventType.EXECUTED:
        Assertion.assertValue(event.payload.assignmentUID, 'event.payload.assignmentUID');
        const payload = { assignmentUID: this.data.assignment.uid };
        sendEvent(this.assignmentTabbedViewEvent, AssignmentTabbedViewEventType.REFRESH_DATA, payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }



  onDocumentsEditionEvent(event: EventInfo) {
    switch (event.type as DocumentsEditionEventType) {
      case DocumentsEditionEventType.DOCUMENTS_UPDATED:
        const payload = { assignmentUID: this.data.assignment.uid };
        sendEvent(this.assignmentTabbedViewEvent, AssignmentTabbedViewEventType.REFRESH_DATA, payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    this.title = `${this.data.assignment.assignedTo.name}`;

    this.hint = `<strong>${this.data.assignment.assignedToOrgUnit?.name ?? 'No determinado'} </strong> &nbsp; &nbsp; | &nbsp; &nbsp;` +
      `${this.data.assignment.locationName ?? 'No determinado'} `;
  }

}
