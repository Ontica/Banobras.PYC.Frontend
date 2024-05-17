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

import { BudgetPlanningExplorerEventType } from '../budget-planning-explorer/budget-planning-explorer.component';

@Component({
  selector: 'emp-budg-planning-main-page',
  templateUrl: './budget-planning-main-page.component.html',
})
export class BudgetPlanningMainPageComponent {

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


  onBudgetPlanningExplorerEvent(event: EventInfo) {
    switch (event.type as BudgetPlanningExplorerEventType) {
      case BudgetPlanningExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.messageBox.showInDevelopment('Consulta de presupuesto', event.payload.query);
        return;

      case BudgetPlanningExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.entry, ' event.payload.entry');
        this.messageBox.showInDevelopment('Seleccion de partida de presupuesto', event.payload.entry);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
