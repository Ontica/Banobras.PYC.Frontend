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

import { BudgetingStateSelector, CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { empExpandCollapse, FormHelper, sendEvent } from '@app/shared/utils';

import { BudgetType, DateRange, EmptyDateRange, EmptyProvisionsQuery, ProvisionsQuery, ProvisionStatusList,
         ProvisionStatus, OrderTypesList, ProvisionQueryTypes, RequestsList } from '@app/models';

export enum ProvisionsFilterEventType {
  SEARCH_CLICKED = 'ProvisionsFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'ProvisionsFilterComponent.Event.ClearClicked',
}

interface ProvisionsFilterFormModel extends FormGroup<{
  requestedByUID: FormControl<string>;
  status: FormControl<ProvisionStatus>;
  datePeriod: FormControl<DateRange>;
  keywords: FormControl<string>;
  orderTypeUID: FormControl<string>;
  budgetUID: FormControl<string>;
}> { }

@Component({
  selector: 'emp-ng-provisions-filter',
  templateUrl: './provisions-filter.component.html',
  animations: [empExpandCollapse],
})
export class ProvisionsFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() queryType: ProvisionQueryTypes = ProvisionQueryTypes.All;

  @Input() query: ProvisionsQuery = Object.assign({}, EmptyProvisionsQuery);

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() provisionsFilterEvent = new EventEmitter<EventInfo>();

  form: ProvisionsFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  orgUnitsList: Identifiable[] = [];

  statusList: Identifiable<ProvisionStatus>[] = ProvisionStatusList;

  budgetTypesList: BudgetType[] = [];

  orderTypesList: Identifiable[] = OrderTypesList;

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.query) {
      this.setFormData();
    }

    if (changes.queryType) {
      this.setStatusList();
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
      sendEvent(this.provisionsFilterEvent, ProvisionsFilterEventType.SEARCH_CLICKED,
        { query: this.getFormData() });
    }
  }


  onClearFilters() {
    this.clearFilters();
    sendEvent(this.provisionsFilterEvent, ProvisionsFilterEventType.CLEAR_CLICKED,
      { query: this.getFormData() });
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS, { requestsList: RequestsList.budgeting }),
      this.helper.select<BudgetType[]>(BudgetingStateSelector.BUDGET_TYPES),
    ])
    .subscribe(([a, b]) => {
      this.orgUnitsList = a;
      this.budgetTypesList = b;
      this.isLoading = false;
    });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      requestedByUID: [null],
      status: [null],
      datePeriod: [EmptyDateRange],
      keywords: [null],
      orderTypeUID: [null],
      budgetUID: [null],
    });
  }


  private setFormData() {
    this.form.reset({
      requestedByUID: this.query.requestedByUID,
      status: this.query.status,
      datePeriod: { fromDate: this.query.fromDate ?? null, toDate: this.query.toDate ?? null },
      keywords: this.query.keywords,
      orderTypeUID: this.query.orderTypeUID,
      budgetUID: this.query.budgetUID,
    });
  }


  private setStatusList() {
    switch (this.queryType) {
      case ProvisionQueryTypes.Procurement:
        this.statusList = [...ProvisionStatusList];
        return;
      case ProvisionQueryTypes.Budget:
        this.statusList = [...ProvisionStatusList.filter(x => x.uid !== ProvisionStatus.Pending)];
        return;
      case ProvisionQueryTypes.All:
      default:
        this.statusList = [...ProvisionStatusList];
        return;
    }
  }


  private getFormData(): ProvisionsQuery {
    const query: ProvisionsQuery = {
      requestedByUID: this.form.value.requestedByUID ?? null,
      status: this.form.value.status,
      fromDate: this.form.value.datePeriod?.fromDate ?? '',
      toDate: this.form.value.datePeriod?.toDate ?? '',
      keywords: this.form.value.keywords ?? null,
      orderTypeUID: this.form.value.orderTypeUID ?? null,
      budgetUID: this.form.value.budgetUID ?? null,
    };

    return query;
  }


  private clearFilters() {
    this.form.reset();
  }

}
