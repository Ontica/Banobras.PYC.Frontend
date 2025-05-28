/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, DateStringLibrary, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { FinancialProjectHolder, EmptyFinancialProjectHolder } from '@app/models';

import { ProjectEditorEventType } from '../project/project-editor.component';

import {
  DocumentsEditionEventType
} from '@app/views/entity-records/documents-edition/documents-edition.component';


export enum ProjectTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'FinancialProjectTabbedViewComponent.Event.CloseButtonClicked',
  DATA_UPDATED         = 'FinancialProjectTabbedViewComponent.Event.DataUpdated',
  DATA_DELETED         = 'FinancialProjectTabbedViewComponent.Event.DataDeleted',
  REFRESH_DATA         = 'FinancialProjectTabbedViewComponent.Event.RefreshData',
}

@Component({
  selector: 'emp-cf-project-tabbed-view',
  templateUrl: './project-tabbed-view.component.html',
})
export class FinancialProjectTabbedViewComponent implements OnChanges {

  @Input() data: FinancialProjectHolder = EmptyFinancialProjectHolder;

  @Output() projectTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;


  ngOnChanges() {
    this.setTitle();
  }


  onCloseButtonClicked() {
    sendEvent(this.projectTabbedViewEvent, ProjectTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onProjectEditorEvent(event: EventInfo) {
    switch (event.type as ProjectEditorEventType) {
      case ProjectEditorEventType.UPDATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        sendEvent(this.projectTabbedViewEvent,
          ProjectTabbedViewEventType.DATA_UPDATED, event.payload);
        return;
      case ProjectEditorEventType.DELETED:
        Assertion.assertValue(event.payload.dataUID, 'event.payload.dataUID');
        sendEvent(this.projectTabbedViewEvent,
          ProjectTabbedViewEventType.DATA_DELETED, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onDocumentsEditionEvent(event: EventInfo) {
    switch (event.type as DocumentsEditionEventType) {
      case DocumentsEditionEventType.DOCUMENTS_UPDATED:
        const payload = { dataUID: this.data.project.uid };
        sendEvent(this.projectTabbedViewEvent, ProjectTabbedViewEventType.REFRESH_DATA, payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    const startDate = !this.data.project.startDate ? 'N/D' :
      DateStringLibrary.format(this.data.project.startDate);

    const status = this.data.project.status.name === 'Eliminada' ?
      `<span class="tag tag-error tag-small">${this.data.project.status.name}</span>` :
      `<span class="tag tag-small">${this.data.project.status.name}</span>`;

    this.title = `${this.data.project.projectNo}: ${this.data.project.name} ${status}`;

    this.hint = `<strong>${this.data.project.baseOrgUnit.name} &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${this.data.project.category.name}</strong> &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${startDate}`;
  }

}
