/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';

import { combineLatest } from 'rxjs';

import { Empty, EventInfo, Identifiable } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { CashFlowStateSelector, CashLedgerStateSelector,
         CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { EmptyRecordSearchQuery, RecordSearchQuery, RecordQueryType, RecordQueryTypeList,
         RequestsList } from '@app/models';

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
    operationTypeUID: null,
    keywords: [],
    ledgers: [],
    parties: [],
  };

  queryTypeList = RecordQueryTypeList;

  operationTypesList: Identifiable[] = [];

  ledgersList: Identifiable[] = [];

  orgUnitsList: Identifiable[] = [];

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
    return !!this.formData.queryType && !!this.formData.keywords && (
      !this.displayPeriod ? true : !!this.formData.datePeriod.fromDate && !!this.formData.datePeriod.toDate
    );
  }


  get displayPeriod(): boolean {
    return [RecordQueryType.AccountingEntriesBySubledgerAccount,
            RecordQueryType.AccountingEntriesByAccount,
            RecordQueryType.CashFlowAccountingEntries,
            RecordQueryType.CashFlowEntries,
            RecordQueryType.CreditEntries].includes(this.formData.queryType);
  }

  get displayOperationType(): boolean {
    return [RecordQueryType.AccountTotals].includes(this.formData.queryType);
  }


  get displayLedgers(): boolean {
    return [RecordQueryType.AccountingEntriesByAccount,
            RecordQueryType.AccountingEntriesBySubledgerAccount].includes(this.formData.queryType);
  }


  get displayParties(): boolean {
    return [RecordQueryType.AccountTotals,
            RecordQueryType.CashFlowAccountingEntries,
            RecordQueryType.CashFlowEntries].includes(this.formData.queryType);
  }


  get keywordslabel(): string {
    switch (this.formData.queryType) {
      case RecordQueryType.AccountTotals:
      case RecordQueryType.CashFlowEntries:
        return 'Buscar (conceptos)';
      case RecordQueryType.AccountingEntriesBySubledgerAccount:
      case RecordQueryType.CashFlowAccountingEntries:
        return 'Buscar (auxiliares)';
      case RecordQueryType.AccountingEntriesByAccount:
        return 'Buscar (cuentas)';
      case RecordQueryType.CreditEntries:
        return 'Buscar (No. de créditos SIC)';
      default:
        return 'Buscar';
    }
  }


  onQueryTypeChanges() {
    this.formData.keywords = [];
  }


  onSearchClicked() {
    const payload = {
      queryValid: this.isFormValid,
      queryType: RecordQueryTypeList.find(x => x.uid === this.formData.queryType) ?? Empty,
      query: this.getRecordSearchQuery()
    };

    sendEvent(this.recordSearchFilterEvent, RecordSearchFilterEventType.SEARCH_CLICKED, payload);
  }


  private loadDataList() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS, { requestsList: RequestsList.cashflow }),
      this.helper.select<Identifiable[]>(CashLedgerStateSelector.ACCOUNTING_LEDGERS),
      this.helper.select<Identifiable[]>(CashFlowStateSelector.OPERATION_TYPES),
    ])
    .subscribe(([a, b, c]) => {
      this.orgUnitsList = a;
      this.ledgersList = b;
      this.operationTypesList = c;
      this.isLoading = false;
    });
  }


  private initFormData() {
    this.formData = {
      queryType: this.query.queryType,
      datePeriod: { fromDate: this.query.fromDate, toDate: this.query.toDate },
      operationTypeUID: this.query.operationTypeUID,
      keywords: this.query.keywords,
      ledgers: this.query.ledgers,
      parties: this.query.parties,
    };
  }


  private getRecordSearchQuery(): RecordSearchQuery {
    const query: RecordSearchQuery = {
      queryType: this.formData.queryType,
      keywords: this.formData.keywords,
      fromDate: this.displayPeriod ? this.formData.datePeriod.fromDate : null,
      toDate: this.displayPeriod ? this.formData.datePeriod.toDate : null,
      operationTypeUID: this.displayOperationType ? this.formData.operationTypeUID : null,
      ledgers: this.displayLedgers ? this.formData.ledgers : null,
      parties: this.displayParties ? this.formData.parties : null,
    };

    return query;
  }

}
