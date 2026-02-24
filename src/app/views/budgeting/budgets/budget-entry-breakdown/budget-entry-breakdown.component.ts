/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { BudgetEntryBreakdownData, BudgetEntryQuery, EmptyBudgetEntryBreakdownData,
         EmptyBudgetEntryQuery } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { BudgetEntryExplorerEventType } from '../budget-entry-explorer/budget-entry-explorer.component';

export enum BudgetEntryBreakdownEventType {
  CLOSE_BUTTON_CLICKED = 'BudgetEntryBreakdown.Event.CloseButtonClicked',
  EXPAND_CLICKED       = 'BudgetEntryBreakdown.Event.ExpandClicked',
  ENTRY_CLICKED        = 'BudgetEntryBreakdown.Event.EntryClicked',
  SEARCH_CLICKED       = 'BudgetEntryBreakdown.Event.SearchClicked',
  EXPORT_CLICKED       = 'BudgetEntryBreakdown.Event.ExportClicked',
}

@Component({
  selector: 'emp-bdg-budget-entry-breakdown',
  templateUrl: './budget-entry-breakdown.component.html',
})
export class BudgetEntryBreakdownComponent implements OnChanges {

  @Input() subQuery: BudgetEntryQuery = Object.assign({}, EmptyBudgetEntryQuery);

  @Input() data: BudgetEntryBreakdownData = Object.assign({}, EmptyBudgetEntryBreakdownData);

  @Input() queryExecuted = false;

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


  onBudgetEntryExplorerEvent(event: EventInfo) {
    switch (event.type as BudgetEntryExplorerEventType) {
      case BudgetEntryExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.subQuery, 'event.payload.subQuery');
        sendEvent(this.budgetEntryBreakdownEvent, BudgetEntryBreakdownEventType.SEARCH_CLICKED, {
          query: this.data.query,
          entry: this.data.entry,
          subQuery: event.payload.subQuery
        });
        return;
      case BudgetEntryExplorerEventType.EXPORT_CLICKED:
        Assertion.assertValue(event.payload.subQuery, 'event.payload.subQuery');
        sendEvent(this.budgetEntryBreakdownEvent, BudgetEntryBreakdownEventType.EXPORT_CLICKED, {
          query: this.data.query,
          entry: this.data.entry,
          subQuery: event.payload.subQuery
        });
        return;
      case BudgetEntryExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');
        Assertion.assertValue(event.payload.entry.uid, 'event.payload.entry.uid');
        sendEvent(this.budgetEntryBreakdownEvent, BudgetEntryBreakdownEventType.ENTRY_CLICKED,
          { dataUID: event.payload.entry.uid });
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
