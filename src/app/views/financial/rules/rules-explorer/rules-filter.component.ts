/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, DateString, EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { FinancialRulesQuery, EmptyFinancialRulesQuery } from '@app/models';

import { FinancialStateSelector } from '@app/presentation/exported.presentation.types';


export enum FinancialRulesFilterEventType {
  SEARCH_CLICKED = 'FinancialRulesFilterComponent.Event.SearchClicked',
}


interface FinancialRulesFilterFormModel extends FormGroup<{
  categoryUID: FormControl<string>;
  date: FormControl<DateString>;
  keywords: FormControl<string>;
}> { }


@Component({
  selector: 'emp-financial-rules-filter',
  templateUrl: './rules-filter.component.html',
})
export class FinancialRulesFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() query: FinancialRulesQuery = Object.assign({}, EmptyFinancialRulesQuery);

  @Output() rulesFilterEvent = new EventEmitter<EventInfo>();

  form: FinancialRulesFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  helper: SubscriptionHelper;

  categoriesList: Identifiable[] = [];


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


  onSearchClicked() {
    if (this.form.valid) {
      const payload = { query: this.getFormData() };
      sendEvent(this.rulesFilterEvent, FinancialRulesFilterEventType.SEARCH_CLICKED, payload);
    }
  }


  private loadDataLists() {
    this.isLoading = true;

    this.helper.select<Identifiable[]>(FinancialStateSelector.RULES_CATEGORIES)
      .subscribe(x => {
        this.categoriesList = x;
        this.isLoading = x.length === 0;
      });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      categoryUID: ['', Validators.required],
      date: [null],
      keywords: [null],
    });
  }


  private setFormData() {
    this.form.reset({
      categoryUID: this.query.categoryUID,
      date: this.query.date,
      keywords: this.query.keywords,
    });
  }


  private getFormData(): FinancialRulesQuery {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const query: FinancialRulesQuery = {
      categoryUID: this.form.value.categoryUID ?? null,
      date: this.form.value.date ?? null,
      keywords: this.form.value.keywords ?? null,
    };

    return query;
  }

}
