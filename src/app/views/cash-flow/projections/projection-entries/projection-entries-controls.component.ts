/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

export enum ProjectionEntriesControlsEventType {
  FILTER_CHANGED                      = 'CashFlowProjectionEntriesControlsComponent.Event.FilterChanged',
  CHECK_ALL_ENTRIES_CHANGED           = 'CashFlowProjectionEntriesControlsComponent.Event.CheckAllEntriesChanged',
  AUTOMATIC_GENERATION_BUTTON_CLICKED = 'CashFlowProjectionEntriesControlsComponent.Event.AutomaticGenerationButtonClicked',
  CREATE_ENTRY_BUTTON_CLICKED         = 'CashFlowProjectionEntriesControlsComponent.Event.CreateEntryButtonClicked',
}

@Component({
  selector: 'emp-cf-projection-entries-controls',
  templateUrl: './projection-entries-controls.component.html',
})
export class CashFlowProjectionEntriesControlsComponent {

  @Input() filter = '';

  @Input() displayAllEntries = false;

  @Input() canEdit = false;

  @Output() projectionEntriesControlsEvent = new EventEmitter<EventInfo>();


  onFilterChanged() {
    sendEvent(this.projectionEntriesControlsEvent, ProjectionEntriesControlsEventType.FILTER_CHANGED,
      { filter: this.filter });
  }


  onClearFilter() {
    this.filter = '';
    this.onFilterChanged();
  }


  onAllEntriesChanged() {
    sendEvent(this.projectionEntriesControlsEvent, ProjectionEntriesControlsEventType.CHECK_ALL_ENTRIES_CHANGED,
      { displayAllEntries: this.displayAllEntries });
  }


  onAutomaticGenerationButtonClicked() {
    sendEvent(this.projectionEntriesControlsEvent,
      ProjectionEntriesControlsEventType.AUTOMATIC_GENERATION_BUTTON_CLICKED);
  }


  onCreateEntryButtonClicked() {
    sendEvent(this.projectionEntriesControlsEvent,
      ProjectionEntriesControlsEventType.CREATE_ENTRY_BUTTON_CLICKED);
  }

}
