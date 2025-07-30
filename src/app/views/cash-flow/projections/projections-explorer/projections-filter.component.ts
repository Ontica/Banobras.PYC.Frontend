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

import { CashFlowStateSelector,
         CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { empExpandCollapse, FormHelper, sendEvent } from '@app/shared/utils';

import { SearcherAPIS } from '@app/data-services';

import { CashFlowProjectionsQuery, DateRange, EmptyCashFlowProjectionsQuery, EmptyDateRange, RequestsList,
         TransactionDateType, TransactionDateTypesList, TransactionPartyType, TransactionPartyTypesList,
         TransactionStages, TransactionStatus, TransactionStatusList } from '@app/models';


export enum ProjectionsFilterEventType {
  SEARCH_CLICKED = 'CashFlowProjectionsFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'CashFlowProjectionsFilterComponent.Event.ClearClicked',
}

interface ProjectionsFilterFormModel extends FormGroup<{
  partyUID: FormControl<string>;
  status: FormControl<TransactionStatus>;
  keywords: FormControl<string>;
  planUID: FormControl<string>;
  projectionTypeUID: FormControl<string>;
  projectTypeUID: FormControl<string>;
  sourceUID: FormControl<string>;
  projectUID: FormControl<string>;
  accountUID: FormControl<string>;
  projectionsNo: FormControl<string[]>;
  entriesKeywords: FormControl<string>;
  tags: FormControl<string[]>;
  dateType: FormControl<TransactionDateType>;
  datePeriod: FormControl<DateRange>;
  searchPartyRole: FormControl<TransactionPartyType>;
  searchPartyUID: FormControl<string>;
}> { }

@Component({
  selector: 'emp-cf-projections-filter',
  templateUrl: './projections-filter.component.html',
  animations: [empExpandCollapse],
})
export class CashFlowProjectionsFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() stage: TransactionStages = null;

  @Input() query: CashFlowProjectionsQuery = Object.assign({}, EmptyCashFlowProjectionsQuery);

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() projectionsFilterEvent = new EventEmitter<EventInfo>();

  form: ProjectionsFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  statusList: Identifiable<TransactionStatus>[] = TransactionStatusList;

  orgUnitsList: Identifiable[] = [];

  projectionTypesList: Identifiable[] = [];

  plansList: Identifiable[] = [];

  projectTypesList: Identifiable[] = [];

  operationSourcesList: Identifiable[] = [];

  dateTypesList: Identifiable<TransactionDateType>[] = TransactionDateTypesList;

  searchPartyRolesList: Identifiable<TransactionPartyType>[] = TransactionPartyTypesList;

  accountsAPI = SearcherAPIS.cashFlowAccounts;

  projectsAPI = SearcherAPIS.cashFlowProjects;

  partiesAPI = SearcherAPIS.cashFlowProjectionsParties;

  selectedAccount: Identifiable = null;

  selectedParty: Identifiable = null;

  selectedProject: Identifiable = null;

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


  onPartyTypeChanges(searchPartyRole: Identifiable<TransactionPartyType>) {
    this.form.controls.searchPartyUID.reset();
    this.selectedParty = null;
  }


  onAccountChanges(account: Identifiable) {
    this.selectedAccount = isEmpty(account) ? null : account;
  }


  onProjectChanges(project: Identifiable) {
    this.selectedProject = isEmpty(project) ? null : project;
  }


  onPartyChanges(searchParty: Identifiable) {
    this.selectedParty = isEmpty(searchParty) ? null : searchParty;
  }


  onShowFiltersClicked() {
    this.showFilters = !this.showFilters;
    this.showFiltersChange.emit(this.showFilters);
  }


  onSearchClicked() {
    if (this.form.valid) {
      sendEvent(this.projectionsFilterEvent, ProjectionsFilterEventType.SEARCH_CLICKED,
        { query: this.getFormData() });
    }
  }


  onClearFilters() {
    this.clearFilters();
    sendEvent(this.projectionsFilterEvent, ProjectionsFilterEventType.CLEAR_CLICKED,
      { query: this.getFormData() });
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS, { requestsList: RequestsList.cashflow }),
      this.helper.select<Identifiable[]>(CashFlowStateSelector.PLANS),
      this.helper.select<Identifiable[]>(CashFlowStateSelector.PROJECTION_TYPES),
      this.helper.select<Identifiable[]>(CashFlowStateSelector.PROJECT_TYPES),
      this.helper.select<Identifiable[]>(CashFlowStateSelector.OPERATION_SOURCES),
    ])
    .subscribe(([a, b, c, d, e]) => {
      this.orgUnitsList = a;
      this.plansList = b;
      this.projectionTypesList = c;
      this.projectTypesList = d;
      this.operationSourcesList = e;

      this.isLoading = false;
    });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      partyUID: [null],
      status: [null],
      keywords: [null],
      planUID: [null],
      projectionTypeUID: [null],
      projectTypeUID: [null],
      sourceUID: [null],
      projectUID: [null],
      accountUID: [null],
      entriesKeywords: [null],
      projectionsNo: [null],
      tags: [null],
      dateType: [TransactionDateType.Requested],
      datePeriod: [EmptyDateRange],
      searchPartyRole: [TransactionPartyType.RequestedBy],
      searchPartyUID: [null],
    });
  }


  private setFormData() {
    this.form.reset({
      partyUID: this.query.partyUID,
      status: this.query.status,
      keywords: this.query.keywords,
      planUID: this.query.planUID,
      projectionTypeUID: this.query.projectionTypeUID,
      projectTypeUID: this.query.projectTypeUID,
      sourceUID: this.query.sourceUID,
      projectUID: this.query.projectUID,
      accountUID: this.query.accountUID,
      entriesKeywords: this.query.entriesKeywords,
      projectionsNo: this.query.projectionsNo,
      tags: this.query.tags,
      dateType: this.query.dateType ?? TransactionDateType.Requested,
      datePeriod: { fromDate: this.query.fromDate ?? null, toDate: this.query.toDate ?? null },
      searchPartyRole: this.query.searchPartyRole ?? TransactionPartyType.RequestedBy,
      searchPartyUID: this.query.searchPartyUID,
    });
  }


  private getFormData(): CashFlowProjectionsQuery {
    Assertion.assert(!!this.stage, 'Programming error: cash-flow-projections stage is required.');

    const query: CashFlowProjectionsQuery = {
      stage: this.stage,
      status: this.form.value.status ?? null,
      keywords: this.form.value.keywords ?? null,
      planUID: this.form.value.planUID ?? null,
      projectionTypeUID: this.form.value.projectionTypeUID ?? null,
      projectTypeUID: this.form.value.projectTypeUID ?? null,
      sourceUID: this.form.value.sourceUID ?? null,
      partyUID: this.form.value.partyUID ?? null,
      projectUID: this.form.value.projectUID ?? null,
      accountUID: this.form.value.accountUID ?? null,
      entriesKeywords: this.form.value.entriesKeywords ?? null,
      projectionsNo: this.form.value.projectionsNo ?? null,
      tags: this.form.value.tags ?? null,
      dateType: this.form.value.dateType ?? null,
      fromDate: this.form.value.datePeriod?.fromDate ?? '',
      toDate: this.form.value.datePeriod?.toDate ?? '',
      searchPartyRole: this.form.value.searchPartyRole ?? null,
      searchPartyUID: this.form.value.searchPartyUID ?? null,
    };

    return query;
  }


  private clearFilters() {
    this.form.reset();
    this.selectedAccount = null;
    this.selectedParty = null;
    this.selectedProject = null;
  }

}
