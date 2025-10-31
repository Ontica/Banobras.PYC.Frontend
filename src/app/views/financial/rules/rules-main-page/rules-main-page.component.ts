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

import { DataTableColumnType, FinancialRulesQuery, FinancialRulesData, FinancialRule,
         EmptyFinancialRulesQuery, EmptyFinancialRulesData, EmptyFinancialRule } from '@app/models';

import {
  FinancialRulesExplorerEventType
} from '../rules-explorer/rules-explorer.component';

import { FinancialRuleCreatorEventType } from '../rule/rule-creator.component';

import { FinancialRuleTabbedViewEventType } from '../rule-tabbed-view/rule-tabbed-view.component';


@Component({
  selector: 'emp-financial-rules-main-page',
  templateUrl: './rules-main-page.component.html',
})
export class FinancialRulesMainPageComponent {

  query: FinancialRulesQuery = Object.assign({}, EmptyFinancialRulesQuery);

  data: FinancialRulesData = Object.assign({}, EmptyFinancialRulesData);

  selectedData: FinancialRule = EmptyFinancialRule;

  displayTabbedView = false;

  displayCreator = false;

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;

  dataIDField = null;

  constructor(private rulesData: FinancialRulesDataService,
              private messageBox: MessageBoxService) { }


  onRuleCreatorEvent(event: EventInfo) {
    switch (event.type as FinancialRuleCreatorEventType) {
      case FinancialRuleCreatorEventType.CLOSE_MODAL_CLICKED:
        this.displayCreator = false;
        return;
      case FinancialRuleCreatorEventType.CREATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        this.displayCreator = false;
        this.refreshAndSetData(event.payload.data as FinancialRule);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onRulesExplorerEvent(event: EventInfo) {
    switch (event.type as FinancialRulesExplorerEventType) {
      case FinancialRulesExplorerEventType.CREATE_CLICKED:
        this.displayCreator = true;
        return;
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
        this.getFinancialRule(event.payload.entry.uid);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onRuleTabbedViewEvent(event: EventInfo) {
    switch (event.type as FinancialRuleTabbedViewEventType) {
      case FinancialRuleTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedData(EmptyFinancialRule);
        return;
      case FinancialRuleTabbedViewEventType.DATA_UPDATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        this.refreshAndSetData(event.payload.data as FinancialRule);
        return;
      case FinancialRuleTabbedViewEventType.DATA_DELETED:
        Assertion.assertValue(event.payload.dataUID, 'event.payload.dataUID');
        this.removeItemFromList(event.payload.dataUID);
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


  private getFinancialRule(rulesUID: string) {
    this.isLoadingSelection = true;

    this.rulesData.getRule(rulesUID)
      .firstValue()
      .then(x => this.setSelectedData(x))
      .catch(e => this.setSelectedData(EmptyFinancialRule))
      .finally(() => this.isLoadingSelection = false);
  }


  private setQueryAndClearData(query: FinancialRulesQuery) {
    this.query = Object.assign({}, query);
    this.setData(null, false);
    this.setSelectedData(EmptyFinancialRule);
  }


  private setData(data: FinancialRulesData,
                  queryExecuted: boolean = true) {
    this.data = Object.assign({}, data?.columns ? data : EmptyFinancialRulesData);
    this.dataIDField = this.data.columns.find(x => x.type === DataTableColumnType.text_link)?.field ?? null;
    this.queryExecuted = queryExecuted;
  }


  private setSelectedData(data: FinancialRule) {
    this.selectedData = data;
    this.displayTabbedView = !isEmpty(this.selectedData);
  }


  private refreshAndSetData(data: FinancialRule) {
    this.resetQuery(data.category.uid);
    this.searchFinancialRules(this.query.categoryUID, this.query);
    this.setSelectedData(data);
  }


  private resetQuery(categoryUID: string) {
    this.query = {
      categoryUID,
      date: '',
      keywords: '',
    };
  }


  private removeItemFromList(dataUID: string) {
    const dataListNew = this.data.entries.filter(x => x.uid !== dataUID);
    const dataNew = Object.assign({}, this.data, { entries: dataListNew });
    this.setData(dataNew);
    this.setSelectedData(EmptyFinancialRule);
  }

}
