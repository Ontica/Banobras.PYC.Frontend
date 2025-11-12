/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { combineLatest } from 'rxjs';

import { EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { empExpandCollapse, FormHelper, sendEvent } from '@app/shared/utils';

import { OrdersDataService, SearcherAPIS } from '@app/data-services';

import { OrdersQuery, EntityStatus, EntityStatusList, EmptyOrdersQuery, Priority, OrderExplorerTypeConfig,
         EmptyOrderExplorerTypeConfig, PriorityList, ObjectTypes } from '@app/models';

export enum OrdersFilterEventType {
  SEARCH_CLICKED = 'OrdersFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'OrdersFilterComponent.Event.ClearClicked',
}

interface OrdersFilterFormModel extends FormGroup<{
  requestedByUID: FormControl<string>;
  status: FormControl<EntityStatus>;
  keywords: FormControl<string>;
  categoryUID: FormControl<string>;
  orderNo: FormControl<string>;
  priority: FormControl<Priority>;
  providerUID: FormControl<string>;
  projectUID: FormControl<string>;
}> { }

@Component({
  selector: 'emp-ng-orders-filter',
  templateUrl: './orders-filter.component.html',
  animations: [empExpandCollapse],
})
export class OrdersFilterComponent implements OnChanges, OnDestroy {

  @Input() config: OrderExplorerTypeConfig<ObjectTypes> = EmptyOrderExplorerTypeConfig;

  @Input() query: OrdersQuery = Object.assign({}, EmptyOrdersQuery);

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() ordersFilterEvent = new EventEmitter<EventInfo>();

  form: OrdersFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  statusList: Identifiable<EntityStatus>[] = EntityStatusList;

  priorityList: Identifiable<Priority>[] = PriorityList;

  orgUnitsList: Identifiable[] = [];

  categoriesList: Identifiable[] = [];

  suppliersAPI = SearcherAPIS.suppliers;

  projectsAPI = SearcherAPIS.projects;

  selectedSupplier: Identifiable = null;

  selectedProject: Identifiable = null;

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private ordersData: OrdersDataService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.query) {
      this.setFormData();
    }

    if (changes.config) {
      this.loadDataLists();
    }
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onSupplierChanges(supplier: Identifiable) {
    this.selectedSupplier = supplier;
  }


  onProjectChanges(project: Identifiable) {
    this.selectedProject = project;
  }


  onShowFiltersClicked() {
    this.showFilters = !this.showFilters;
    this.showFiltersChange.emit(this.showFilters);
  }


  onSearchClicked() {
    if (this.form.valid) {
      sendEvent(this.ordersFilterEvent, OrdersFilterEventType.SEARCH_CLICKED,
        { query: this.getFormData() });
    }
  }


  onClearFilters() {
    this.clearFilters();
    sendEvent(this.ordersFilterEvent, OrdersFilterEventType.CLEAR_CLICKED,
      { query: this.getFormData() });
  }


  private loadDataLists() {
    if (!this.config.requestsList) {
      this.orgUnitsList = [];
      return;
    }

    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS,
        { requestsList: this.config.requestsList }),
      this.ordersData.getOrderCategories(this.config.type),
    ])
    .subscribe(([a, b]) => {
      this.orgUnitsList = a;
      this.categoriesList = b;
      this.isLoading = false;
    });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      requestedByUID: [null],
      status: [null],
      keywords: [null],
      categoryUID: [null],
      providerUID: [null],
      projectUID: [null],
      orderNo: [null],
      priority: [null],
    });
  }


  private setFormData() {
    this.form.reset({
      requestedByUID: this.query.requestedByUID,
      status: this.query.status,
      keywords: this.query.keywords,
      categoryUID: this.query.categoryUID,
      providerUID: this.query.providerUID,
      projectUID: this.query.projectUID,
      orderNo: this.query.orderNo,
      priority: this.query.priority,
    });
  }


  private getFormData(): OrdersQuery {
    const query: OrdersQuery = {
      orderTypeUID: this.config.type,
      requestedByUID: this.form.value.requestedByUID ?? null,
      status: this.form.value.status ?? null,
      keywords: this.form.value.keywords ?? null,
      categoryUID: this.form.value.categoryUID ?? null,
      providerUID: this.form.value.providerUID ?? null,
      projectUID: this.form.value.projectUID,
      orderNo: this.form.value.orderNo ?? null,
      priority: this.form.value.priority ?? null,
    };

    return query;
  }


  private clearFilters() {
    this.form.reset();
  }

}
