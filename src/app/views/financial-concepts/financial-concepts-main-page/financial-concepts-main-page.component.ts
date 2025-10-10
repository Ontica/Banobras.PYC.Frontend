/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { FinancialConceptsDataService } from '@app/data-services';

import { FinancialConceptDescriptor, FinancialConceptsQuery, EmptyFinancialConceptsQuery,
         FinancialConceptsData, FinancialConceptHolder, FinancialConceptGroupDescriptor,
         EmptyFinancialConceptsData, EmptyFinancialConceptHolder,
         EmptyFinancialConceptGroupDescriptor } from '@app/models';

import {
  FinancialConceptsExplorerEventType
} from '../financial-concepts-explorer/financial-concepts-explorer.component';

import {
  FinancialConceptTabbedViewEventType
} from '../financial-concept-tabbed-view/financial-concept-tabbed-view.component';


@Component({
  selector: 'emp-cf-financial-concepts-main-page',
  templateUrl: './financial-concepts-main-page.component.html',
})
export class FinancialConceptsMainPageComponent {

  group: FinancialConceptGroupDescriptor = Object.assign({}, EmptyFinancialConceptGroupDescriptor);

  query: FinancialConceptsQuery = Object.assign({}, EmptyFinancialConceptsQuery);

  data: FinancialConceptsData = Object.assign({}, EmptyFinancialConceptsData);

  selectedData: FinancialConceptHolder = EmptyFinancialConceptHolder;

  displayTabbedView = false;

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;


  constructor(private financialConceptsData: FinancialConceptsDataService,
              private messageBox: MessageBoxService) { }


  onFinancialConceptsExplorerEvent(event: EventInfo) {
    switch (event.type as FinancialConceptsExplorerEventType) {
      case FinancialConceptsExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.group, 'event.payload.group');
        Assertion.assertValue(event.payload.group.uid, 'event.payload.group.uid');
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearData(event.payload.group, event.payload.query as FinancialConceptsQuery);
        this.searchFinancialConcepts(event.payload.group.uid, this.query);
        return;
      case FinancialConceptsExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.group, 'event.payload.group');
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearData(event.payload.group, event.payload.query as FinancialConceptsQuery);
        return;
      case FinancialConceptsExplorerEventType.EXPORT_CLICKED:
        this.messageBox.showInDevelopment('Exportar agrupación', event.payload);
        return;
      case FinancialConceptsExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.entry, ' event.payload.entry');
        Assertion.assertValue(event.payload.entry.uid, 'event.payload.entry.uid');
        this.getFinancialConcept(event.payload.entry.uid);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onFinancialConceptTabbedViewEvent(event: EventInfo) {
    switch (event.type as FinancialConceptTabbedViewEventType) {
      case FinancialConceptTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedData(EmptyFinancialConceptHolder);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchFinancialConcepts(groupUID: string, query: FinancialConceptsQuery) {
    this.isLoading = true;

    this.financialConceptsData.searchFinancialConceptsByGroup(groupUID, query)
      .firstValue()
      .then(x => this.setData(x.concepts, true))
      .finally(() => this.isLoading = false);
  }


  private getFinancialConcept(conceptsUID: string) {
    this.isLoadingSelection = true;

    this.financialConceptsData.getFinancialConcept(conceptsUID)
      .firstValue()
      .then(x => this.setSelectedData(x))
      .catch(e => this.setSelectedData(EmptyFinancialConceptHolder))
      .finally(() => this.isLoadingSelection = false);
  }


  private setQueryAndClearData(group: FinancialConceptGroupDescriptor,  query: FinancialConceptsQuery) {
    this.group = group;
    this.query = Object.assign({}, query);
    this.setData([], false);
    this.setSelectedData(EmptyFinancialConceptHolder);
  }


  private setData(data: FinancialConceptDescriptor[],
                  queryExecuted: boolean = true) {
    this.data = Object.assign({}, this.data, { query: this.query, entries: data });
    this.queryExecuted = queryExecuted;
  }


  private setSelectedData(data: FinancialConceptHolder) {
    this.selectedData = data;
    this.displayTabbedView = !isEmpty(this.selectedData.concept);
  }

}
