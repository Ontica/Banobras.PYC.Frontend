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
  basePartyUID: FormControl<string>;
  status: FormControl<TransactionStatus>;
  keywords: FormControl<string>;
  planUID: FormControl<string>;
  categoryUID: FormControl<string>;
  classificationUID: FormControl<string>;
  sourceUID: FormControl<string>;
  baseAccountUID: FormControl<string>;
  baseProjectUID: FormControl<string>;
  projectionsNo: FormControl<string[]>;
  entriesKeywords: FormControl<string>;
  tags: FormControl<string[]>;
  dateType: FormControl<TransactionDateType>;
  datePeriod: FormControl<DateRange>;
  partyType: FormControl<TransactionPartyType>;
  partyUID: FormControl<string>;
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

  categoriesList: Identifiable[] = [];

  plansList: Identifiable[] = [];

  classificationsList: Identifiable[] = [];

  operationSourcesList: Identifiable[] = [];

  dateTypesList: Identifiable<TransactionDateType>[] = TransactionDateTypesList;

  partyTypesList: Identifiable<TransactionPartyType>[] = TransactionPartyTypesList;

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


  onPartyTypeChanges(partyType: Identifiable<TransactionPartyType>) {
    this.form.controls.partyUID.reset();
    this.selectedParty = null;
  }


  onAccountChanges(account: Identifiable) {
    this.selectedAccount = isEmpty(account) ? null : account;
  }


  onProjectChanges(project: Identifiable) {
    this.selectedProject = isEmpty(project) ? null : project;
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
      this.helper.select<Identifiable[]>(CashFlowStateSelector.CATEGORIES),
      this.helper.select<Identifiable[]>(CashFlowStateSelector.CLASSIFICATIONS),
      this.helper.select<Identifiable[]>(CashFlowStateSelector.OPERATION_SOURCES),
    ])
    .subscribe(([a, b, c, d, e]) => {
      this.orgUnitsList = a;
      this.plansList = b;
      this.categoriesList = c;
      this.classificationsList = d;
      this.operationSourcesList = e;

      this.isLoading = false;
    });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      basePartyUID: [null],
      status: [null],
      keywords: [null],
      planUID: [null],
      categoryUID: [null],
      classificationUID: [null],
      sourceUID: [null],
      baseAccountUID: [null],
      baseProjectUID: [null],
      entriesKeywords: [null],
      projectionsNo: [null],
      tags: [null],
      dateType: [TransactionDateType.Requested],
      datePeriod: [EmptyDateRange],
      partyType: [TransactionPartyType.RequestedBy],
      partyUID: [null],
    });
  }


  private setFormData() {
    this.form.reset({
      basePartyUID: this.query.basePartyUID,
      status: this.query.status,
      keywords: this.query.keywords,
      planUID: this.query.planUID,
      categoryUID: this.query.categoryUID,
      classificationUID: this.query.classificationUID,
      sourceUID: this.query.sourceUID,
      baseAccountUID: this.query.baseAccountUID,
      baseProjectUID: this.query.baseProjectUID,
      entriesKeywords: this.query.entriesKeywords,
      projectionsNo: this.query.projectionsNo,
      tags: this.query.tags,
      dateType: this.query.dateType ?? TransactionDateType.Requested,
      datePeriod: { fromDate: this.query.fromDate ?? null, toDate: this.query.toDate ?? null },
      partyType: this.query.partyType ?? TransactionPartyType.RequestedBy,
      partyUID: this.query.partyUID,
    });
  }


  private getFormData(): CashFlowProjectionsQuery {
    Assertion.assert(!!this.stage, 'Programming error: cash-flow-projections stage is required.');

    const query: CashFlowProjectionsQuery = {
      stage: this.stage,
      status: this.form.value.status ?? null,
      keywords: this.form.value.keywords ?? null,
      planUID: this.form.value.planUID ?? null,
      categoryUID: this.form.value.categoryUID ?? null,
      classificationUID: this.form.value.classificationUID ?? null,
      sourceUID: this.form.value.sourceUID ?? null,
      basePartyUID: this.form.value.basePartyUID ?? null,
      baseAccountUID: this.form.value.baseAccountUID ?? null,
      baseProjectUID: this.form.value.baseProjectUID ?? null,
      entriesKeywords: this.form.value.entriesKeywords ?? null,
      projectionsNo: this.form.value.projectionsNo ?? null,
      tags: this.form.value.tags ?? null,
      dateType: this.form.value.dateType ?? null,
      fromDate: this.form.value.datePeriod?.fromDate ?? '',
      toDate: this.form.value.datePeriod?.toDate ?? '',
      partyType: this.form.value.partyType ?? null,
      partyUID: this.form.value.partyUID ?? null,
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
