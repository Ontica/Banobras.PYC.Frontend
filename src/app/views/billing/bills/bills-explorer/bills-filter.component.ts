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

import { EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { CataloguesStateSelector,
         PaymentsStateSelector } from '@app/presentation/exported.presentation.types';

import { empExpandCollapse, FormHelper, sendEvent } from '@app/shared/utils';

import { BillQueryDateType, BillQueryDateTypesList, BillsQuery, BillsStatus, BillsStatusList, DateRange,
         EmptyBillsQuery, EmptyDateRange, RequestsList } from '@app/models';

export enum BillsFilterEventType {
  SEARCH_CLICKED = 'BillsFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'BillsFilterComponent.Event.ClearClicked',
}

interface BillsFilterFormModel extends FormGroup<{
  managedByUID: FormControl<string>;
  status: FormControl<BillsStatus>;
  keywords: FormControl<string>;
  billCategoryUID: FormControl<string>;
  billTypeUID: FormControl<string>;
  conceptsKeywords: FormControl<string>;
  tags: FormControl<string[]>;
  datePeriod: FormControl<DateRange>;
  billDateType: FormControl<BillQueryDateType>;
}> { }

@Component({
  selector: 'emp-ng-bills-filter',
  templateUrl: './bills-filter.component.html',
  animations: [empExpandCollapse],
})
export class BillsFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() query: BillsQuery = Object.assign({}, EmptyBillsQuery);

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() billsFilterEvent = new EventEmitter<EventInfo>();

  form: BillsFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  orgUnitsList: Identifiable[] = [];

  statusList: Identifiable<BillsStatus>[] = BillsStatusList;

  billCategoriesList: Identifiable[] = [];

  billTypesList: Identifiable[] = [];

  billDateTypesList: Identifiable[] = BillQueryDateTypesList;

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
      sendEvent(this.billsFilterEvent, BillsFilterEventType.SEARCH_CLICKED,
        { query: this.getFormData() });
    }
  }


  onClearFilters() {
    this.clearFilters();
    sendEvent(this.billsFilterEvent, BillsFilterEventType.CLEAR_CLICKED,
      { query: this.getFormData() });
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS,
        { requestsList: RequestsList.payments }),
      this.helper.select<Identifiable[]>(PaymentsStateSelector.BILL_TYPES),
      this.helper.select<Identifiable[]>(PaymentsStateSelector.BILL_CATEGORIES),
    ])
    .subscribe(([a, b, c]) => {
      this.orgUnitsList = a;
      this.billTypesList = b;
      this.billCategoriesList = c;
      this.isLoading = false;
    });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      managedByUID: [null],
      status: [null],
      keywords: [null],
      billCategoryUID: [null],
      billTypeUID: [null],
      billDateType: [null],
      datePeriod: [EmptyDateRange],
      conceptsKeywords: [null],
      tags: [null],
    });
  }


  private setFormData() {
    this.form.reset({
      managedByUID: this.query.managedByUID,
      status: this.query.status,
      keywords: this.query.keywords,
      billCategoryUID: this.query.billCategoryUID,
      billTypeUID: this.query.billTypeUID,
      billDateType: this.query.billDateType ?? BillQueryDateType.Emission,
      datePeriod: { fromDate: this.query.fromDate ?? null, toDate: this.query.toDate ?? null },
      conceptsKeywords: this.query.conceptsKeywords,
      tags: this.query.tags,
    });
  }


  private getFormData(): BillsQuery {
    const query: BillsQuery = {
      managedByUID: this.form.value.managedByUID ?? null,
      status: this.form.value.status ?? null,
      keywords: this.form.value.keywords ?? null,
      billCategoryUID: this.form.value.billCategoryUID ?? null,
      billTypeUID: this.form.value.billTypeUID ?? null,
      billDateType: this.form.value.billDateType ?? null,
      fromDate: this.form.value.datePeriod?.fromDate ?? '',
      toDate: this.form.value.datePeriod?.toDate ?? '',
      conceptsKeywords: this.form.value.conceptsKeywords ?? null,
      tags: this.form.value.tags ?? null,
    };

    return query;
  }


  private clearFilters() {
    this.form.reset();
  }

}
