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

import { AssetsAssignmentsQuery, buildLocationSelection, EmptyAssetsAssignmentsQuery, EmptyLocationSelection,
         EntityStatus, EntityStatusList, LocationSelection, RequestsList } from '@app/models';


export enum AssignmentsFilterEventType {
  SEARCH_CLICKED = 'AssetsAssignmentsFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'AssetsAssignmentsFilterComponent.Event.ClearClicked',
}

interface AssignmentsFilterFormModel extends FormGroup<{
  assignedToUID: FormControl<string>;
  assignedToOrgUnitUID: FormControl<string>;
  status: FormControl<EntityStatus>;
  keywords: FormControl<string>;
  assetTypeUID: FormControl<string>;
  assetNo: FormControl<string>;
  location: FormControl<LocationSelection>;
  tags: FormControl<string[]>;
}> { }


@Component({
  selector: 'emp-inv-assignments-filter',
  templateUrl: './assignments-filter.component.html',
  animations: [empExpandCollapse],
})
export class AssetsAssignmentsFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() query: AssetsAssignmentsQuery = Object.assign({}, EmptyAssetsAssignmentsQuery);

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() assignmentsFilterEvent = new EventEmitter<EventInfo>();

  form: AssignmentsFilterFormModel;

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
      sendEvent(this.assignmentsFilterEvent, AssignmentsFilterEventType.SEARCH_CLICKED,
        { query: this.getFormData() });
    }
  }


  onClearFilters() {
    this.clearFilters();
    sendEvent(this.assignmentsFilterEvent, AssignmentsFilterEventType.CLEAR_CLICKED,
      { query: this.getFormData() });
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS, { requestsList: RequestsList.assets }),
      this.helper.select<Identifiable[]>(AssetsStateSelector.ASSETS_TYPES)
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
      tags: [null],
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
      tags: this.query.tags,
    });
  }


  private getFormData(): AssetsAssignmentsQuery {
    const query: AssetsAssignmentsQuery = {
      assignedToUID: this.form.value.assignedToUID ?? null,
      assignedToOrgUnitUID: this.form.value.assignedToOrgUnitUID ?? null,
      status: this.form.value.status ?? null,
      keywords: this.form.value.keywords ?? null,
      assetTypeUID: this.form.value.assetTypeUID ?? null,
      assetNo: this.form.value.assetNo ?? null,
      buildingUID: this.form.value.location?.building?.uid ?? null,
      floorUID: this.form.value.location?.floor?.uid ?? null,
      placeUID: this.form.value.location?.place?.uid ?? null,
      managerUID: null, // TODO: add field to form
      managerOrgUnitUID: null, // TODO: add field to form
      tags: this.form.value.tags ?? null,
    };

    return query;
  }


  private clearFilters() {
    this.form.reset();
    this.selectedAssignedTo = null;
    this.selectedLocation = EmptyLocationSelection;
  }

}
