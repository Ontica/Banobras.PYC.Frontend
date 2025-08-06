/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { Assertion, Empty, EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { SearchServicesAction,
         SearchServicesStateSelector } from '@app/presentation/exported.presentation.types';

import { MessageBoxService } from '@app/shared/services';

import { SearchServicesDataService } from '@app/data-services';

import { EmptyRecordSearchData, RecordSearchData, RecordSearchQuery, RecordSearchResult,
         RecordSearchType } from '@app/models';

import { RecordSearchFilterEventType } from './record-search-filter.component';

import { RecordSearchListEventType } from './record-search-list.component';


@Component({
  selector: 'emp-pyc-record-search',
  templateUrl: './record-search.component.html',
})
export class RecordSearchComponent implements OnInit, OnDestroy {

  data: RecordSearchData = EmptyRecordSearchData;

  cardHint = 'Seleccionar los filtros';

  isLoading = false;

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer,
              private searchServicesData: SearchServicesDataService,
              private messageService: MessageBoxService) {
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
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.resetData(event.payload.query as RecordSearchQuery);
        this.validateSearchType(event.payload.query as RecordSearchQuery);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onRecordSearchListEvent(event: EventInfo) {
    switch (event.type as RecordSearchListEventType) {
      case RecordSearchListEventType.SELECT_RECORD:
        Assertion.assertValue(event.payload.record.recordableSubject.uid, 'event.payload.record.recordableSubject.uid');
        this.messageService.showInDevelopment('Seleccionar registro');
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private resetData(query: RecordSearchQuery) {
    this.saveDataInState(query, [], false);
  }


  private validateSearchType(query: RecordSearchQuery) {
    if (!this.isValidRecordSearchQuery(query)) {
      return;
    }

    switch (query.type) {
      case RecordSearchType.Budget:
      case RecordSearchType.Accounting:
      case RecordSearchType.CashFlow:
      case RecordSearchType.Credit:
        this.messageService.showInDevelopment('Buscador universal');
        return;
      default:
        console.log(`Unhandled search type ${query.type}`);
        return;
    }
  }


  private isValidRecordSearchQuery(query: RecordSearchQuery): boolean {
    return !!query.type && !!query.datePeriod && !!query.keywords;
  }


  private saveDataInState(query: RecordSearchQuery, records: RecordSearchResult[], queryExecuted: boolean) {
    const recordSearchData: RecordSearchData = {
      recordSearchQuery: query,
      queryExecuted: queryExecuted,
      records: records,
    };

    this.uiLayer.dispatch(SearchServicesAction.SET_RECORD_SEARCH_DATA, {recordSearchData});
  }


  private setInitData(data: RecordSearchData) {
    this.data = data;
    this.setText(data);
  }


  private setText(data: RecordSearchData) {
    if (!data.queryExecuted) {
      this.cardHint = 'Seleccionar los filtros';
      return;
    }

    this.cardHint = `${data.records.length} registros encontrados`;
  }

}
