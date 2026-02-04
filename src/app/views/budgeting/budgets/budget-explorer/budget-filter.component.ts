/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { combineLatest } from 'rxjs';

import { EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { BudgetingStateSelector, CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { FormHelper, sendEvent, empExpandCollapse, ArrayLibrary } from '@app/shared/utils';

import { Budget, BudgetExplorerReportTypes, BudgetExplorerReportTypesList, BudgetQuery, BudgetSegmentType,
         BudgetType, RequestsList } from '@app/models';


export enum BudgetFilterEventType {
  SEARCH_CLICKED = 'BudgetFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'BudgetFilterComponent.Event.ClearClicked',
}

interface BudgetFilterFormModel extends FormGroup<{
  reportType: FormControl<BudgetExplorerReportTypes>;
  budgetTypeUID: FormControl<string>;
  budgetUID: FormControl<string>;
  baseParties: FormControl<string[]>;
  groupByColumn: FormControl<string>;
  budgetAccounts: FormControl<string[]>;
}> { }

@Component({
  selector: 'emp-bdg-budget-filter',
  templateUrl: './budget-filter.component.html',
  animations: [empExpandCollapse],
})
export class BudgetFilterComponent implements OnInit, OnDestroy {

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() budgetFilterEvent = new EventEmitter<EventInfo>();

  form: BudgetFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  reportTypesList = BudgetExplorerReportTypesList;

  budgetTypesList: BudgetType[] = [];

  budgetsList: Budget[] = [];

  orgUnitsList: Identifiable[] = [];

  groupByColumnsList: Identifiable[] = [];

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onReportTypeChanged(reportType: Identifiable) {
    this.onClearFilters();
  }


  onBudgetTypeChanged(budgetType: BudgetType) {
    this.budgetsList = budgetType.budgets;
    this.groupByColumnsList = budgetType.groupByColumns;
    this.onClearFilters();
  }


  onShowFiltersClicked() {
    this.showFilters = !this.showFilters;
    this.showFiltersChange.emit(this.showFilters);
  }


  onSearchClicked() {
    if (FormHelper.isFormReadyAndInvalidate(this.form)) {
      const payload = {
        isFormValid: this.form.valid,
        query: this.getFormData(),
      };

      sendEvent(this.budgetFilterEvent, BudgetFilterEventType.SEARCH_CLICKED, payload);
    }
  }


  onClearFilters() {
    this.clearFilters();

    const payload = {
      isFormValid: this.form.valid,
      query: this.getFormData(),
    };

    sendEvent(this.budgetFilterEvent, BudgetFilterEventType.CLEAR_CLICKED, payload);
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      reportType: [BudgetExplorerReportTypes.ByColumn, Validators.required],
      budgetTypeUID: ['', Validators.required],
      budgetUID: ['', Validators.required],
      baseParties: [null],
      groupByColumn: ['', Validators.required],
      budgetAccounts: [null],
    });
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS, {requestsList: RequestsList.budgeting}),
      this.helper.select<BudgetType[]>(BudgetingStateSelector.BUDGET_TYPES)
    ])
    .subscribe(([a, b]) => {
      this.orgUnitsList = a;
      this.budgetTypesList = b;
      this.isLoading = false;
    });
  }


  private clearFilters() {
    this.form.controls.budgetUID.reset('');
    this.form.controls.baseParties.reset(null);
    this.form.controls.budgetAccounts.reset(null);
    this.setDefaultGroupByColumn();
  }


  private setDefaultGroupByColumn() {
    const defaultGroupByColumn = ArrayLibrary.getFirstItem(this.groupByColumnsList);
    this.form.controls.groupByColumn.reset(defaultGroupByColumn?.uid ?? null);
  }


  private getFormData(): BudgetQuery {
    const query: BudgetQuery = {
      reportType: this.form.value.reportType ?? null,
      budgetTypeUID: this.form.value.budgetTypeUID ?? '',
      budgetUID: this.form.value.budgetUID ?? '',
      baseParties: this.form.value.baseParties ?? [],
      groupByColumn: this.form.value.groupByColumn ?? '',
      budgetAccounts: this.form.value.budgetAccounts ?? [],
    };

    return query;
  }

}
