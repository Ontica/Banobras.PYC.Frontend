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

import { Empty, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { AssetsDataService, SearcherAPIS } from '@app/data-services';

import { empExpandCollapse, FormHelper, sendEvent } from '@app/shared/utils';

import { EmptyAssetsQuery, AssetsQuery, EntityStatus, EntityStatusList,
         RequestsList } from '@app/models';


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
  buildingUID: FormControl<string>;
  floorUID: FormControl<string>;
  placeUID: FormControl<string>;
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

  isLoadingFloors = false;

  isLoadingPlaces = false;

  statusList: Identifiable<EntityStatus>[] = EntityStatusList;

  orgUnitsList: Identifiable[] = [];

  assetTypesList: Identifiable[] = [];

  buildingsList: Identifiable[] = [];

  floorsList: Identifiable[] = [];

  placesList: Identifiable[] = [];

  assigneesAPI = SearcherAPIS.assetsAssignees;

  selectedAssignedTo: Identifiable = null;

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private assetsData: AssetsDataService) {
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


  onBuildingChanges(building: Identifiable) {
    this.form.controls.floorUID.reset();

    if (isEmpty(building)) {
      this.floorsList = [];
    } else {
      this.getFloors(building.uid);
    }

    this.onFloorChanges(Empty);
  }


  onFloorChanges(floor: Identifiable) {
    this.form.controls.placeUID.reset();

    if (isEmpty(floor)) {
      this.placesList = [];
    } else {
      this.getPlaces(floor.uid);
    }
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
      this.assetsData.getAssetTypes(),
      this.assetsData.getAssetRootLocations(),
    ])
    .subscribe(([a, b, c]) => {
      this.orgUnitsList = a;
      this.assetTypesList = b;
      this.buildingsList = c;
      this.isLoading = false;
    });
  }


  private getFloors(floorUID: string) {
    this.isLoadingFloors = true;

    this.assetsData.getAssetLocationsList(floorUID)
      .firstValue()
      .then(x => this.floorsList = x)
      .finally(() => this.isLoadingFloors = false);
  }


  private getPlaces(placeUID: string) {
    this.isLoadingPlaces = true;

    this.assetsData.getAssetLocationsList(placeUID)
      .firstValue()
      .then(x => this.placesList = x)
      .finally(() => this.isLoadingPlaces = false);
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
      buildingUID: [null],
      floorUID: [null],
      placeUID: [null],
    });
  }


  private setFormData() {
    this.form.reset({
      assignedToUID: this.query.assignedToUID,
      assignedToOrgUnitUID: this.query.assignedToOrgUnitUID,
      status: this.query.status,
      keywords: this.query.keywords,
      assetTypeUID: this.query.assetTypeUID,
      assetNo: this.query.assetNo,
      buildingUID: this.query.buildingUID,
      floorUID: this.query.floorUID,
      placeUID: this.query.placeUID,
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
      buildingUID: this.form.value.buildingUID ?? null,
      floorUID: this.form.value.floorUID ?? null,
      placeUID: this.form.value.placeUID ?? null,
    };

    return query;
  }


  private clearFilters() {
    this.form.reset();
    this.selectedAssignedTo = null;
    this.floorsList = [];
    this.placesList = [];
  }

}
