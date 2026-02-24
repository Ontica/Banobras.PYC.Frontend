/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { BudgetEntryBreakdown,  BudgetEntryExplorerReportTypes,  BudgetEntryQuery,  EmptyBudgetEntryBreakdown,
         EmptyBudgetEntryQuery } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { BudgetEntryFilterEventType } from './budget-entry-filter.component';

import { DataTableEventType } from '@app/views/_reports-controls/data-table/data-table.component';

export enum BudgetEntryExplorerEventType {
  SEARCH_CLICKED = 'BudgetEntryExplorerComponent.Event.SearchClicked',
  EXPORT_CLICKED = 'BudgetEntryExplorerComponent.Event.ExportClicked',
  SELECT_CLICKED = 'BudgetEntryExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-bdg-budget-entry-explorer',
  templateUrl: './budget-entry-explorer.component.html',
})
export class BudgetEntryExplorerComponent {

  @Input() subQuery: BudgetEntryQuery = Object.assign({}, EmptyBudgetEntryQuery);

  @Input() data: BudgetEntryBreakdown = Object.assign({}, EmptyBudgetEntryBreakdown);

  @Input() queryExecuted = false;

  @Output() budgetEntryExplorerEvent = new EventEmitter<EventInfo>();

  filter = '';


  onBudgetEntryFilterEvent(event: EventInfo) {
    switch (event.type as BudgetEntryFilterEventType) {
      case BudgetEntryFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.subQuery, 'event.payload.subQuery');
        this.subQuery = Object.assign({}, event.payload.subQuery);
        sendEvent(this.budgetEntryExplorerEvent, BudgetEntryExplorerEventType.SEARCH_CLICKED,
          { subQuery: this.subQuery });
        return;
      case BudgetEntryFilterEventType.FILTER_CHANGED:
        this.filter = event.payload.filter as string;
        return;
      case BudgetEntryFilterEventType.EXPORT_CLICKED:
        Assertion.assertValue(event.payload.subQuery, 'event.payload.subQuery');
        sendEvent(this.budgetEntryExplorerEvent, BudgetEntryExplorerEventType.EXPORT_CLICKED,
          { subQuery: this.subQuery });
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onDataTableEvent(event: EventInfo) {
    switch (event.type as DataTableEventType) {
      case DataTableEventType.ENTRY_CLICKED:
        if (this.subQuery.reportType === BudgetEntryExplorerReportTypes.BudgetTransactions) {
          sendEvent(this.budgetEntryExplorerEvent, BudgetEntryExplorerEventType.SELECT_CLICKED,
            event.payload);
        }
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
