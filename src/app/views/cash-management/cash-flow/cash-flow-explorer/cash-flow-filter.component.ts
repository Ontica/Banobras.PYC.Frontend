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

import { EventInfo, Identifiable, isEmpty, Validate } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { CashFlowStateSelector, CashLedgerStateSelector, CataloguesStateSelector,
         FinancialProjectsStateSelector } from '@app/presentation/exported.presentation.types';

import { FormHelper, sendEvent, empExpandCollapse } from '@app/shared/utils';

import { SearcherAPIS } from '@app/data-services';

import { CashFlowQuery, CashFlowReportTypes, CashFlowReportTypesList, DateRange, EmptyCashFlowQuery,
         EmptyDateRange, RequestsList } from '@app/models';


export enum CashFlowFilterEventType {
  SEARCH_CLICKED = 'CashFlowFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'CashFlowFilterComponent.Event.ClearClicked',
}

interface CashFlowFilterFormModel extends FormGroup<{
  reportType: FormControl<CashFlowReportTypes>;
  accountingDate: FormControl<DateRange>;
  accountingLedgerUID: FormControl<string>;
  partyUID: FormControl<string>;
  projectTypeUID: FormControl<string>;
  projectUID: FormControl<string>;
  financialAccountUID: FormControl<string>;
  operationTypeUID: FormControl<string>;
  financingSourceUID: FormControl<string>;
  programUID: FormControl<string>;
  subprogramUID: FormControl<string>;
}> { }

@Component({
  selector: 'emp-cf-cash-flow-filter',
  templateUrl: './cash-flow-filter.component.html',
  animations: [empExpandCollapse],
})
export class CashFlowFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() query: CashFlowQuery = Object.assign({}, EmptyCashFlowQuery);

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() cashFlowFilterEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: CashFlowFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  reportTypesList = CashFlowReportTypesList;

  accountingLedgersList: Identifiable[] = [];

  orgUnitsList: Identifiable[] = [];

  projectTypesList: Identifiable[] = [];

  programsList: Identifiable[] = [];

  subprogramsList: Identifiable[] = [];

  sourcesList: Identifiable[] = [];

  operationTypesList: Identifiable[] = [];

  projectsAPI = SearcherAPIS.cashFlowProjects;

  accountsAPI = SearcherAPIS.cashFlowAccounts;

  selectedProject: Identifiable = null;

  selectedAccount: Identifiable = null;


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


  onAccountChanges(account: Identifiable) {
    this.selectedAccount = isEmpty(account) ? null : account;
  }


  onShowFiltersClicked() {
    this.showFilters = !this.showFilters;
    this.showFiltersChange.emit(this.showFilters);
  }


  onSearchClicked() {
    if (FormHelper.isFormReadyAndInvalidate(this.form)) {
      sendEvent(this.cashFlowFilterEvent, CashFlowFilterEventType.SEARCH_CLICKED, {
        reportType: this.getReportType(),
        query: this.getFormData(),
      });
    }
  }


  onClearFilters() {
    this.clearFilters();
    sendEvent(this.cashFlowFilterEvent, CashFlowFilterEventType.CLEAR_CLICKED, {
      reportType: this.getReportType(),
      query: this.getFormData(),
    });
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CashLedgerStateSelector.ACCOUNTING_LEDGERS),
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS, { requestsList: RequestsList.cashflow }),
      this.helper.select<Identifiable[]>(FinancialProjectsStateSelector.PROJECT_TYPES),
      this.helper.select<Identifiable[]>(CashFlowStateSelector.FINANCING_SOURCES),
      this.helper.select<Identifiable[]>(CashFlowStateSelector.OPERATION_TYPES),
      this.helper.select<Identifiable[]>(CashFlowStateSelector.PROGRAMS),
      this.helper.select<Identifiable[]>(CashFlowStateSelector.SUBPROGRAMS),
    ])
    .subscribe(([a, b, c, d, e, f, g]) => {
      this.accountingLedgersList = a;
      this.orgUnitsList = b;
      this.projectTypesList = c;
      this.sourcesList = d;
      this.operationTypesList = e;
      this.programsList = f;
      this.subprogramsList = g;

      this.isLoading = false;
    });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      reportType: [CashFlowReportTypes.CashFlow, Validators.required],
      accountingDate: [EmptyDateRange, [Validators.required, Validate.periodRequired]],
      accountingLedgerUID: [null],
      partyUID: [null],
      projectTypeUID: [null],
      projectUID: [null],
      financialAccountUID: [null],
      operationTypeUID: [null],
      programUID: [null],
      subprogramUID: [null],
      financingSourceUID: [null],
    });
  }


  private setFormData() {
    const accountingDate = {
      fromDate: this.query.fromAccountingDate ?? null, toDate: this.query.toAccountingDate ?? null
    };

    this.form.reset({
      accountingDate,
      reportType: this.query.reportType,
      accountingLedgerUID: this.query.accountingLedgerUID,
      partyUID: this.query.partyUID,
      projectTypeUID: this.query.projectTypeUID,
      projectUID: this.query.projectUID,
      financialAccountUID: this.query.financialAccountUID,
      operationTypeUID: this.query.operationTypeUID,
      programUID: this.query.programUID,
      subprogramUID: this.query.subprogramUID,
      financingSourceUID: this.query.financingSourceUID,
    });
  }


  private getReportType(): Identifiable {
    return this.reportTypesList.find(x => x.uid === this.form.value.reportType) ?? null;
  }


  private getFormData(): CashFlowQuery {
    const query: CashFlowQuery = {
      reportType: this.form.value.reportType ?? null,
      fromAccountingDate: this.form.value.accountingDate.fromDate ?? null,
      toAccountingDate: this.form.value.accountingDate.toDate ?? null,
      accountingLedgerUID: this.form.value.accountingLedgerUID ?? null,
      partyUID: this.form.value.partyUID ?? null,
      projectTypeUID: this.form.value.projectTypeUID ?? null,
      projectUID: this.form.value.projectUID ?? null,
      financialAccountUID: this.form.value.financialAccountUID ?? null,
      operationTypeUID: this.form.value.operationTypeUID ?? null,
      programUID: this.form.value.programUID ?? null,
      subprogramUID: this.form.value.subprogramUID ?? null,
      financingSourceUID: this.form.value.financingSourceUID ?? null,
    };

    return query;
  }


  private clearFilters() {
    this.form.reset({
      reportType: this.form.value.reportType,
      accountingDate: EmptyDateRange
    });
    this.selectedProject = null;
    this.selectedAccount = null;
  }

}
