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

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AssetsStateSelector, CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { empExpandCollapse, FormHelper, sendEvent } from '@app/shared/utils';

import { SearcherAPIS } from '@app/data-services';

import { AssetsTransactionsQuery, buildLocationSelection, DateRange, EmptyAssetsTransactionsQuery,
         EmptyDateRange, EmptyLocationSelection, LocationSelection, RequestsList, TransactionDateType,
         TransactionDateTypesList, TransactionPartyType, TransactionPartyTypesList, TransactionStages,
         TransactionStatus, TransactionStatusList } from '@app/models';


export enum TransactionsFilterEventType {
  SEARCH_CLICKED = 'AssetsTransactionsFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'AssetsTransactionsFilterComponent.Event.ClearClicked',
}

interface TransactionsFilterFormModel extends FormGroup<{
  assignedToUID: FormControl<string>;
  assignedToOrgUnitUID: FormControl<string>;
  status: FormControl<TransactionStatus>;
  keywords: FormControl<string>;
  transactionTypeUID: FormControl<string>;
  location: FormControl<LocationSelection>;
  transactionsNo: FormControl<string[]>;
  entriesKeywords: FormControl<string>;
  tags: FormControl<string[]>;
  dateType: FormControl<TransactionDateType>;
  datePeriod: FormControl<DateRange>;
  partyType: FormControl<TransactionPartyType>;
  partyUID: FormControl<string>;
}> { }

@Component({
  selector: 'emp-inv-transactions-filter',
  templateUrl: './transactions-filter.component.html',
  animations: [empExpandCollapse],
})
export class AssetsTransactionsFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() stage: TransactionStages = null;

  @Input() query: AssetsTransactionsQuery = Object.assign({}, EmptyAssetsTransactionsQuery);

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() transactionsFilterEvent = new EventEmitter<EventInfo>();

  form: TransactionsFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  orgUnitsList: Identifiable[] = [];

  transactionTypesList: Identifiable[] = [];

  statusList: Identifiable<TransactionStatus>[] = TransactionStatusList;

  dateTypesList: Identifiable<TransactionDateType>[] = TransactionDateTypesList;

  partyTypesList: Identifiable<TransactionPartyType>[] = TransactionPartyTypesList;

  assigneesAPI = SearcherAPIS.assetsTransactionsAssignees;

  partiesAPI = SearcherAPIS.assetsTransactionsParties;

  selectedParty: Identifiable = null;

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


  onPartyTypeChanges(partyType: Identifiable<TransactionPartyType>) {
    this.form.controls.partyUID.reset();
    this.selectedParty = null;
  }


  onPartyChanges(party: Identifiable) {
    this.selectedParty = isEmpty(party) ? null : party;
  }


  onShowFiltersClicked() {
    this.showFilters = !this.showFilters;
    this.showFiltersChange.emit(this.showFilters);
  }


  onSearchClicked() {
    if (this.form.valid) {
      sendEvent(this.transactionsFilterEvent, TransactionsFilterEventType.SEARCH_CLICKED,
        { query: this.getFormData() });
    }
  }


  onClearFilters() {
    this.clearFilters();
    sendEvent(this.transactionsFilterEvent, TransactionsFilterEventType.CLEAR_CLICKED,
      { query: this.getFormData() });
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS,
        { requestsList: RequestsList.assets }),
      this.helper.select<Identifiable[]>(AssetsStateSelector.ASSETS_TRANSACTIONS_TYPES)
    ])
    .subscribe(([a, b]) => {
      this.orgUnitsList = a;
      this.transactionTypesList = b;
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
      transactionTypeUID: [null],
      location: [EmptyLocationSelection],
      transactionsNo: [null],
      entriesKeywords: [null],
      tags: [null],
      dateType: [TransactionDateType.Requested],
      datePeriod: [EmptyDateRange],
      partyType: [TransactionPartyType.RequestedBy],
      partyUID: [null],
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
      transactionTypeUID: this.query.transactionTypeUID,
      location: locationData,
      transactionsNo: this.query.transactionsNo,
      entriesKeywords: this.query.entriesKeywords,
      tags: this.query.tags,
      dateType: this.query.dateType ?? TransactionDateType.Requested,
      datePeriod: { fromDate: this.query.fromDate ?? null, toDate: this.query.toDate ?? null },
      partyType: this.query.partyType ?? TransactionPartyType.RequestedBy,
      partyUID: this.query.partyUID,
    });
  }


  private getFormData(): AssetsTransactionsQuery {
    Assertion.assert(!!this.stage, 'Programming error: assets-transactions stage is required.');

    const query: AssetsTransactionsQuery = {
      stage: this.stage,
      assignedToUID: this.form.value.assignedToUID ?? null,
      assignedToOrgUnitUID: this.form.value.assignedToOrgUnitUID ?? null,
      status: this.form.value.status ?? null,
      keywords: this.form.value.keywords ?? null,
      transactionTypeUID: this.form.value.transactionTypeUID ?? null,
      buildingUID: this.form.value.location?.building?.uid ?? null,
      floorUID: this.form.value.location?.floor?.uid ?? null,
      placeUID: this.form.value.location?.place?.uid ?? null,
      managerUID : null, // TODO: add field to form
      managerOrgUnitUID : null, // TODO: add field to form
      releasedByUID : null, // TODO: add field to form
      releasedByOrgUnitUID : null, // TODO: add field to form
      operationSourceUID : null, // TODO: add field to form
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
    this.selectedAssignedTo = null;
    this.selectedLocation = EmptyLocationSelection;
  }

}
