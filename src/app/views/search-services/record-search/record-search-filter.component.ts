/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';

import { Empty, EventInfo, Identifiable } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { CashLedgerStateSelector } from '@app/presentation/exported.presentation.types';

import { EmptyRecordSearchQuery, RecordSearchQuery, RecordQueryType, RecordQueryTypeList } from '@app/models';

export enum RecordSearchFilterEventType {
  SEARCH_CLICKED = 'RecordSearchFilterComponent.Event.SearchClicked',
}

@Component({
  selector: 'emp-pyc-record-search-filter',
  templateUrl: './record-search-filter.component.html',
})
export class RecordSearchFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() query: RecordSearchQuery = EmptyRecordSearchQuery;

  @Output() recordSearchFilterEvent = new EventEmitter<EventInfo>();

  formData = {
    queryType: RecordQueryType.AccountTotals,
    datePeriod: { fromDate: null, toDate: null },
    accounts: [],
    ledgers: [],
  };

  queryTypeList: Identifiable[] = RecordQueryTypeList;

  ledgersList: Identifiable[] = [];

  isLoading = false;

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges() {
    this.initFormData();
  }


  ngOnInit() {
    this.loadDataList();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get isFormValid(): boolean {
    return !!this.formData.queryType && !!this.formData.datePeriod.fromDate && !!this.formData.datePeriod.toDate;
  }


  onSearchClicked() {
    const payload = {
      queryType: RecordQueryTypeList.find(x => x.uid === this.formData.queryType) ?? Empty,
      query: this.getRecordSearchQuery()
    };

    sendEvent(this.recordSearchFilterEvent, RecordSearchFilterEventType.SEARCH_CLICKED, payload);
  }


  private loadDataList() {
    this.isLoading = true;

    this.helper.select<Identifiable[]>(CashLedgerStateSelector.ACCOUNTING_LEDGERS)
      .subscribe(x => {
        this.ledgersList = x;
        this.isLoading = false;
      });
  }


  private initFormData() {
    this.formData = {
      queryType: this.query.queryType,
      datePeriod: { fromDate: this.query.fromDate, toDate: this.query.toDate },
      accounts: this.query.accounts,
      ledgers: this.query.ledgers,
    };
  }


  private getRecordSearchQuery(): RecordSearchQuery {
    const query: RecordSearchQuery = {
      queryType: this.formData.queryType ?? null,
      fromDate: this.formData.datePeriod.fromDate,
      toDate: this.formData.datePeriod.toDate,
      accounts: this.formData.accounts,
      ledgers: this.formData.ledgers,
    };

    return query;
  }

}
