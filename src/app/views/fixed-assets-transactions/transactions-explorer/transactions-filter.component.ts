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

import { CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { empExpandCollapse, FormHelper, sendEvent } from '@app/shared/utils';

import { FixedAssetTransactionsDataService, SearcherAPIS } from '@app/data-services';

import { FixedAssetTransactionPartyType, FixedAssetTransactionPartyTypesList,
         FixedAssetTransactionQueryDateType, FixedAssetTransactionQueryDateTypesList,
         FixedAssetTransactionsQuery, FixedAssetTransactionsStatus, FixedAssetTransactionStatusList,
         DateRange, EmptyFixedAssetTransactionsQuery, EmptyDateRange, RequestsList } from '@app/models';


export enum FixedAssetTransactionsFilterEventType {
  SEARCH_CLICKED = 'FixedAssetTransactionsFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'FixedAssetTransactionsFilterComponent.Event.ClearClicked',
}

interface FixedAssetTransactionsFilterFormModel extends FormGroup<{
  basePartyUID: FormControl<string>;
  status: FormControl<FixedAssetTransactionsStatus>;
  keywords: FormControl<string>;
  transactionTypeUID: FormControl<string>;
  operationSourceUID: FormControl<string>;
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

  orgUnitsList: Identifiable[] = [];

  operationSourcesList: Identifiable[] = [];

  transactionTypesList: Identifiable[] = [];

  statusList: Identifiable<FixedAssetTransactionsStatus>[] = FixedAssetTransactionStatusList;

  dateTypesList: Identifiable<FixedAssetTransactionQueryDateType>[] = FixedAssetTransactionQueryDateTypesList;

  partyTypesList: Identifiable<FixedAssetTransactionPartyType>[] = FixedAssetTransactionPartyTypesList;

  partiesAPI = SearcherAPIS.fixedAssetTransactionsParties;

  selectedParty: Identifiable = null;

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private transactionsData: FixedAssetTransactionsDataService) {
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


  onPartyTypeChanges(partyType: Identifiable<FixedAssetTransactionPartyType>) {
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
      basePartyUID: [''],
      status: [null],
      keywords: [null],
      transactionTypeUID: [null],
      operationSourceUID: [null],
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
      basePartyUID: this.query.basePartyUID,
      status: this.query.status,
      keywords: this.query.keywords,
      transactionTypeUID: this.query.transactionTypeUID,
      operationSourceUID: this.query.operationSourceUID,
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
      basePartyUID: this.form.value.basePartyUID ?? null,
      status: this.form.value.status ?? null,
      keywords: this.form.value.keywords ?? null,
      transactionTypeUID: this.form.value.transactionTypeUID ?? null,
      operationSourceUID: this.form.value.operationSourceUID ?? null,
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
  }

}
