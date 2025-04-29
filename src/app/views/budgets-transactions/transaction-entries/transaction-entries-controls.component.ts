/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

export enum TransactionEntriesControlsEventType {
  FILTER_CHANGED                      = 'TransactionEntriesControlsComponent.Event.FilterChanged',
  GROUPED_ENTRIES_CHANGED             = 'TransactionEntriesControlsComponent.Event.GroupedEntriesChanged',
  AUTOMATIC_GENERATION_BUTTON_CLICKED = 'TransactionEntriesControlsComponent.Event.AutomaticGenerationButtonClicked',
  CREATE_ENTRY_BUTTON_CLICKED         = 'TransactionEntriesControlsComponent.Event.CreateEntryButtonClicked',
}

@Component({
  selector: 'emp-bdg-transaction-entries-controls',
  templateUrl: './transaction-entries-controls.component.html',
})
export class TransactionEntriesControlsComponent {

  @Input() filter = '';

  @Input() groupedEntries = false;

  @Input() canEdit = false;

  @Output() transactionEntriesControlsEvent = new EventEmitter<EventInfo>();


  onFilterChanged() {
    sendEvent(this.transactionEntriesControlsEvent, TransactionEntriesControlsEventType.FILTER_CHANGED,
      { filter: this.filter });
  }


  onClearFilter() {
    this.filter = '';
    this.onFilterChanged();
  }


  onGroupedEntriesChanged() {
    sendEvent(this.transactionEntriesControlsEvent, TransactionEntriesControlsEventType.GROUPED_ENTRIES_CHANGED,
      { groupedEntries: this.groupedEntries });
  }


  onAutomaticGenerationButtonClicked() {
    sendEvent(this.transactionEntriesControlsEvent,
      TransactionEntriesControlsEventType.AUTOMATIC_GENERATION_BUTTON_CLICKED);
  }


  onCreateEntryButtonClicked() {
    sendEvent(this.transactionEntriesControlsEvent,
      TransactionEntriesControlsEventType.CREATE_ENTRY_BUTTON_CLICKED);
  }

}
