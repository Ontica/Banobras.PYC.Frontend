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

import { CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { FixedAssetsDataService } from '@app/data-services';

import { empExpandCollapse, FormHelper, sendEvent } from '@app/shared/utils';

import { EmptyFixedAssetsQuery, FixedAssetsQuery, EntityStatus, EntityStatusList,
         RequestsList } from '@app/models';


export enum FixedAssetsFilterEventType {
  SEARCH_CLICKED = 'FixedAssetsFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'FixedAssetsFilterComponent.Event.ClearClicked',
}

interface FixedAssetsFilterFormModel extends FormGroup<{
  custodianOrgUnitUID: FormControl<string>;
  status: FormControl<EntityStatus>;
  keywords: FormControl<string>;
  fixedAssetTypeUID: FormControl<string>;
  inventoryNo: FormControl<string>;
}> { }


@Component({
  selector: 'emp-pyc-fixed-assets-filter',
  templateUrl: './fixed-assets-filter.component.html',
  animations: [empExpandCollapse],
})
export class FixedAssetsFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() query: FixedAssetsQuery = Object.assign({}, EmptyFixedAssetsQuery);

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() fixedAssetsFilterEvent = new EventEmitter<EventInfo>();

  form: FixedAssetsFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  statusList: Identifiable<EntityStatus>[] = EntityStatusList;

  orgUnitsList: Identifiable[] = [];

  fixedAssetTypesList: Identifiable[] = [];

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private fixedAssetsData: FixedAssetsDataService) {
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
      sendEvent(this.fixedAssetsFilterEvent, FixedAssetsFilterEventType.SEARCH_CLICKED,
        { query: this.getFormData() });
    }
  }


  onClearFilters() {
    this.clearFilters();
    sendEvent(this.fixedAssetsFilterEvent, FixedAssetsFilterEventType.CLEAR_CLICKED,
      { query: this.getFormData() });
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS,
        { requestsList: RequestsList.fixed_assets }),
      this.fixedAssetsData.getFixedAssetTypes(),
    ])
    .subscribe(([a, b]) => {
      this.orgUnitsList = a;
      this.fixedAssetTypesList = b;
      this.isLoading = false;
    });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      custodianOrgUnitUID: [null],
      status: [null],
      keywords: [null],
      fixedAssetTypeUID: [null],
      inventoryNo: [null],
    });
  }


  private setFormData() {
    this.form.reset({
      custodianOrgUnitUID: this.query.custodianOrgUnitUID,
      status: this.query.status,
      keywords: this.query.keywords,
      fixedAssetTypeUID: this.query.fixedAssetTypeUID,
      inventoryNo: this.query.inventoryNo,
    });
  }


  private getFormData(): FixedAssetsQuery {
    const query: FixedAssetsQuery = {
      custodianOrgUnitUID: this.form.value.custodianOrgUnitUID ?? null,
      status: this.form.value.status ?? null,
      keywords: this.form.value.keywords ?? null,
      fixedAssetTypeUID: this.form.value.fixedAssetTypeUID ?? null,
      inventoryNo: this.form.value.inventoryNo ?? null,
    };

    return query;
  }


  private clearFilters() {
    this.form.reset();
  }

}
