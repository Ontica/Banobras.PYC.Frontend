/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { BudgetEntryBreakdownData, EmptyBudgetEntryBreakdownData } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { DataTableEventType } from '@app/views/_reports-controls/data-table/data-table.component';

export enum BudgetEntryBreakdownEventType {
  CLOSE_BUTTON_CLICKED = 'BudgetEntryBreakdown.Event.CloseButtonClicked',
  EXPAND_CLICKED       = 'BudgetEntryBreakdown.Event.ExpandClicked',
  ENTRY_CLICKED        = 'BudgetEntryBreakdown.Event.EntryClicked',
}

@Component({
  selector: 'emp-bdg-budget-entry-breakdown',
  templateUrl: './budget-entry-breakdown.component.html',
})
export class BudgetEntryBreakdownComponent implements OnChanges {

  @Input() data: BudgetEntryBreakdownData = Object.assign({}, EmptyBudgetEntryBreakdownData);

  @Input() expand = false;

  @Output() budgetEntryBreakdownEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;

  ngOnChanges() {
    this.setTitle();
  }


  onCloseClicked() {
    sendEvent(this.budgetEntryBreakdownEvent, BudgetEntryBreakdownEventType.CLOSE_BUTTON_CLICKED);
  }


  onExpandClicked() {
    sendEvent(this.budgetEntryBreakdownEvent, BudgetEntryBreakdownEventType.EXPAND_CLICKED);
  }


  onDataTableEvent(event: EventInfo) {
    switch (event.type as DataTableEventType) {
      case DataTableEventType.ENTRY_CLICKED:
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');
        Assertion.assertValue(event.payload.entry.uid, 'event.payload.entry.uid');
        sendEvent(this.budgetEntryBreakdownEvent, BudgetEntryBreakdownEventType.ENTRY_CLICKED,
          { dataUID: event.payload.entry.uid }
        );
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    this.title = `${this.data.entry.title}`;
    this.hint = `${this.data.entry.description}`;
  }

}
