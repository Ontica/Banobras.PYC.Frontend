/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { BudgetPlanningQueryType, DataTable, DataTableEntry, EmptyDataTable } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { BudgetFilterEventType } from './budget-filter.component';

import { DataTableEventType } from '@app/views/_reports-controls/data-table/data-table.component';

export enum BudgetExplorerEventType {
  SEARCH_CLICKED = 'BudgetExplorerComponent.Event.SearchClicked',
  SELECT_CLICKED = 'BudgetExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-budgeting-budget-explorer',
  templateUrl: './budget-explorer.component.html',
})
export class BudgetExplorerComponent {

  @Input() queryType: BudgetPlanningQueryType = BudgetPlanningQueryType.All;

  @Input() data: DataTable = EmptyDataTable;

  @Input() entrySelected: DataTableEntry = null;

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() budgetExplorerEvent = new EventEmitter<EventInfo>();

  titleText = 'Planeación presupuestal';

  cardHint = 'Seleccionar los filtros';


  onBudgetFilterEvent(event: EventInfo) {
    switch (event.type as BudgetFilterEventType) {
      case BudgetFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.budgetExplorerEvent, BudgetExplorerEventType.SEARCH_CLICKED,
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

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
