/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { EventInfo, Identifiable } from '@app/core';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { BudgetEntryExplorerReportTypes, BudgetEntryExplorerReportTypesList, BudgetEntryQuery,
         EmptyBudgetEntryQuery } from '@app/models';


export enum BudgetEntryFilterEventType {
  FILTER_CHANGED = 'BudgetEntryFilterComponent.Event.FilterChanged',
  SEARCH_CLICKED = 'BudgetEntryFilterComponent.Event.SearchClicked',
  EXPORT_CLICKED = 'BudgetEntryFilterComponent.Event.ExportClicked',
}

interface BudgetEntryFilterFormModel extends FormGroup<{
  reportType: FormControl<BudgetEntryExplorerReportTypes>;
}> { }

@Component({
  selector: 'emp-bdg-budget-entry-filter',
  templateUrl: './budget-entry-filter.component.html',
})
export class BudgetEntryFilterComponent implements OnChanges {

  @Input() subQuery: BudgetEntryQuery = Object.assign({}, EmptyBudgetEntryQuery);

  @Input() filter = '';

  @Output() budgetEntryFilterEvent = new EventEmitter<EventInfo>();

  form: BudgetEntryFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  reportTypesList = BudgetEntryExplorerReportTypesList;


  constructor() {
    this.initForm();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.subQuery) {
      this.setFormData();
    }
  }


  onSearchClicked() {
    if (FormHelper.isFormReadyAndInvalidate(this.form)) {
      const payload = {
        isFormValid: this.form.valid,
        reportType: this.getReportType(),
        subQuery: this.getFormData(),
      };

      sendEvent(this.budgetEntryFilterEvent, BudgetEntryFilterEventType.SEARCH_CLICKED, payload);
    }
  }


  onClearFilter() {
    this.filter = '';
    this.onFilterData();
  }


  onFilterData() {
    sendEvent(this.budgetEntryFilterEvent, BudgetEntryFilterEventType.FILTER_CHANGED,
      { filter: this.filter });
  }


  onExportButtonClicked() {
    const payload = {
      isFormValid: this.form.valid,
      reportType: this.getReportType(),
      subQuery: this.getFormData(),
    };

    sendEvent(this.budgetEntryFilterEvent, BudgetEntryFilterEventType.EXPORT_CLICKED, payload);
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      reportType: [this.subQuery.reportType, Validators.required],
    });
  }


  private setFormData() {
    this.form.reset({
      reportType: this.subQuery.reportType,
    });
  }


  private getFormData(): BudgetEntryQuery {
    const data: BudgetEntryQuery = {
      reportType: this.form.value.reportType ?? null,
    };

    return data;
  }


  private getReportType(): Identifiable {
    return this.reportTypesList.find(x => x.uid === this.form.value.reportType) ?? null;
  }

}
