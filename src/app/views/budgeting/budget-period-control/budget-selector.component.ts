/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo } from '@app/core';

import { BudgetingStateSelector } from '@app/presentation/exported.presentation.types';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { Budget, BudgetSelector, BudgetType } from '@app/models';


export enum BudgetSelectorEventType {
  SEARCH_CLICKED = 'BudgetSelectorComponent.Event.SearchClicked',
}


interface BudgetSelectorFormModel extends FormGroup<{
  budgetTypeUID: FormControl<string>;
  budgetUID: FormControl<string>;
}> { }

@Component({
  selector: 'emp-bdg-budget-selector',
  templateUrl: './budget-selector.component.html',
})
export class BudgetSelectorComponent implements OnInit, OnDestroy {

  @Output() budgetSelectorEvent = new EventEmitter<EventInfo>();

  form: BudgetSelectorFormModel;

  formHelper = FormHelper;

  isLoading = false;

  budgetTypesList: BudgetType[] = [];

  budgetsList: Budget[] = [];

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
    this.form.controls.budgetUID.reset('');
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const payload = {
        query: this.getFormData(),
        budget: this.getBudget(),
      };

      sendEvent(this.budgetSelectorEvent, BudgetSelectorEventType.SEARCH_CLICKED, payload);
    }
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
      budgetTypeUID: ['', Validators.required],
      budgetUID: ['', Validators.required],
    });
  }


  private getFormData(): BudgetSelector {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const data: BudgetSelector = {
      budgetTypeUID: this.form.value.budgetTypeUID ?? '',
      budgetUID: this.form.value.budgetUID ?? '',
    };

    return data;
  }


  private getBudget(): Budget {
    return this.budgetsList.find(x => x.uid === this.form.value.budgetUID) ?? null;
  }

}
