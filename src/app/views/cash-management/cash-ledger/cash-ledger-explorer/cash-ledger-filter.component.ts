/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { combineLatest } from 'rxjs';

import { EventInfo, FlexibleIdentifiable, Identifiable, isEmpty, Validate } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { CashLedgerStateSelector, CataloguesStateSelector,
         FinancialProjectsStateSelector } from '@app/presentation/exported.presentation.types';

import { empExpandCollapse, FormHelper, sendEvent } from '@app/shared/utils';

import { SearcherAPIS } from '@app/data-services';

import { CashAccountStatusQueryList, CashLedgerQuery, CashLedgerQueryType, CashLedgerQueryTypesList,
         CashTransactionStatusList, DateRange, EmptyCashLedgerQuery, EmptyDateRange, RequestsList,
         TransactionStatus } from '@app/models';


export enum CashLedgerFilterEventType {
  SEARCH_CLICKED = 'CashLedgerFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'CashLedgerFilterComponent.Event.ClearClicked',
}

interface CashLedgerFilterFormModel extends FormGroup<{
  queryType: FormControl<CashLedgerQueryType>;
  accountingDate: FormControl<DateRange>;
  keywords: FormControl<string>;
  transactionStatus: FormControl<TransactionStatus>;
  cashAccountStatus: FormControl<FlexibleIdentifiable>;
  cashAccounts : FormControl<string[]>;
  voucherAccounts : FormControl<string[]>;
  subledgerAccounts : FormControl<string[]>;
  verificationNumbers : FormControl<string[]>;
  transactionTypeUID: FormControl<string>;
  accountingLedgerUID: FormControl<string>;
  sourceUID: FormControl<string>;
  voucherTypeUID: FormControl<string>;
  entriesKeywords: FormControl<string>;
  recordingDate: FormControl<DateRange>;
  partyUID: FormControl<string>;
  projectTypeUID: FormControl<string>;
  projectUID: FormControl<string>;
  projectAccountUID: FormControl<string>;
}> { }

@Component({
  selector: 'emp-cf-cash-ledger-filter',
  templateUrl: './cash-ledger-filter.component.html',
  animations: [empExpandCollapse],
})
export class CashLedgerFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() queryType: CashLedgerQueryType = CashLedgerQueryType.transactions;

  @Input() query: CashLedgerQuery = Object.assign({}, EmptyCashLedgerQuery);

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() cashLedgerFilterEvent = new EventEmitter<EventInfo>();

  CashLedgerQueryTypes = CashLedgerQueryType;

  form: CashLedgerFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  queryTypesList = CashLedgerQueryTypesList;

  transactionStatusList = CashTransactionStatusList;

  cashAccountStatusList = CashAccountStatusQueryList;

  orgUnitsList: Identifiable[] = [];

  transactionTypesList: Identifiable[] = [];

  accountingLedgersList: Identifiable[] = [];

  sourcesList: Identifiable[] = [];

  voucherTypesList: Identifiable[] = [];

  projectTypesList: Identifiable[] = [];

  projectAccountsList: Identifiable[] = [];

  projectsAPI = SearcherAPIS.cashFlowProjects;

  projectAccountsAPI = SearcherAPIS.cashFlowAccounts;

  selectedProject: Identifiable = null;

  selectedProjectAccount: Identifiable = null;

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


  onProjectChanges(project: Identifiable) {
    this.selectedProject = isEmpty(project) ? null : project;
  }


  onProjectAccountChanges(account: Identifiable) {
    this.selectedProjectAccount = isEmpty(account) ? null : account;
  }


  onShowFiltersClicked() {
    this.showFilters = !this.showFilters;
    this.showFiltersChange.emit(this.showFilters);
  }


  onSearchClicked() {
    if (FormHelper.isFormReadyAndInvalidate(this.form)) {
      sendEvent(this.cashLedgerFilterEvent, CashLedgerFilterEventType.SEARCH_CLICKED,
        { queryType: this.form.value.queryType, query: this.getFormData() });
    }
  }


  onClearFilters() {
    this.clearFilters();
    sendEvent(this.cashLedgerFilterEvent, CashLedgerFilterEventType.CLEAR_CLICKED,
      { queryType: this.form.value.queryType, query: this.getFormData() });
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CashLedgerStateSelector.ACCOUNTING_LEDGERS),
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS, { requestsList: RequestsList.cashflow }),
      this.helper.select<Identifiable[]>(FinancialProjectsStateSelector.PROJECT_TYPES),
      this.helper.select<Identifiable[]>(CashLedgerStateSelector.TRANSACTION_SOURCES),
      this.helper.select<Identifiable[]>(CashLedgerStateSelector.TRANSACTION_TYPES),
      this.helper.select<Identifiable[]>(CashLedgerStateSelector.VOUCHER_TYPES),
    ])
    .subscribe(([a, b, c, d, e, f]) => {
      this.accountingLedgersList = a;
      this.orgUnitsList = b;
      this.projectTypesList = c;
      this.sourcesList = d
      this.transactionTypesList = e;
      this.voucherTypesList = f;
      this.isLoading = false;
    });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      queryType: [CashLedgerQueryType.transactions, Validators.required],
      accountingDate: [EmptyDateRange, [Validators.required, Validate.periodRequired]],
      keywords: [null],
      transactionStatus: [null],
      cashAccountStatus: [null],
      cashAccounts: [null],
      voucherAccounts: [null],
      subledgerAccounts: [null],
      verificationNumbers: [null],
      transactionTypeUID: [null],
      accountingLedgerUID: [null],
      sourceUID: [null],
      voucherTypeUID: [null],
      entriesKeywords: [null],
      projectTypeUID: [null],
      recordingDate: [EmptyDateRange],
      projectUID: [null],
      projectAccountUID: [null],
      partyUID: [null],
    });
  }


  private setFormData() {
    this.form.reset({
      queryType: this.queryType,
      transactionStatus: this.query.transactionStatus,
      cashAccountStatus: this.cashAccountStatusList.find(x => x.id === this.query.cashAccountStatus) ?? null,
      accountingDate: { fromDate: this.query.fromAccountingDate ?? null, toDate: this.query.toAccountingDate ?? null },
      keywords: this.query.keywords,
      cashAccounts: this.query.cashAccounts,
      voucherAccounts: this.query.voucherAccounts,
      subledgerAccounts: this.query.subledgerAccounts,
      verificationNumbers: this.query.verificationNumbers,
      transactionTypeUID: this.query.transactionTypeUID,
      accountingLedgerUID: this.query.accountingLedgerUID,
      sourceUID: this.query.sourceUID,
      voucherTypeUID: this.query.voucherTypeUID,
      entriesKeywords: this.query.entriesKeywords,
      recordingDate: { fromDate: this.query.fromRecordingDate ?? null, toDate: this.query.toRecordingDate ?? null },
      projectTypeUID: this.query.projectTypeUID,
      projectUID: this.query.projectUID,
      projectAccountUID: this.query.projectAccountUID,
      partyUID: this.query.partyUID,
    });
  }


  private getFormData(): CashLedgerQuery {
    const query: CashLedgerQuery = {
      transactionStatus: this.form.value.transactionStatus ?? null,
      cashAccountStatus: this.form.value.cashAccountStatus?.id ?? null,
      keywords: this.form.value.keywords ?? null,
      cashAccounts: this.form.value.cashAccounts ?? null,
      voucherAccounts: this.form.value.voucherAccounts ?? null,
      subledgerAccounts: this.form.value.subledgerAccounts ?? null,
      verificationNumbers: this.form.value.verificationNumbers ?? null,
      transactionTypeUID: this.form.value.transactionTypeUID ?? null,
      voucherTypeUID: this.form.value.voucherTypeUID ?? null,
      entriesKeywords: this.form.value.entriesKeywords ?? null,
      projectTypeUID: this.form.value.projectTypeUID ?? null,
      accountingLedgerUID: this.form.value.accountingLedgerUID ?? null,
      sourceUID: this.form.value.sourceUID ?? null,
      projectUID: this.form.value.projectUID ?? null,
      projectAccountUID: this.form.value.projectAccountUID ?? null,
      partyUID: this.form.value.partyUID ?? null,
    };

    this.validateFieldsNoRequired(query);

    return query;
  }


  private validateFieldsNoRequired(query: CashLedgerQuery) {
    if (this.form.value.recordingDate.fromDate) {
      query.fromRecordingDate = this.form.value.recordingDate.fromDate;
    }

    if (this.form.value.recordingDate.toDate) {
      query.toRecordingDate = this.form.value.recordingDate.toDate;
    }

    if (this.form.value.accountingDate.fromDate) {
      query.fromAccountingDate = this.form.value.accountingDate.fromDate;
    }

    if (this.form.value.accountingDate.toDate) {
      query.toAccountingDate = this.form.value.accountingDate.toDate;
    }
  }


  private clearFilters() {
    this.form.reset({queryType: this.queryType, recordingDate: EmptyDateRange, accountingDate: EmptyDateRange});
    this.selectedProject = null;
    this.selectedProjectAccount = null;
  }

}
