/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { Assertion, EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { SearchServicesAction,
         SearchServicesStateSelector } from '@app/presentation/exported.presentation.types';

import { MessageBoxService } from '@app/shared/services';

import { SearchServicesDataService } from '@app/data-services';

import { EmptyRecordSearchData, RecordSearchData, RecordSearchQuery, RecordQueryType } from '@app/models';

import { DataTableEventType } from '@app/views/_reports-controls/data-table/data-table.component';

import { RecordSearchFilterEventType } from './record-search-filter.component';


@Component({
  selector: 'emp-pyc-record-search',
  templateUrl: './record-search.component.html',
})
export class RecordSearchComponent implements OnInit, OnDestroy {

  data: RecordSearchData = Object.assign({}, EmptyRecordSearchData);

  cardHint = 'Seleccionar los filtros';

  isLoading = false;

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private searchData: SearchServicesDataService,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.helper.select<any>(SearchServicesStateSelector.RECORD_SEARCH_DATA)
      .subscribe(x => this.setInitData(x));
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onRecordSearchFilterEvent(event: EventInfo) {
    switch (event.type as RecordSearchFilterEventType) {
      case RecordSearchFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.queryType, 'event.payload.queryType');
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.validateQueryType(event.payload.queryValid,
                               event.payload.queryType,
                               event.payload.query as RecordSearchQuery);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onDataTableEvent(event: EventInfo) {
    switch (event.type as DataTableEventType) {
      case DataTableEventType.COUNT_FILTERED_ENTRIES:
        Assertion.assertValue(event.payload.displayedEntriesMessage, 'event.payload.displayedEntriesMessage');
        this.setText(event.payload.displayedEntriesMessage as string);
        return;
      case DataTableEventType.EXPORT_DATA:
        this.messageBox.showInDevelopment('Exportar ' + this.data.queryType.name.toLowerCase());
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private validateQueryType(queryValid: boolean, queryType: Identifiable<RecordQueryType>, query: RecordSearchQuery) {
    if (!queryValid) {
      return;
    }

    this.resetRecords(queryType, query);
    this.searchRecords(queryType, query);
  }


  private resetRecords(queryType: Identifiable<RecordQueryType>, query: RecordSearchQuery) {
    this.resolveSearchRecords(queryType, query, EmptyRecordSearchData, false);
  }


  private searchRecords(queryType: Identifiable<RecordQueryType>, query: RecordSearchQuery) {
    this.isLoading = true;

    this.searchData.searchRecords(queryType.uid as RecordQueryType, query)
      .firstValue()
      .then(x => this.resolveSearchRecords(queryType, query, x))
      .finally(() => this.isLoading = false);
  }


  private resolveSearchRecords(queryType: Identifiable<RecordQueryType>, query: RecordSearchQuery,
                               result: RecordSearchData, queryExecuted: boolean = true) {
    const data: RecordSearchData = {
      queryType,
      query,
      queryExecuted,
      columns: result?.columns ?? [],
      entries: result?.entries ?? [],
    };

    this.data = data;
    this.saveDataInState(data);
  }


  private saveDataInState(data: RecordSearchData) {
    this.uiLayer.dispatch(SearchServicesAction.SET_RECORD_SEARCH_DATA, {data});
  }


  private setInitData(data: RecordSearchData) {
    this.data = data;
    this.setText();
  }


  private setText(displayedEntriesMessage?: string) {
    if (!this.data.queryExecuted) {
      this.cardHint = 'Seleccionar los filtros';
      return;
    }

    if (displayedEntriesMessage) {
      this.cardHint = `${this.data.queryType.name} - ${displayedEntriesMessage}`;
      return;
    }

    this.cardHint = `${this.data.queryType.name} - ${this.data.entries.length} registros encontrados`;
  }

}
