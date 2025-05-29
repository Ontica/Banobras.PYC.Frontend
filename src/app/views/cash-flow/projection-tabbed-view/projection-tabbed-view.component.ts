/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, DateStringLibrary, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { CashFlowProjectionHolder, EmptyCashFlowProjectionHolder } from '@app/models';

import { ProjectionEditorEventType } from '../projection/projection-editor.component';

import {
  DocumentsEditionEventType
} from '@app/views/entity-records/documents-edition/documents-edition.component';


export enum ProjectionTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'CashFlowProjectionTabbedViewComponent.Event.CloseButtonClicked',
  DATA_UPDATED         = 'CashFlowProjectionTabbedViewComponent.Event.DataUpdated',
  DATA_DELETED         = 'CashFlowProjectionTabbedViewComponent.Event.DataDeleted',
  REFRESH_DATA         = 'CashFlowProjectionTabbedViewComponent.Event.RefreshData',
}

@Component({
  selector: 'emp-cf-projection-tabbed-view',
  templateUrl: './projection-tabbed-view.component.html',
})
export class CashFlowProjectionTabbedViewComponent implements OnChanges {

  @Input() data: CashFlowProjectionHolder = EmptyCashFlowProjectionHolder;

  @Output() projectionTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;


  ngOnChanges() {
    this.setTitle();
  }


  onCloseButtonClicked() {
    sendEvent(this.projectionTabbedViewEvent, ProjectionTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onProjectionEditorEvent(event: EventInfo) {
    switch (event.type as ProjectionEditorEventType) {
      case ProjectionEditorEventType.UPDATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        sendEvent(this.projectionTabbedViewEvent,
          ProjectionTabbedViewEventType.DATA_UPDATED, event.payload);
        return;
      case ProjectionEditorEventType.DELETED:
        Assertion.assertValue(event.payload.dataUID, 'event.payload.dataUID');
        sendEvent(this.projectionTabbedViewEvent,
          ProjectionTabbedViewEventType.DATA_DELETED, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onDocumentsEditionEvent(event: EventInfo) {
    switch (event.type as DocumentsEditionEventType) {
      case DocumentsEditionEventType.DOCUMENTS_UPDATED:
        const payload = { dataUID: this.data.projection.uid };
        sendEvent(this.projectionTabbedViewEvent, ProjectionTabbedViewEventType.REFRESH_DATA, payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    const authorizationTime = !this.data.projection.authorizationTime ? 'N/D' :
      DateStringLibrary.format(this.data.projection.authorizationTime);

    const status = this.data.projection.status.name === 'Eliminada' ?
      `<span class="tag tag-error tag-small">${this.data.projection.status.name}</span>` :
      `<span class="tag tag-small">${this.data.projection.status.name}</span>`;

    this.title = `${this.data.projection.projectionNo}: ${this.data.projection.plan.name} ${status}`;

    this.hint = `<strong>${this.data.projection.party?.name ?? 'N/D'} &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${this.data.projection.projectionType?.name ?? 'N/D'}</strong> &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${authorizationTime}`;
  }

}
