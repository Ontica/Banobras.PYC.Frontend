/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { FinancialRulesDataService } from '@app/data-services';

import { FinancialRulesQuery, EmptyFinancialRulesQuery, FinancialRulesData, FinancialRuleHolder,
         EmptyFinancialRulesData, EmptyFinancialRuleHolder } from '@app/models';

import {
  FinancialRulesExplorerEventType
} from '../rules-explorer/rules-explorer.component';


@Component({
  selector: 'emp-financial-rules-main-page',
  templateUrl: './rules-main-page.component.html',
})
export class FinancialRulesMainPageComponent {

  query: FinancialRulesQuery = Object.assign({}, EmptyFinancialRulesQuery);

  data: FinancialRulesData = Object.assign({}, EmptyFinancialRulesData);

  selectedData: FinancialRuleHolder = EmptyFinancialRuleHolder;

  displayTabbedView = false;

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;


  constructor(private rulesData: FinancialRulesDataService,
              private messageBox: MessageBoxService) { }


  onRulesExplorerEvent(event: EventInfo) {
    switch (event.type as FinancialRulesExplorerEventType) {
      case FinancialRulesExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        Assertion.assertValue(event.payload.query.categoryUID, 'event.payload.query.categoryUID');
        this.setQueryAndClearData(event.payload.query as FinancialRulesQuery);
        this.searchFinancialRules(this.query.categoryUID, this.query);
        return;
      case FinancialRulesExplorerEventType.EXPORT_CLICKED:
        this.messageBox.showInDevelopment('Exportar reglas contables', event.payload);
        return;
      case FinancialRulesExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.entry, ' event.payload.entry');
        Assertion.assertValue(event.payload.entry.uid, 'event.payload.entry.uid');
        this.messageBox.showInDevelopment('Seleccionar regla contable', event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchFinancialRules(categoryUID: string, query: FinancialRulesQuery) {
    this.isLoading = true;

    this.rulesData.searchRules(categoryUID, query)
      .firstValue()
      .then(x => this.setData(x, true))
      .finally(() => this.isLoading = false);
  }


  private setQueryAndClearData(query: FinancialRulesQuery) {
    this.query = Object.assign({}, query);
    this.setData(null, false);
    this.setSelectedData(EmptyFinancialRuleHolder);
  }


  private setData(data: FinancialRulesData,
                  queryExecuted: boolean = true) {
    this.data = Object.assign({}, data?.columns ? data : EmptyFinancialRulesData);
    this.queryExecuted = queryExecuted;
  }


  private setSelectedData(data: FinancialRuleHolder) {
    this.selectedData = data;
    this.displayTabbedView = !isEmpty(this.selectedData.rule);
  }

}
