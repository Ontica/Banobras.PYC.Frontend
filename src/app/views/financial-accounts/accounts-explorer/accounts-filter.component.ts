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

import { EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountsStateSelector, CataloguesStateSelector,
         FinancialStateSelector } from '@app/presentation/exported.presentation.types';

import { empExpandCollapse, FormHelper, sendEvent } from '@app/shared/utils';

import { SearcherAPIS } from '@app/data-services';

import { FinancialAccountsQuery, EmptyFinancialAccountsQuery, EntityStatusList, EntityStatus,
         RequestsList } from '@app/models';


export enum AccountsFilterEventType {
  SEARCH_CLICKED = 'FinancialAccountsFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'FinancialAccountsFilterComponent.Event.ClearClicked',
}

interface AccountsFilterFormModel extends FormGroup<{
  keywords: FormControl<string>;
  status: FormControl<EntityStatus>;
  organizationUnitUID: FormControl<string>;
  standardAccountUID: FormControl<string>;
  accountTypeUID: FormControl<string>;
  currencyUID: FormControl<string>;
  projectTypeUID: FormControl<string>;
  projectUID: FormControl<string>;
  subledgerAcccountNo: FormControl<string>;
}> { }

@Component({
  selector: 'emp-cf-accounts-filter',
  templateUrl: './accounts-filter.component.html',
  animations: [empExpandCollapse],
})
export class FinancialAccountsFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() query: FinancialAccountsQuery = Object.assign({}, EmptyFinancialAccountsQuery);

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() accountsFilterEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: AccountsFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  statusList: Identifiable<EntityStatus>[] = EntityStatusList;

  orgUnitsList: Identifiable[] = [];

  projectTypesList: Identifiable[] = [];

  accountTypesList: Identifiable[] = [];

  standardAccountsList: Identifiable[] = [];

  currenciesList: Identifiable[] = [];

  projectsAPI = SearcherAPIS.cashFlowProjects;

  selectedProject: Identifiable = null;


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


  onShowFiltersClicked() {
    this.showFilters = !this.showFilters;
    this.showFiltersChange.emit(this.showFilters);
  }


  onSearchClicked() {
    if (this.form.valid) {
      sendEvent(this.accountsFilterEvent, AccountsFilterEventType.SEARCH_CLICKED,
        { query: this.getFormData() });
    }
  }


  onClearFilters() {
    this.clearFilters();
    sendEvent(this.accountsFilterEvent, AccountsFilterEventType.CLEAR_CLICKED,
      { query: this.getFormData() });
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS, { requestsList: RequestsList.cashflow }),
      this.helper.select<Identifiable[]>(CataloguesStateSelector.CURRENCIES),
      this.helper.select<Identifiable[]>(FinancialStateSelector.PROJECT_TYPES),
      this.helper.select<Identifiable[]>(AccountsStateSelector.STANDARD_ACCOUNTS),
      this.helper.select<Identifiable[]>(AccountsStateSelector.ACCOUNTS_TYPES),
    ])
    .subscribe(([a, b, c, d, e]) => {
      this.orgUnitsList = a;
      this.currenciesList = b;
      this.projectTypesList = c;
      this.standardAccountsList = d;
      this.accountTypesList = e;
      this.isLoading = false;
    });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      keywords: [null],
      status: [null],
      organizationUnitUID: [null],
      standardAccountUID: [null],
      accountTypeUID: [null],
      currencyUID: [null],
      projectTypeUID: [null],
      projectUID: [null],
      subledgerAcccountNo: [null],
    });
  }


  private setFormData() {
    this.form.reset({
      keywords: this.query.keywords,
      status: this.query.status,
      organizationUnitUID: this.query.organizationUnitUID,
      standardAccountUID: this.query.standardAccountUID,
      accountTypeUID: this.query.accountTypeUID,
      currencyUID: this.query.currencyUID,
      projectTypeUID: this.query.projectTypeUID,
      projectUID: this.query.projectUID,
      subledgerAcccountNo: this.query.subledgerAcccountNo,
    });
  }


  private getFormData(): FinancialAccountsQuery {
    const query: FinancialAccountsQuery = {
      keywords: this.form.value.keywords ?? null,
      status: this.form.value.status ?? null,
      organizationUnitUID: this.form.value.organizationUnitUID ?? null,
      standardAccountUID: this.form.value.standardAccountUID ?? null,
      accountTypeUID: this.form.value.accountTypeUID ?? null,
      currencyUID: this.form.value.currencyUID ?? null,
      projectTypeUID: this.form.value.projectTypeUID ?? null,
      projectUID: this.form.value.projectUID ?? null,
      subledgerAcccountNo: this.form.value.subledgerAcccountNo ?? null,
    };

    return query;
  }


  private clearFilters() {
    this.form.reset();
  }

}
