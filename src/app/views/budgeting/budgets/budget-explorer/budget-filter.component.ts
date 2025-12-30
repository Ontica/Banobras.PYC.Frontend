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

import { FormHelper, sendEvent, empExpandCollapse } from '@app/shared/utils';

import { Budget, BudgetExplorerReportTypes, BudgetExplorerReportTypesList, BudgetQuery, BudgetQueryType,
         BudgetSegmentQuery, BudgetSegmentType, BudgetType, FormFieldData, FormFieldDataType,
         RequestsList } from '@app/models';


export enum BudgetFilterEventType {
  SEARCH_CLICKED = 'BudgetFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'BudgetFilterComponent.Event.ClearClicked',
}

interface BudgetFilterFormModel extends FormGroup<{
  reportType: FormControl<BudgetExplorerReportTypes>;
  budgetTypeUID: FormControl<string>;
  budgetUID: FormControl<string>;
  basePartyUID: FormControl<string>;
  groupBy: FormControl<string[]>;
}> { }

@Component({
  selector: 'emp-bdg-budget-filter',
  templateUrl: './budget-filter.component.html',
  animations: [empExpandCollapse],
})
export class BudgetFilterComponent implements OnInit, OnDestroy {

  @Input() queryType: BudgetQueryType = BudgetQueryType.planning;

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

  segmentsForGroupByList: BudgetSegmentType[] = [];

  segmentsToDisplay: FormFieldData[] = [];

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


  onBudgetTypeChanged(budgetType: BudgetType) {
    this.budgetsList = budgetType.budgets;
    this.segmentsForGroupByList = budgetType.segmentTypes;

    this.form.controls.budgetUID.reset();
    this.form.controls.basePartyUID.reset();
    this.form.controls.groupBy.reset([]);

    this.setAndBuildSegmentsFormControls(budgetType.segmentTypes);
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
      basePartyUID: [''],
      groupBy: [[] as string[], Validators.required],
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


  private setAndBuildSegmentsFormControls(segments: BudgetSegmentType[]) {
    const fb = new FormBuilder();
    this.segmentsToDisplay.forEach(x => this.form.removeControl(x.field as any));
    this.segmentsToDisplay = segments.map(x => this.getSegmentData(x));
    this.segmentsToDisplay.forEach(x => {
      const initialValue = x.multiple ? [] : '';
      const validator = x.required ? [Validators.required] : [];
      this.form.addControl(x.field as any, fb.control(initialValue, validator));
    });
  }


  private getSegmentData(segment: BudgetSegmentType): FormFieldData {
    const segmentParts = segment.uid.split('.');
    const field = segmentParts.length > 0 ? segmentParts[segmentParts.length - 1] : segment.uid;

    const data: FormFieldData = {
      label: segment.name,
      field,
      fieldType: FormFieldDataType.select,
      dataType: segment.uid,
      multiple: true,
      required: false,
    };

    return data;
  }



  private clearFilters() {
    this.form.controls.budgetUID.reset('');
    this.form.controls.basePartyUID.reset('');
    this.form.controls.groupBy.reset([]);
    this.segmentsToDisplay.forEach(x => this.form.controls[x.field].reset(x.multiple ? [] : ''));
  }


  private getFormData(): BudgetQuery {
    const filterBy = this.segmentsToDisplay.map(x => this.buildBudgetSegmentQuery(x)) ?? [];

    const query: BudgetQuery = {
      reportType: this.form.value.reportType ?? null,
      queryType: this.queryType,
      budgetTypeUID: this.form.value.budgetTypeUID ?? '',
      budgetUID: this.form.value.budgetUID ?? '',
      basePartyUID: this.form.value.basePartyUID ?? '',
      groupBy: this.form.value.groupBy ?? [],
      filterBy,
    };

    return query;
  }


  private buildBudgetSegmentQuery(segment: FormFieldData): BudgetSegmentQuery {
    const data: BudgetSegmentQuery = {
      segmentUID: segment.dataType,
      segmentItemsUID: this.form.value[segment.field] ?? [],
    };

    return data;
  }

}
