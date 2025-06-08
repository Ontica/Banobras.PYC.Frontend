/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountsStateSelector } from '@app/presentation/exported.presentation.types';

import { empExpandCollapse, FormHelper, sendEvent } from '@app/shared/utils';

import { AccountRoleType, AccountRoleTypesList, ChartOfAccountsQuery, DebtorCreditorType,
         DebtorCreditorTypesList, EmptyChartOfAccountsQuery, getDefaultLevelsList } from '@app/models';


export enum ChartOfAccountsFilterEventType {
  SEARCH_CLICKED = 'ChartOfAccountsFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'ChartOfAccountsFilterComponent.Event.ClearClicked',
}


interface ChartOfAccountsFilterFormModel extends FormGroup<{
  chartOfAccountsUID: FormControl<string>;
  keywords: FormControl<string>;
  roleType: FormControl<AccountRoleType>;
  debtorCreditorType: FormControl<DebtorCreditorType>;
  fromAccount: FormControl<string>;
  toAccount: FormControl<string>;
  level: FormControl<number>;
}> { }


@Component({
  selector: 'emp-cf-chart-of-accounts-filter',
  templateUrl: './chart-of-accounts-filter.component.html',
  animations: [empExpandCollapse],
})
export class ChartOfAccountsFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() query: ChartOfAccountsQuery = Object.assign({}, EmptyChartOfAccountsQuery);

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() chartOfAccountsFilterEvent = new EventEmitter<EventInfo>();

  form: ChartOfAccountsFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  chartsOfAccountsList: Identifiable[] = [];

  roleTypesList: AccountRoleType[] = AccountRoleTypesList;

  debtorCreditorTypesList: DebtorCreditorType[] = DebtorCreditorTypesList;

  levelsList: Identifiable[] = [];

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
    this.setLevelsList();
    this.loadDataLists();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onShowFiltersClicked() {
    this.showFilters = !this.showFilters;
    this.showFiltersChange.emit(this.showFilters);
  }


  onClearFilters() {
    this.clearFilters();
    sendEvent(this.chartOfAccountsFilterEvent, ChartOfAccountsFilterEventType.CLEAR_CLICKED,
      { query: this.getFormData() });
  }


  onSearchClicked() {
    if (this.form.valid) {
      sendEvent(this.chartOfAccountsFilterEvent, ChartOfAccountsFilterEventType.SEARCH_CLICKED,
        { query: this.getFormData() });
    }
  }


  private loadDataLists() {
    this.isLoading = true;

    this.helper.select<Identifiable[]>(AccountsStateSelector.CHARTS_OF_ACCOUNTS_LIST)
      .subscribe(x => {
        this.chartsOfAccountsList = x;
        this.setChartOfAccountsDefault();
        this.isLoading = x.length === 0;
      });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      chartOfAccountsUID: ['', Validators.required],
      keywords: [null],
      roleType: [null],
      debtorCreditorType: [null],
      fromAccount: [null],
      toAccount: [null],
      level: [null],
    });
  }


  private setFormData() {
    this.form.reset({
      chartOfAccountsUID: this.query.chartOfAccountsUID,
      keywords: this.query.keywords,
      roleType: this.query.roleType,
      debtorCreditorType: this.query.debtorCreditorType,
      fromAccount: this.query.fromAccount,
      toAccount: this.query.toAccount,
      level: this.query.level,
    });
  }


  private getFormData(): ChartOfAccountsQuery {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const query: ChartOfAccountsQuery = {
      chartOfAccountsUID: this.form.value.chartOfAccountsUID ?? null,
      roleType: this.form.value.roleType ?? null,
      debtorCreditorType: this.form.value.debtorCreditorType ?? null,
      fromAccount: this.form.value.fromAccount ?? null,
      toAccount: this.form.value.toAccount ?? null,
      level: this.form.value.level ?? null,
      keywords: this.form.value.keywords ?? null,
    };

    return query;
  }


  private setChartOfAccountsDefault() {
    const chartOfAccounts = this.chartsOfAccountsList.length > 0 ? this.chartsOfAccountsList[0] : null;
    this.form.controls.chartOfAccountsUID.reset(chartOfAccounts?.uid ?? null);
  }


  private setLevelsList() {
    this.levelsList = getDefaultLevelsList();
  }


  private clearFilters() {
    const chartOfAccounts = this.chartsOfAccountsList.length > 0 ? this.chartsOfAccountsList[0] : null;

    this.form.reset({
      chartOfAccountsUID: chartOfAccounts?.uid ?? null,
      keywords: null,
      roleType: null,
      debtorCreditorType: null,
      fromAccount: null,
      toAccount: null,
      level: null,
    });
  }

}
