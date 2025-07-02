/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyAssetsAssignmentHolder, AssetsAssignmentHolder, isEntityStatusInWarning } from '@app/models';

import { AssetsAssignmentEditorEventType } from '../assignment/assignment-editor.component';

import { DocumentsEditionEventType } from '@app/views/entity-records/documents-edition/documents-edition.component';


export enum AssetsAssignmentTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'AssetsAssignmentTabbedViewComponent.Event.CloseButtonClicked',
  DATA_UPDATED         = 'AssetsAssignmentTabbedViewComponent.Event.DataUpdated',
  DATA_DELETED         = 'AssetsAssignmentTabbedViewComponent.Event.DataDeleted',
  REFRESH_DATA         = 'AssetsAssignmentTabbedViewComponent.Event.RefreshData',
}

@Component({
  selector: 'emp-pyc-assignment-tabbed-view',
  templateUrl: './assignment-tabbed-view.component.html',
})
export class AssetsAssignmentsAssignmentTabbedViewComponent implements OnChanges {

  @Input() data: AssetsAssignmentHolder = EmptyAssetsAssignmentHolder;

  @Output() assetsAssignmentTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;


  ngOnChanges() {
    this.setTitle();
  }


  onCloseButtonClicked() {
    sendEvent(this.assetsAssignmentTabbedViewEvent, AssetsAssignmentTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onAssetsAssignmentEditorEvent(event: EventInfo) {
    switch (event.type as AssetsAssignmentEditorEventType) {
      case AssetsAssignmentEditorEventType.UPDATED:
        Assertion.assertValue(event.payload.assetUID, 'event.payload.assetUID');
        sendEvent(this.assetsAssignmentTabbedViewEvent,
          AssetsAssignmentTabbedViewEventType.DATA_UPDATED, event.payload);
        return;
      case AssetsAssignmentEditorEventType.DELETED:
        Assertion.assertValue(event.payload.assetUID, 'event.payload.assetUID');
        sendEvent(this.assetsAssignmentTabbedViewEvent,
          AssetsAssignmentTabbedViewEventType.DATA_DELETED, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onDocumentsEditionEvent(event: EventInfo) {
    switch (event.type as DocumentsEditionEventType) {
      case DocumentsEditionEventType.DOCUMENTS_UPDATED:
        const payload = { assetUID: this.data.assignation.uid };
        sendEvent(this.assetsAssignmentTabbedViewEvent, AssetsAssignmentTabbedViewEventType.REFRESH_DATA, payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    const status = ''

    this.title = `${this.data.assignation.assignedTo.name}` + status;

    this.hint = `<strong>${this.data.assignation.assignedToOrgUnit?.name ?? 'No determinado'} </strong> &nbsp; &nbsp; | &nbsp; &nbsp;` +
      `${this.data.assignation.locationName ?? 'No determinado'} `;
  }

}
