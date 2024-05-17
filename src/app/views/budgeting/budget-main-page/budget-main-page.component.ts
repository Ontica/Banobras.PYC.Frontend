/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { BudgetPlanningQueryType, DataTable, DataTableEntry, DataTableQuery,
         EmptyDataTable } from '@app/models';

import { BudgetExplorerEventType } from '../budget-explorer/budget-explorer.component';

@Component({
  selector: 'emp-budgeting-budget-main-page',
  templateUrl: './budget-main-page.component.html',
})
export class BudgetMainPageComponent {

  queryType: BudgetPlanningQueryType = BudgetPlanningQueryType.All;

  query: DataTableQuery = null;

  data: DataTable = Object.assign({}, EmptyDataTable);

  entrySelected: DataTableEntry = null;

  displayTabbedView = false;

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;


  constructor(private messageBox: MessageBoxService) {

  }


  onBudgetExplorerEvent(event: EventInfo) {
    switch (event.type as BudgetExplorerEventType) {
      case BudgetExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.messageBox.showInDevelopment('Consulta de presupuesto', event.payload.query);
        return;

      case BudgetExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.entry, ' event.payload.entry');
        this.messageBox.showInDevelopment('Seleccion de partida de presupuesto', event.payload.entry);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
