/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { BudgetsDataService } from '@app/data-services';

import { BudgetData, BudgetEntry, BudgetQuery, BudgetQueryType, EmptyBudgetData,
         EmptyBudgetQuery } from '@app/models';

import { BudgetExplorerEventType } from '../budget-explorer/budget-explorer.component';


@Component({
  selector: 'emp-budgeting-budget-main-page',
  templateUrl: './budget-main-page.component.html',
})
export class BudgetMainPageComponent {

  queryType: BudgetQueryType = BudgetQueryType.planning;

  query: BudgetQuery = Object.assign({}, EmptyBudgetQuery);

  data: BudgetData = Object.assign({}, EmptyBudgetData);

  entrySelected: BudgetEntry = null;

  displayTabbedView = false;

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;


  constructor(private budgetsData: BudgetsDataService,
              private messageBox: MessageBoxService) {

  }


  onBudgetExplorerEvent(event: EventInfo) {
    switch (event.type as BudgetExplorerEventType) {
      case BudgetExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.query = Object.assign({}, event.payload.query);
        this.clearBudgetData();
        this.searchBudgetData(this.query);
        return;

      case BudgetExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.query = Object.assign({}, event.payload.query);
        this.clearBudgetData();
        return;

      case BudgetExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.entry, ' event.payload.entry');
        this.messageBox.showInDevelopment('Seleccion de partida de presupuesto', event.payload.entry);
        return;

      case BudgetExplorerEventType.EXPORT_CLICKED:
        this.messageBox.showInDevelopment('Exportar presupuesto', this.query);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private clearBudgetData() {
    this.setBudgetData(EmptyBudgetData, false);
    this.entrySelected = null;
  }


  private searchBudgetData(query: BudgetQuery) {
    this.isLoading = true;

    this.budgetsData.searchBudgetData(query)
      .firstValue()
      .then(x => this.setBudgetData(x))
      .finally(() => this.isLoading = false);
  }


  private setBudgetData(data: BudgetData, queryExecuted: boolean = true) {
    this.data = data.columns ? data : Object.assign({}, EmptyBudgetData);
    this.queryExecuted = queryExecuted;
  }

}
