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

import { BudgetingStateSelector, CataloguesStateSelector,
         PaymentsStateSelector } from '@app/presentation/exported.presentation.types';

import { empExpandCollapse, FormHelper, sendEvent } from '@app/shared/utils';

import { SearcherAPIS } from '@app/data-services';

import { ContractsQuery, EntityStatus, EntityStatusList, EmptyContractsQuery,
         RequestsList } from '@app/models';



export enum ContractsFilterEventType {
  SEARCH_CLICKED = 'ContractsFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'ContractsFilterComponent.Event.ClearClicked',
}

interface ContractsFilterFormModel extends FormGroup<{
  status: FormControl<EntityStatus>;
  keywords: FormControl<string>;
  contractTypeUID: FormControl<string>;
  managedByOrgUnitUID: FormControl<string>;
  budgetTypeUID: FormControl<string>;
  supplierUID: FormControl<string>;
  contractNo: FormControl<string>;
}> { }

@Component({
  selector: 'emp-pmt-contracts-filter',
  templateUrl: './contracts-filter.component.html',
  animations: [empExpandCollapse],
})
export class ContractsFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() query: ContractsQuery = Object.assign({}, EmptyContractsQuery);

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() contractsFilterEvent = new EventEmitter<EventInfo>();

  form: ContractsFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  statusList: Identifiable<EntityStatus>[] = EntityStatusList;

  orgUnitsList: Identifiable[] = [];

  contractTypesList: Identifiable[] = [];

  budgetTypesList: Identifiable[] = [];

  suppliersAPI = SearcherAPIS.suppliers;

  selectedSupplier: Identifiable = null;

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


  onSupplierChanges(supplier: Identifiable) {
    this.selectedSupplier = supplier;
  }


  onShowFiltersClicked() {
    this.showFilters = !this.showFilters;
    this.showFiltersChange.emit(this.showFilters);
  }


  onSearchClicked() {
    if (this.form.valid) {
      sendEvent(this.contractsFilterEvent, ContractsFilterEventType.SEARCH_CLICKED,
        { query: this.getFormData() });
    }
  }


  onClearFilters() {
    this.clearFilters();
    sendEvent(this.contractsFilterEvent, ContractsFilterEventType.CLEAR_CLICKED,
      { query: this.getFormData() });
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS,
        { requestsList: RequestsList.contracts }),
      this.helper.select<Identifiable[]>(BudgetingStateSelector.BUDGET_TYPES),
      this.helper.select<Identifiable[]>(PaymentsStateSelector.CONTRACTS_TYPES),
    ])
    .subscribe(([a, b, c]) => {
      this.orgUnitsList = a;
      this.budgetTypesList = b;
      this.contractTypesList = c;
      this.isLoading = false;
    });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      status: [null],
      keywords: [null],
      contractTypeUID: [null],
      managedByOrgUnitUID: [null],
      budgetTypeUID: [null],
      supplierUID: [null],
      contractNo: [null],
    });
  }


  private setFormData() {
    this.form.reset({
      status: this.query.status,
      keywords: this.query.keywords,
      contractTypeUID: this.query.contractTypeUID,
      managedByOrgUnitUID: this.query.managedByOrgUnitUID,
      budgetTypeUID: this.query.budgetTypeUID,
      supplierUID: this.query.supplierUID,
      contractNo: this.query.contractNo,
    });
  }


  private getFormData(): ContractsQuery {
    const query: ContractsQuery = {
      status: this.form.value.status ?? null,
      keywords: this.form.value.keywords ?? null,
      contractTypeUID: this.form.value.contractTypeUID ?? null,
      managedByOrgUnitUID: this.form.value.managedByOrgUnitUID ?? null,
      budgetTypeUID: this.form.value.budgetTypeUID ?? null,
      supplierUID: this.form.value.supplierUID,
      contractNo: this.form.value.contractNo ?? null,
    };

    return query;
  }


  private clearFilters() {
    this.form.reset();
  }

}
