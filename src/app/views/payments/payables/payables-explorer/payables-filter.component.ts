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

import { DateString, EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { BudgetingStateSelector, CataloguesStateSelector,
         PaymentsStateSelector } from '@app/presentation/exported.presentation.types';

import { empExpandCollapse, FormHelper, sendEvent } from '@app/shared/utils';

import { BudgetType, EmptyPayablesQuery, PayablesQuery, PayableStatus, PayableStatusList,
         RequestsList } from '@app/models';


export enum PayablesFilterEventType {
  SEARCH_CLICKED = 'PayablesFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'PayablesFilterComponent.Event.ClearClicked',
}

interface PayablesFilterFormModel extends FormGroup<{
  status: FormControl<PayableStatus>;
  requesterOrgUnitUID: FormControl<string>;
  payableTypeUID: FormControl<string>;
  budgetTypeUID: FormControl<string>;
  keywords: FormControl<string>;
  fromDate: FormControl<DateString>;
  toDate: FormControl<DateString>;
}> { }

@Component({
  selector: 'emp-pmt-payables-filter',
  templateUrl: './payables-filter.component.html',
  animations: [empExpandCollapse],
})
export class PayablesFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() query: PayablesQuery = Object.assign({}, EmptyPayablesQuery);

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() payablesFilterEvent = new EventEmitter<EventInfo>();

  form: PayablesFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  statusList: PayableStatus[] = PayableStatusList;

  requesterOrgUnitsList: Identifiable[] = [];

  payableTypesList: Identifiable[] = [];

  budgetTypesList: Identifiable[] = [];

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


  onShowFiltersClicked() {
    this.showFilters = !this.showFilters;
    this.showFiltersChange.emit(this.showFilters);
  }


  onSearchClicked() {
    if (this.form.valid) {
      sendEvent(this.payablesFilterEvent, PayablesFilterEventType.SEARCH_CLICKED,
        { query: this.getFormData() });
    }
  }


  onClearFilters() {
    this.clearFilters();
    sendEvent(this.payablesFilterEvent, PayablesFilterEventType.CLEAR_CLICKED,
      { query: this.getFormData() });
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS,
        { requestsList: RequestsList.payments }),
      this.helper.select<BudgetType[]>(BudgetingStateSelector.BUDGET_TYPES),
      this.helper.select<BudgetType[]>(PaymentsStateSelector.PAYABLES_TYPES),
    ])
      .subscribe(([a, b, c]) => {
        this.requesterOrgUnitsList = a;
        this.budgetTypesList = b;
        this.payableTypesList = c;
        this.isLoading = false;
      });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      status: [null],
      requesterOrgUnitUID: [null],
      budgetTypeUID: [null],
      payableTypeUID: [null],
      keywords: [null],
      fromDate: [null],
      toDate: [null],
    });
  }


  private setFormData() {
    this.form.reset({
      status: this.query.status,
      requesterOrgUnitUID: this.query.requesterOrgUnitUID,
      budgetTypeUID: this.query.budgetTypeUID,
      payableTypeUID: this.query.payableTypeUID,
      keywords: this.query.keywords,
      fromDate: this.query.fromDate,
      toDate: this.query.toDate,
    });
  }


  private getFormData(): PayablesQuery {
    const query: PayablesQuery = {
      status: this.form.value.status ?? null,
      requesterOrgUnitUID: this.form.value.requesterOrgUnitUID ?? null,
      budgetTypeUID: this.form.value.budgetTypeUID ?? null,
      payableTypeUID: this.form.value.payableTypeUID ?? null,
      keywords: this.form.value.keywords ?? null,
      fromDate: this.form.value.fromDate,
      toDate: this.form.value.toDate,
    };

    return query;
  }


  private clearFilters() {
    this.form.reset();
  }

}
