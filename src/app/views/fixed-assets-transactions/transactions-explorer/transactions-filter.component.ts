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

import { empExpandCollapse, FormHelper, sendEvent } from '@app/shared/utils';

import { FixedAssetsDataService, FixedAssetTransactionsDataService, SearcherAPIS } from '@app/data-services';

import { FixedAssetTransactionPartyType, FixedAssetTransactionPartyTypesList,
         FixedAssetTransactionQueryDateType, FixedAssetTransactionQueryDateTypesList,
         FixedAssetTransactionsQuery, FixedAssetTransactionsStatus, FixedAssetTransactionStatusList,
         DateRange, EmptyFixedAssetTransactionsQuery, EmptyDateRange, RequestsList } from '@app/models';


export enum FixedAssetTransactionsFilterEventType {
  SEARCH_CLICKED = 'FixedAssetTransactionsFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'FixedAssetTransactionsFilterComponent.Event.ClearClicked',
}

interface FixedAssetTransactionsFilterFormModel extends FormGroup<{
  assetKeeperUID: FormControl<string>;
  assetKeeperOrgUnitUID: FormControl<string>;
  status: FormControl<FixedAssetTransactionsStatus>;
  keywords: FormControl<string>;
  transactionTypeUID: FormControl<string>;
  buildingUID: FormControl<string>;
  floorUID: FormControl<string>;
  placeUID: FormControl<string>;
  transactionsNo: FormControl<string[]>;
  entriesKeywords: FormControl<string>;
  tags: FormControl<string[]>;
  dateType: FormControl<FixedAssetTransactionQueryDateType>;
  datePeriod: FormControl<DateRange>;
  partyType: FormControl<FixedAssetTransactionPartyType>;
  partyUID: FormControl<string>;
}> { }

@Component({
  selector: 'emp-fa-transactions-filter',
  templateUrl: './transactions-filter.component.html',
  animations: [empExpandCollapse],
})
export class FixedAssetTransactionsFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() query: FixedAssetTransactionsQuery = Object.assign({}, EmptyFixedAssetTransactionsQuery);

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() fixedAssetTransactionsFilterEvent = new EventEmitter<EventInfo>();

  form: FixedAssetTransactionsFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  isLoadingFloors = false;

  isLoadingPlaces = false;

  orgUnitsList: Identifiable[] = [];

  transactionTypesList: Identifiable[] = [];

  buildingsList: Identifiable[] = [];

  floorsList: Identifiable[] = [];

  placesList: Identifiable[] = [];

  statusList: Identifiable<FixedAssetTransactionsStatus>[] = FixedAssetTransactionStatusList;

  dateTypesList: Identifiable<FixedAssetTransactionQueryDateType>[] = FixedAssetTransactionQueryDateTypesList;

  partyTypesList: Identifiable<FixedAssetTransactionPartyType>[] = FixedAssetTransactionPartyTypesList;

  keepersAPI = SearcherAPIS.fixedAssetKeepers;

  partiesAPI = SearcherAPIS.fixedAssetTransactionsParties;

  selectedParty: Identifiable = null;

  selectedAssetKeeper: Identifiable = null;

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private transactionsData: FixedAssetTransactionsDataService,
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


  onAssetKeeperChanges(keeper: Identifiable) {
    this.selectedAssetKeeper = isEmpty(keeper) ? null : keeper;
  }


  onPartyTypeChanges(partyType: Identifiable<FixedAssetTransactionPartyType>) {
    this.form.controls.partyUID.reset();
    this.selectedParty = null;
  }


  onPartyChanges(party: Identifiable) {
    this.selectedParty = isEmpty(party) ? null : party;
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
      sendEvent(this.fixedAssetTransactionsFilterEvent, FixedAssetTransactionsFilterEventType.SEARCH_CLICKED,
        { query: this.getFormData() });
    }
  }


  onClearFilters() {
    this.clearFilters();
    sendEvent(this.fixedAssetTransactionsFilterEvent, FixedAssetTransactionsFilterEventType.CLEAR_CLICKED,
      { query: this.getFormData() });
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS,
        { requestsList: RequestsList.fixed_assets }),
      this.transactionsData.getFixedAssetTransactionsTypes(),
      this.fixedAssetsData.getFixedAssetRootLocations(),
    ])
    .subscribe(([a, b, c]) => {
      this.orgUnitsList = a;
      this.transactionTypesList = b;
      this.buildingsList = c;
      this.isLoading = false;
    });
  }


  private getFloors(floorUID: string) {
    this.isLoadingFloors = true;

    this.fixedAssetsData.getFixedAssetLocationsList(floorUID)
      .firstValue()
      .then(x => this.floorsList = x)
      .finally(() => this.isLoadingFloors = false);
  }


  private getPlaces(placeUID: string) {
    this.isLoadingPlaces = true;

    this.fixedAssetsData.getFixedAssetLocationsList(placeUID)
      .firstValue()
      .then(x => this.placesList = x)
      .finally(() => this.isLoadingPlaces = false);
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      assetKeeperUID: [''],
      assetKeeperOrgUnitUID: [''],
      status: [null],
      keywords: [null],
      transactionTypeUID: [null],
      buildingUID: [null],
      floorUID: [null],
      placeUID: [null],
      transactionsNo: [null],
      entriesKeywords: [null],
      tags: [null],
      dateType: [FixedAssetTransactionQueryDateType.Requested],
      datePeriod: [EmptyDateRange],
      partyType: [FixedAssetTransactionPartyType.RequestedBy],
      partyUID: [null],
    });
  }


  private setFormData() {
    this.form.reset({
      assetKeeperUID: this.query.assetKeeperUID,
      assetKeeperOrgUnitUID: this.query.assetKeeperOrgUnitUID,
      status: this.query.status,
      keywords: this.query.keywords,
      transactionTypeUID: this.query.transactionTypeUID,
      buildingUID: this.query.buildingUID,
      floorUID: this.query.floorUID,
      placeUID: this.query.placeUID,
      transactionsNo: this.query.transactionsNo,
      entriesKeywords: this.query.entriesKeywords,
      tags: this.query.tags,
      dateType: this.query.dateType ?? FixedAssetTransactionQueryDateType.Requested,
      datePeriod: { fromDate: this.query.fromDate ?? null, toDate: this.query.toDate ?? null },
      partyType: this.query.partyType ?? FixedAssetTransactionPartyType.RequestedBy,
      partyUID: this.query.partyUID,
    });
  }


  private getFormData(): FixedAssetTransactionsQuery {
    const query: FixedAssetTransactionsQuery = {
      assetKeeperUID: this.form.value.assetKeeperUID ?? null,
      assetKeeperOrgUnitUID: this.form.value.assetKeeperOrgUnitUID ?? null,
      status: this.form.value.status ?? null,
      keywords: this.form.value.keywords ?? null,
      transactionTypeUID: this.form.value.transactionTypeUID ?? null,
      buildingUID: this.form.value.buildingUID ?? null,
      floorUID: this.form.value.floorUID ?? null,
      placeUID: this.form.value.placeUID ?? null,
      transactionsNo: this.form.value.transactionsNo ?? null,
      entriesKeywords: this.form.value.entriesKeywords ?? null,
      tags: this.form.value.tags ?? null,
      dateType: this.form.value.dateType ?? null,
      fromDate: this.form.value.datePeriod?.fromDate ?? '',
      toDate: this.form.value.datePeriod?.toDate ?? '',
      partyType: this.form.value.partyType ?? null,
      partyUID: this.form.value.partyUID ?? null,
    };

    return query;
  }


  private clearFilters() {
    this.form.reset();
    this.selectedParty = null;
    this.selectedAssetKeeper = null;
    this.floorsList = [];
    this.placesList = [];
  }

}
