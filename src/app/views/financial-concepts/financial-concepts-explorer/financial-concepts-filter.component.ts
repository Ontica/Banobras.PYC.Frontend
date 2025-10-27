/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, DateString, Empty, EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { FinancialConceptsQuery, EmptyFinancialConceptsQuery } from '@app/models';

import { FinancialStateSelector } from '@app/presentation/exported.presentation.types';


export enum FinancialConceptsFilterEventType {
  SEARCH_CLICKED = 'FinancialConceptsFilterComponent.Event.SearchClicked',
}


interface FinancialConceptsFilterFormModel extends FormGroup<{
  groupUID: FormControl<string>;
  date: FormControl<DateString>;
  keywords: FormControl<string>;
}> { }


@Component({
  selector: 'emp-financial-concepts-filter',
  templateUrl: './financial-concepts-filter.component.html',
})
export class FinancialConceptsFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() query: FinancialConceptsQuery = Object.assign({}, EmptyFinancialConceptsQuery);

  @Output() conceptsFilterEvent = new EventEmitter<EventInfo>();

  form: FinancialConceptsFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  groupsList: Identifiable[] = [];

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


  onSearchClicked() {
    if (this.form.valid) {
      const payload = {
        group: this.getGroup(),
        query: this.getFormData(),
      };

      sendEvent(this.conceptsFilterEvent, FinancialConceptsFilterEventType.SEARCH_CLICKED, payload);
    }
  }


  private loadDataLists() {
    this.isLoading = true;

    this.helper.select<Identifiable[]>(FinancialStateSelector.CONCEPTS_GROUPS)
      .subscribe(x => {
        this.groupsList = x;
        this.isLoading = x.length === 0;
      });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      groupUID: ['', Validators.required],
      date: [null],
      keywords: [null],
    });
  }


  private setFormData() {
    this.form.reset({
      groupUID: this.query.groupUID,
      date: this.query.date,
      keywords: this.query.keywords,
    });
  }


  private getGroup(): Identifiable {
    return this.groupsList.find(x => x.uid === this.form.value.groupUID) ?? Empty;
  }


  private getFormData(): FinancialConceptsQuery {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const query: FinancialConceptsQuery = {
      groupUID: this.form.value.groupUID ?? null,
      date: this.form.value.date ?? null,
      keywords: this.form.value.keywords ?? null,
    };

    return query;
  }

}
