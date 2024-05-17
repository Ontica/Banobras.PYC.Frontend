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

import { BudgetPlanningFilterEventType } from './budget-planning-filter.component';

import { DataTableEventType } from '@app/views/_reports-controls/data-table/data-table.component';

export enum BudgetPlanningExplorerEventType {
  SEARCH_CLICKED = 'BudgetPlanningExplorerComponent.Event.SearchClicked',
  SELECT_CLICKED = 'BudgetPlanningExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-budg-planning-explorer',
  templateUrl: './budget-planning-explorer.component.html',
})
export class BudgetPlanningExplorerComponent {

  @Input() queryType: BudgetPlanningQueryType = BudgetPlanningQueryType.All;

  @Input() data: DataTable = EmptyDataTable;

  @Input() entrySelected: DataTableEntry = null;

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() budgetPlanningExplorerEvent = new EventEmitter<EventInfo>();

  titleText = 'Planeación presupuestal';

  cardHint = 'Seleccionar los filtros';


  onBudgetPlanningFilterEvent(event: EventInfo) {
    switch (event.type as BudgetPlanningFilterEventType) {
      case BudgetPlanningFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.budgetPlanningExplorerEvent, BudgetPlanningExplorerEventType.SEARCH_CLICKED,
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
        sendEvent(this.budgetPlanningExplorerEvent, BudgetPlanningExplorerEventType.SELECT_CLICKED,
          event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
