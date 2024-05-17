/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { BudgetPlanningStateSelector } from '@app/presentation/exported.presentation.types';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { expandCollapse } from '@app/shared/animations/animations';

import { Budget, BudgetPlanningQuery, BudgetSegmentQuery, BudgetSegmentType, BudgetType } from '@app/models';

export enum BudgetPlanningFilterEventType {
  SEARCH_CLICKED = 'BudgetPlanningFilterComponent.Event.SearchClicked',
}

interface BudgetPlanningFilterFormModel extends FormGroup<{
  budgetTypeUID: FormControl<string>;
  budgetUID: FormControl<string>;
  budgetView: FormControl<string>;
}> { }


export interface SegmentFormData {
  segmentType: string;
  segmentName: string;
  segmentID: string;
  required: boolean;
  multiple: boolean;
}

@Component({
  selector: 'emp-budg-planning-filter',
  templateUrl: './budget-planning-filter.component.html',
  animations: [expandCollapse],
})
export class BudgetPlanningFilterComponent implements OnInit, OnDestroy {

  @Input() queryExecuted: boolean = false;

  @Output() budgetPlanningFilterEvent = new EventEmitter<EventInfo>();

  form: BudgetPlanningFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  showFilters = false;

  budgetTypesList: BudgetType[] = [];

  budgetsList: Budget[] = [];

  budgetViewsList: BudgetSegmentType[] = [];

  segmentsToDisplay = [];

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
    this.budgetViewsList = budgetType.segmentTypes;

    this.form.controls.budgetUID.reset();
    this.form.controls.budgetView.reset();

    this.setAndBuildSegmentsFormControls(budgetType.segmentTypes);
  }


  onShowFiltersClicked() {
    this.showFilters = !this.showFilters;
  }


  onSearchClicked() {
    if (FormHelper.isFormReadyAndInvalidate(this.form)) {
      const payload = {
        isFormValid: this.form.valid,
        query: this.getFormData(),
      };

      sendEvent(this.budgetPlanningFilterEvent, BudgetPlanningFilterEventType.SEARCH_CLICKED, payload);
    }
  }


  onClearFilters() {
    this.form.controls.budgetUID.reset('');
    this.form.controls.budgetView.reset('');

    this.segmentsToDisplay.forEach(x => this.form.controls[x.segmentID].reset(x.multiple ? [] : ''));
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      budgetTypeUID: ['', Validators.required],
      budgetUID: ['', Validators.required],
      budgetView: ['', Validators.required],
    });
  }


  private loadDataLists() {
    this.isLoading = true;

    this.helper.select<BudgetType[]>(BudgetPlanningStateSelector.BUDGET_TYPES)
      .subscribe(x => {
        this.budgetTypesList = x;
        this.isLoading = x.length === 0;
      });
  }


  private setAndBuildSegmentsFormControls(segments: BudgetSegmentType[]) {
    const fb = new FormBuilder();
    this.segmentsToDisplay.forEach(x => this.form.removeControl(x.segmentID));
    this.segmentsToDisplay = segments.map(x => this.getSegmentData(x));
    this.segmentsToDisplay.forEach(x => {
      const initialValue = x.multiple ? [] : '';
      const validator = x.required ? [Validators.required] : [];
      this.form.addControl(x.segmentID, fb.control(initialValue, validator))
    });
  }


  private getSegmentData(segment: BudgetSegmentType): SegmentFormData {
    const segmentParts = segment.uid.split('.');
    const segmentID = segmentParts.length > 0 ? segmentParts[segmentParts.length - 1] : segment.uid;

    const data: SegmentFormData = {
      segmentID,
      segmentName: segment.name,
      segmentType: segment.uid,
      multiple: true,
      required: false,
    };

    return data;
  }


  private getFormData(): any {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const segments = this.segmentsToDisplay.map(x => this.buildBudgetSegmentQuery(x)) ?? [];

    const query: BudgetPlanningQuery = {
      budgetTypeUID: this.form.value.budgetTypeUID ?? '',
      budgetUID: this.form.value.budgetUID ?? '',
      budgetView: this.form.value.budgetView ?? '',
      segments,
    };

    return query;
  }


  private buildBudgetSegmentQuery(segment: SegmentFormData): BudgetSegmentQuery {
    const data: BudgetSegmentQuery = {
      segmentUID: segment.segmentType,
      segmentItemsUID: this.form.value[segment.segmentID] ?? [],
    };

    return data;
  }

}
