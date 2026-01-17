/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { combineLatest } from 'rxjs';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { BudgetingStateSelector,
         CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { empExpandCollapse, FormHelper, sendEvent } from '@app/shared/utils';

import { SearcherAPIS } from '@app/data-services';

import { BudgetTransactionsQuery, BudgetType, DateRange, EmptyBudgetTransactionsQuery, EmptyDateRange,
         RequestsList, TransactionPartyType, TransactionPartyTypesList, TransactionStages, TransactionStatus,
         TransactionStatusList } from '@app/models';


export enum TransactionsFilterEventType {
  SEARCH_CLICKED = 'BudgetTransactionsFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'BudgetTransactionsFilterComponent.Event.ClearClicked',
}

interface TransactionsFilterFormModel extends FormGroup<{
  operationSourceUID: FormControl<string>;
  status: FormControl<TransactionStatus>;
  keywords: FormControl<string>;
  baseBudgetUID: FormControl<string>;
  transactionTypeUID: FormControl<string>;
  transactionNo: FormControl<string[]>;
  budgetAccountNo: FormControl<string[]>;
  controlNo: FormControl<string[]>;
  datePeriod: FormControl<DateRange>;
  basePartyUID: FormControl<string>;
  partyType: FormControl<TransactionPartyType>;
  partyUID: FormControl<string>;
}> { }

@Component({
  selector: 'emp-bdg-transactions-filter',
  templateUrl: './transactions-filter.component.html',
  animations: [empExpandCollapse],
})
export class BudgetTransactionsFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() stage: TransactionStages = null;

  @Input() query: BudgetTransactionsQuery = Object.assign({}, EmptyBudgetTransactionsQuery);

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() transactionsFilterEvent = new EventEmitter<EventInfo>();

  form: TransactionsFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  operationSourcesList: Identifiable[] = [];

  statusList: Identifiable<TransactionStatus>[] = TransactionStatusList;

  budgetTypesList: BudgetType[] = [];

  transactionTypesList: Identifiable[] = [];

  orgUnitsList: Identifiable[] = [];

  partyTypesList: Identifiable<TransactionPartyType>[] = TransactionPartyTypesList;

  partiesAPI = SearcherAPIS.budgetTransactionsParties;

  selectedParty: Identifiable = null;

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.query) {
      this.setFormData();
    }
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onPartyTypeChanges(partyType: Identifiable<TransactionPartyType>) {
    this.form.controls.partyUID.reset();
    this.selectedParty = null;
  }


  onPartyChanges(party: Identifiable) {
    this.selectedParty = isEmpty(party) ? null : party;
  }


  onShowFiltersClicked() {
    this.showFilters = !this.showFilters;
    this.showFiltersChange.emit(this.showFilters);
  }


  onSearchClicked() {
    if (this.form.valid) {
      sendEvent(this.transactionsFilterEvent, TransactionsFilterEventType.SEARCH_CLICKED,
        { query: this.getFormData() });
    }
  }


  onClearFilters() {
    this.clearFilters();
    sendEvent(this.transactionsFilterEvent, TransactionsFilterEventType.CLEAR_CLICKED,
      { query: this.getFormData() });
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS,
        { requestsList: RequestsList.budgeting }),
      this.helper.select<BudgetType[]>(BudgetingStateSelector.BUDGET_TRANSACTION_TYPES),
      this.helper.select<BudgetType[]>(BudgetingStateSelector.BUDGET_TYPES),
      this.helper.select<Identifiable[]>(BudgetingStateSelector.OPERATION_SOURCES),
    ])
    .subscribe(([a, b, c, d]) => {
      this.orgUnitsList = a;
      this.transactionTypesList = b;
      this.budgetTypesList = c;
      this.operationSourcesList = d;
      this.isLoading = false;
    });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      transactionTypeUID: [null],
      status: [null],
      keywords: [null],
      baseBudgetUID: [null],
      operationSourceUID: [null],
      transactionNo: [null],
      budgetAccountNo: [null],
      controlNo: [null],
      datePeriod: [EmptyDateRange],
      basePartyUID: [null],
      partyType: [TransactionPartyType.RequestedBy],
      partyUID: [null],
    });
  }


  private setFormData() {
    this.form.reset({
      transactionTypeUID: this.query.transactionTypeUID,
      status: this.query.status,
      keywords: this.query.keywords,
      baseBudgetUID: this.query.baseBudgetUID,
      operationSourceUID: this.query.operationSourceUID,
      transactionNo: this.query.transactionNo,
      budgetAccountNo: this.query.budgetAccountNo,
      controlNo: this.query.controlNo,
      datePeriod: { fromDate: this.query.fromDate ?? null, toDate: this.query.toDate ?? null },
      basePartyUID: this.query.basePartyUID,
      partyType: this.query.partyType ?? TransactionPartyType.RequestedBy,
      partyUID: this.query.partyUID,
    });
  }


  private getFormData(): BudgetTransactionsQuery {
    Assertion.assert(!!this.stage, 'Programming error: budget-transactions stage is required.');

    const query: BudgetTransactionsQuery = {
      stage: this.stage,
      status: this.form.value.status ?? null,
      transactionTypeUID: this.form.value.transactionTypeUID ?? null,
      keywords: this.form.value.keywords ?? null,
      baseBudgetUID: this.form.value.baseBudgetUID ?? null,
      operationSourceUID: this.form.value.operationSourceUID ?? null,
      transactionNo: this.form.value.transactionNo ?? null,
      budgetAccountNo: this.form.value.budgetAccountNo ?? null,
      controlNo: this.form.value.controlNo ?? null,
      fromDate: this.form.value.datePeriod?.fromDate ?? '',
      toDate: this.form.value.datePeriod?.toDate ?? '',
      basePartyUID: this.form.value.basePartyUID ?? null,
      partyType: this.form.value.partyType ?? null,
      partyUID: this.form.value.partyUID ?? null,
    };

    return query;
  }


  private clearFilters() {
    this.form.reset();
    this.selectedParty = null;
  }

}
