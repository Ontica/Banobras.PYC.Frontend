/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { BudgetData, BudgetEntryDescriptor, BudgetQueryType, EmptyBudgetData } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { BudgetFilterEventType } from './budget-filter.component';

import { DataTableEventType } from '@app/views/_reports-controls/data-table/data-table.component';

export enum BudgetExplorerEventType {
  SEARCH_CLICKED = 'BudgetExplorerComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'BudgetExplorerComponent.Event.ClearClicked',
  EXPORT_CLICKED = 'BudgetExplorerComponent.Event.ExportClicked',
  SELECT_CLICKED = 'BudgetExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-bdg-budget-explorer',
  templateUrl: './budget-explorer.component.html',
})
export class BudgetExplorerComponent implements OnChanges {

  @Input() queryType: BudgetQueryType = BudgetQueryType.planning;

  @Input() data: BudgetData = Object.assign({}, EmptyBudgetData);

  @Input() entrySelected: BudgetEntryDescriptor = null;

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() budgetExplorerEvent = new EventEmitter<EventInfo>();

  titleText = 'Explorador del presupuesto';

  cardHint = 'Seleccionar los filtros';


  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.setText();
    }
  }


  onBudgetFilterEvent(event: EventInfo) {
    switch (event.type as BudgetFilterEventType) {
      case BudgetFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.budgetExplorerEvent, BudgetExplorerEventType.SEARCH_CLICKED,
          event.payload);
        return;

      case BudgetFilterEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.budgetExplorerEvent, BudgetExplorerEventType.CLEAR_CLICKED,
          event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onDataTableEvent(event: EventInfo) {
    switch (event.type as DataTableEventType) {
      case DataTableEventType.ENTRY_CLICKED:
        sendEvent(this.budgetExplorerEvent, BudgetExplorerEventType.SELECT_CLICKED,
          event.payload);
        return;

      case DataTableEventType.EXPORT_DATA:
        sendEvent(this.budgetExplorerEvent, BudgetExplorerEventType.EXPORT_CLICKED);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setText() {
    if (!this.queryExecuted) {
      this.cardHint = 'Seleccionar los filtros';
      return;
    }

    this.cardHint = `${this.data.entries.length} registros encontrados`;
  }

}
