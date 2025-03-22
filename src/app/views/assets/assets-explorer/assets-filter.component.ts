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

import { EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AssetsStateSelector, CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { SearcherAPIS } from '@app/data-services';

import { empExpandCollapse, FormHelper, sendEvent } from '@app/shared/utils';

import { EmptyAssetsQuery, AssetsQuery, EntityStatus, EntityStatusList, RequestsList, LocationSelection,
         EmptyLocationSelection, buildLocationSelection } from '@app/models';


export enum AssetsFilterEventType {
  SEARCH_CLICKED = 'AssetsFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'AssetsFilterComponent.Event.ClearClicked',
}

interface AssetsFilterFormModel extends FormGroup<{
  assignedToUID: FormControl<string>;
  assignedToOrgUnitUID: FormControl<string>;
  status: FormControl<EntityStatus>;
  keywords: FormControl<string>;
  assetTypeUID: FormControl<string>;
  assetNo: FormControl<string>;
  location: FormControl<LocationSelection>;
}> { }


@Component({
  selector: 'emp-pyc-assets-filter',
  templateUrl: './assets-filter.component.html',
  animations: [empExpandCollapse],
})
export class AssetsFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() query: AssetsQuery = Object.assign({}, EmptyAssetsQuery);

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() assetsFilterEvent = new EventEmitter<EventInfo>();

  form: AssetsFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  statusList: Identifiable<EntityStatus>[] = EntityStatusList;

  orgUnitsList: Identifiable[] = [];

  assetTypesList: Identifiable[] = [];

  assigneesAPI = SearcherAPIS.assetsAssignees;

  selectedAssignedTo: Identifiable = null;

  selectedLocation: LocationSelection = EmptyLocationSelection;

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


  onAssignedToChanges(keeper: Identifiable) {
    this.selectedAssignedTo = isEmpty(keeper) ? null : keeper;
  }


  onLocationChanges(location: LocationSelection) {
    this.selectedLocation = !location ? EmptyLocationSelection : location;
  }


  onShowFiltersClicked() {
    this.showFilters = !this.showFilters;
    this.showFiltersChange.emit(this.showFilters);
  }


  onSearchClicked() {
    if (this.form.valid) {
      sendEvent(this.assetsFilterEvent, AssetsFilterEventType.SEARCH_CLICKED,
        { query: this.getFormData() });
    }
  }


  onClearFilters() {
    this.clearFilters();
    sendEvent(this.assetsFilterEvent, AssetsFilterEventType.CLEAR_CLICKED,
      { query: this.getFormData() });
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS,
        { requestsList: RequestsList.assets }),
      this.helper.select<Identifiable[]>(AssetsStateSelector.ASSET_TYPES)
    ])
    .subscribe(([a, b]) => {
      this.orgUnitsList = a;
      this.assetTypesList = b;
      this.isLoading = false;
    });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      assignedToUID: [''],
      assignedToOrgUnitUID: [''],
      status: [null],
      keywords: [null],
      assetTypeUID: [null],
      assetNo: [null],
      location: [EmptyLocationSelection],
    });
  }


  private setFormData() {
    const locationData = buildLocationSelection(
      this.selectedLocation.building, this.selectedLocation.floor, this.selectedLocation.place
    );

    this.form.reset({
      assignedToUID: this.query.assignedToUID,
      assignedToOrgUnitUID: this.query.assignedToOrgUnitUID,
      status: this.query.status,
      keywords: this.query.keywords,
      assetTypeUID: this.query.assetTypeUID,
      assetNo: this.query.assetNo,
      location: locationData,
    });
  }


  private getFormData(): AssetsQuery {
    const query: AssetsQuery = {
      assignedToUID: this.form.value.assignedToUID ?? null,
      assignedToOrgUnitUID: this.form.value.assignedToOrgUnitUID ?? null,
      status: this.form.value.status ?? null,
      keywords: this.form.value.keywords ?? null,
      assetTypeUID: this.form.value.assetTypeUID ?? null,
      assetNo: this.form.value.assetNo ?? null,
      buildingUID: this.form.value.location?.building?.uid ?? null,
      floorUID: this.form.value.location?.floor?.uid ?? null,
      placeUID: this.form.value.location?.place?.uid ?? null,
    };

    return query;
  }


  private clearFilters() {
    this.form.reset();
    this.selectedAssignedTo = null;
    this.selectedLocation = EmptyLocationSelection;
  }

}
