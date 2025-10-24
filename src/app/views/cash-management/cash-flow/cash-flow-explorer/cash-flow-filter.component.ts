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

import { CashFlowStateSelector, CataloguesStateSelector,
         FinancialStateSelector } from '@app/presentation/exported.presentation.types';

import { FormHelper, sendEvent, empExpandCollapse } from '@app/shared/utils';

import { SearcherAPIS } from '@app/data-services';

import { CashFlowExplorerQuery, CashFlowExplorerTypes, CashFlowExplorerTypesList, DateRange,
         EmptyCashFlowExplorerQuery, EmptyDateRange, RequestsList } from '@app/models';


export enum CashFlowFilterEventType {
  SEARCH_CLICKED = 'CashFlowFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'CashFlowFilterComponent.Event.ClearClicked',
}

interface CashFlowFilterFormModel extends FormGroup<{
  reportType: FormControl<CashFlowExplorerTypes>;
  datePeriod: FormControl<DateRange>;
  keywords: FormControl<string>;
  classificationUID: FormControl<string>;
  operationTypeUID: FormControl<string>;
  partyUID: FormControl<string>;
  projectTypeUID: FormControl<string>;
  projectUID: FormControl<string>;
  financingSourceUID: FormControl<string>;
  financialAccountUID: FormControl<string>;
  programUID: FormControl<string>;
  subprogramUID: FormControl<string>;
}> { }

@Component({
  selector: 'emp-cf-cash-flow-filter',
  templateUrl: './cash-flow-filter.component.html',
  animations: [empExpandCollapse],
})
export class CashFlowFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() query: CashFlowExplorerQuery = Object.assign({}, EmptyCashFlowExplorerQuery);

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() cashFlowFilterEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: CashFlowFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  reportTypesList = CashFlowExplorerTypesList;

  orgUnitsList: Identifiable[] = [];

  classificationsList: FlexibleIdentifiable[] = [];

  operationTypesList: Identifiable[] = [];

  projectTypesList: Identifiable[] = [];

  sourcesList: Identifiable[] = [];

  programsList: Identifiable[] = [];

  subprogramsList: Identifiable[] = [];

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
    if (this.form.invalid) {
      FormHelper.markFormControlsAsTouched(this.form);
      return;
    }

    const payload = {
      reportType: this.getReportType(),
      query: this.getFormData(),
    };

    sendEvent(this.cashFlowFilterEvent, CashFlowFilterEventType.SEARCH_CLICKED, payload);
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
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS, { requestsList: RequestsList.cashflow }),
      this.helper.select<FlexibleIdentifiable[]>(FinancialStateSelector.CLASSIFICATIONS),
      this.helper.select<Identifiable[]>(CashFlowStateSelector.OPERATION_TYPES),
      this.helper.select<Identifiable[]>(FinancialStateSelector.PROJECT_TYPES),
      this.helper.select<Identifiable[]>(CashFlowStateSelector.FINANCING_SOURCES),
      this.helper.select<Identifiable[]>(CashFlowStateSelector.PROGRAMS),
      this.helper.select<Identifiable[]>(CashFlowStateSelector.SUBPROGRAMS),
    ])
    .subscribe(([a, b, c, d, e, f, g]) => {
      this.orgUnitsList = a;
      this.classificationsList = b;
      this.operationTypesList = c;
      this.projectTypesList = d;
      this.sourcesList = e;
      this.programsList = f;
      this.subprogramsList = g;

      this.isLoading = false;
    });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      reportType: [CashFlowExplorerTypes.CashFlow, Validators.required],
      datePeriod: [EmptyDateRange, [Validators.required, Validate.periodRequired]],
      keywords: [null],
      classificationUID: [null],
      operationTypeUID: [null],
      partyUID: [null],
      projectTypeUID: [null],
      projectUID: [null],
      financingSourceUID: [null],
      financialAccountUID: [null],
      programUID: [null],
      subprogramUID: [null],
    });
  }


  private setFormData() {
    const datePeriod = {
      fromDate: this.query.fromDate ?? null, toDate: this.query.toDate ?? null
    };

    this.form.reset({
      datePeriod,
      reportType: this.query.reportType,
      keywords: this.query.keywords,
      classificationUID: this.query.classificationUID,
      operationTypeUID: this.query.operationTypeUID,
      partyUID: this.query.partyUID,
      projectTypeUID: this.query.projectTypeUID,
      projectUID: this.query.projectUID,
      financingSourceUID: this.query.financingSourceUID,
      financialAccountUID: this.query.financialAccountUID,
      programUID: this.query.programUID,
      subprogramUID: this.query.subprogramUID,
    });
  }


  private getReportType(): Identifiable {
    return this.reportTypesList.find(x => x.uid === this.form.value.reportType) ?? null;
  }


  private getFormData(): CashFlowExplorerQuery {
    const query: CashFlowExplorerQuery = {
      reportType: this.form.value.reportType ?? null,
      fromDate: this.form.value.datePeriod.fromDate ?? null,
      toDate: this.form.value.datePeriod.toDate ?? null,
      keywords: this.form.value.keywords ?? null,
      classificationUID: this.form.value.classificationUID ?? null,
      operationTypeUID: this.form.value.operationTypeUID ?? null,
      partyUID: this.form.value.partyUID ?? null,
      projectTypeUID: this.form.value.projectTypeUID ?? null,
      projectUID: this.form.value.projectUID ?? null,
      financingSourceUID: this.form.value.financingSourceUID ?? null,
      financialAccountUID: this.form.value.financialAccountUID ?? null,
      programUID: this.form.value.programUID ?? null,
      subprogramUID: this.form.value.subprogramUID ?? null,
    };

    return query;
  }


  private clearFilters() {
    this.form.reset({
      reportType: this.form.value.reportType,
      datePeriod: EmptyDateRange
    });
    this.selectedProject = null;
    this.selectedAccount = null;
  }

}
