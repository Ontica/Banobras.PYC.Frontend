/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';

import { combineLatest } from 'rxjs';

import { Empty, EventInfo, FlexibleIdentifiable, Identifiable, SessionService } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { BudgetingStateSelector, CashFlowStateSelector, CataloguesStateSelector,
         FinancialStateSelector } from '@app/presentation/exported.presentation.types';

import { EmptyRecordSearchQuery, RecordSearchQuery, RecordQueryType, RecordQueryTypeList,
         RequestsList } from '@app/models';

export enum RecordSearchFilterEventType {
  SEARCH_CLICKED = 'RecordSearchFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'RecordSearchFilterComponent.Event.ClearClicked',
}

@Component({
  selector: 'emp-pyc-record-search-filter',
  templateUrl: './record-search-filter.component.html',
})
export class RecordSearchFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() query: RecordSearchQuery = EmptyRecordSearchQuery;

  @Output() recordSearchFilterEvent = new EventEmitter<EventInfo>();

  formData = {
    queryType: null,
    classificationUID: null,
    operationTypeUID: null,
    budgetTypeUID: null,
    partyUID: null,
    datePeriod: { fromDate: null, toDate: null },
    keywords: [],
  };

  queryTypeList = [];

  classificationsList: FlexibleIdentifiable[] = [];

  operationTypesList: Identifiable[] = [];

  orgUnitsList: Identifiable[] = [];

  budgetTypesList: Identifiable[] = [];

  isLoading = false;

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private session: SessionService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges() {
    this.initFormData();
  }


  ngOnInit() {
    this.setQueryTypeList();
    this.loadDataList();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get isFormValid(): boolean {
    return !!this.formData.queryType && (
      !this.displayPeriod ? true : !!this.formData.datePeriod.fromDate && !!this.formData.datePeriod.toDate
    );
  }


  get displayPeriod(): boolean {
    return [RecordQueryType.CashFlowAccountingEntries,
            RecordQueryType.CreditEntries].includes(this.formData.queryType);
  }


  get displayClassification(): boolean {
    return [RecordQueryType.AccountTotals].includes(this.formData.queryType);
  }


  get displayBudgetType(): boolean {
    return [RecordQueryType.verificationNumbers].includes(this.formData.queryType);
  }


  get displayOperationType(): boolean {
    return [RecordQueryType.AccountTotals].includes(this.formData.queryType);
  }


  get displayParties(): boolean {
    return [RecordQueryType.AccountTotals,
            RecordQueryType.CashFlowAccountingEntries].includes(this.formData.queryType);
  }


  get keywordslabel(): string {
    switch (this.formData.queryType) {
      case RecordQueryType.AccountTotals:
        return 'Buscar (conceptos)';
      case RecordQueryType.CashFlowAccountingEntries:
        return 'Buscar (auxiliares)';
      case RecordQueryType.CreditEntries:
        return 'Buscar (No. de créditos SIC)';
      case RecordQueryType.verificationNumbers:
        return 'Buscar (No. verificación)';
      default:
        return 'Buscar';
    }
  }


  get defaultQueryType(): RecordQueryType {
    const defaultQueryType: RecordQueryType = this.queryTypeList?.[0]?.uid ?? null;
    const queryType = this.query.queryType ?? defaultQueryType;

    return queryType;
  }


  onQueryTypeChanges() {
    this.onClearFilters();
  }


  onSearchClicked() {
    const payload = {
      queryValid: this.isFormValid,
      queryType: RecordQueryTypeList.find(x => x.uid === this.formData.queryType) ?? Empty,
      query: this.getRecordSearchQuery()
    };

    sendEvent(this.recordSearchFilterEvent, RecordSearchFilterEventType.SEARCH_CLICKED, payload);
  }


  onClearFilters() {
    this.clearFilters();

    const payload = {
      queryValid: this.isFormValid,
      queryType: RecordQueryTypeList.find(x => x.uid === this.formData.queryType) ?? Empty,
      query: this.getRecordSearchQuery()
    };

    sendEvent(this.recordSearchFilterEvent, RecordSearchFilterEventType.CLEAR_CLICKED, payload);
  }


  private setQueryTypeList() {
    this.queryTypeList = RecordQueryTypeList.filter(x => this.session.hasPermission(x.permission));
    this.formData.queryType = this.defaultQueryType;
  }


  private loadDataList() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<FlexibleIdentifiable[]>(FinancialStateSelector.CONCEPTS_CLASSIFICATIONS),
      this.helper.select<Identifiable[]>(CashFlowStateSelector.OPERATION_TYPES),
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS, { requestsList: RequestsList.cashflow }),
      this.helper.select<Identifiable[]>(BudgetingStateSelector.BUDGET_TYPES),
    ])
    .subscribe(([a, b, c, d]) => {
      this.classificationsList = a;
      this.operationTypesList = b;
      this.orgUnitsList = c;
      this.budgetTypesList = d;
      this.isLoading = false;
    });
  }


  private initFormData() {
    this.formData = {
      queryType: this.defaultQueryType,
      classificationUID: this.query.classificationUID,
      operationTypeUID: this.query.operationTypeUID,
      budgetTypeUID: this.query.budgetTypeUID,
      partyUID: this.query.partyUID,
      keywords: this.query.keywords,
      datePeriod: { fromDate: this.query.fromDate, toDate: this.query.toDate },
    };
  }


  private getRecordSearchQuery(): RecordSearchQuery {
    const query: RecordSearchQuery = {
      queryType: this.formData.queryType,
      classificationUID: this.displayClassification ? this.formData.classificationUID : null,
      operationTypeUID: this.displayOperationType ? this.formData.operationTypeUID : null,
      budgetTypeUID: this.displayBudgetType ? this.formData.budgetTypeUID : null,
      partyUID: this.displayParties ? this.formData.partyUID : null,
      fromDate: this.displayPeriod ? this.formData.datePeriod.fromDate : null,
      toDate: this.displayPeriod ? this.formData.datePeriod.toDate : null,
      keywords: this.formData.keywords,
    };

    return query;
  }


  private clearFilters() {
    this.formData = {
      queryType: this.formData.queryType,
      classificationUID: null,
      operationTypeUID: null,
      budgetTypeUID: null,
      partyUID: null,
      datePeriod: { fromDate: null, toDate: null },
      keywords: [],
    };
  }

}
