/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { EventInfo, Identifiable, Validate } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { BudgetingStateSelector } from '@app/presentation/exported.presentation.types';

import { FormHelper, sendEvent, empExpandCollapse } from '@app/shared/utils';

import { BudgetReportTypesList, DateRange, EmptyDateRange, ReportTypes, BudgetType, BudgetReportQuery,
         EmptyBudgetReportQuery } from '@app/models';


export enum BudgetReportFilterEventType {
  SEARCH_CLICKED = 'BudgetReportFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'BudgetReportFilterComponent.Event.ClearClicked',
}

interface ReportFilterFormModel extends FormGroup<{
  reportType: FormControl<ReportTypes>;
  budgetTypeUID: FormControl<string>;
  datePeriod: FormControl<DateRange>;
}> { }

@Component({
  selector: 'emp-pyc-budget-report-filter',
  templateUrl: './budget-report-filter.component.html',
  animations: [empExpandCollapse],
})
export class BudgetReportFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() query: BudgetReportQuery = Object.assign({}, EmptyBudgetReportQuery);

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() budgetReportFilterEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: ReportFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  reportTypesList = BudgetReportTypesList;

  budgetTypesList: BudgetType[] = [];


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


  onShowFiltersClicked() {
    this.showFilters = !this.showFilters;
    this.showFiltersChange.emit(this.showFilters);
  }


  onSearchClicked() {
    if (FormHelper.isFormReadyAndInvalidate(this.form)) {
      sendEvent(this.budgetReportFilterEvent, BudgetReportFilterEventType.SEARCH_CLICKED, {
        reportType: this.getReportType(),
        query: this.getFormData(),
      });
    }
  }


  onClearFilters() {
    this.clearFilters();
    sendEvent(this.budgetReportFilterEvent, BudgetReportFilterEventType.CLEAR_CLICKED, {
      reportType: this.getReportType(),
      query: this.getFormData(),
    });
  }


  private loadDataLists() {
    this.isLoading = true;

    this.helper.select<BudgetType[]>(BudgetingStateSelector.BUDGET_TYPES)
      .subscribe(x => {
        this.budgetTypesList = x;
        this.isLoading = x.length === 0;
      });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      reportType: [null as ReportTypes, Validators.required],
      budgetTypeUID: ['', Validators.required],
      datePeriod: [EmptyDateRange, [Validators.required, Validate.periodRequired]],
    });
  }


  private setFormData() {
    const datePeriod = {
      fromDate: this.query.fromDate ?? null, toDate: this.query.toDate ?? null
    };

    this.form.reset({
      reportType: this.query.reportType as ReportTypes,
      datePeriod,
    });
  }


  private getReportType(): Identifiable {
    return this.reportTypesList.find(x => x.uid === this.form.value.reportType) ?? null;
  }


  private getFormData(): BudgetReportQuery {
    const query: BudgetReportQuery = {
      reportType: this.form.value.reportType ?? null,
      budgetTypeUID: this.form.value.budgetTypeUID ?? '',
      fromDate: this.form.value.datePeriod.fromDate ?? null,
      toDate: this.form.value.datePeriod.toDate ?? null,
    };

    return query;
  }


  private clearFilters() {
    this.form.reset({
      reportType: this.form.value.reportType,
      budgetTypeUID: this.form.value.budgetTypeUID,
      datePeriod: EmptyDateRange
    });
  }

}
