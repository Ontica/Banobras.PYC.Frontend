/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';

import { EventInfo, Identifiable } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { EmptyRecordSearchQuery, RecordSearchQuery, RecordSearchType,
         RecordSearchTypeList } from '@app/models';

export enum RecordSearchFilterEventType {
  SEARCH_CLICKED = 'RecordSearchFilterComponent.Event.SearchClicked',
}

@Component({
  selector: 'emp-pyc-record-search-filter',
  templateUrl: './record-search-filter.component.html',
})
export class RecordSearchFilterComponent implements OnChanges, OnInit, OnDestroy {

 @Input() query: RecordSearchQuery = EmptyRecordSearchQuery;

  @Output() recordSearchFilterEvent = new EventEmitter<EventInfo>();

  formData = {
    type: RecordSearchType.Budget,
    datePeriod: { fromDate: null, toDate: null},
    keywords: '',
  };

  recordSearchTypeList: Identifiable[] = RecordSearchTypeList;

  isLoading = false;

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges() {
    this.initFormData();
  }


  ngOnInit() {
    this.loadDataList();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get isFormValid(): boolean {
    return !!this.formData.keywords && !!this.formData.type;
  }


  onClearKeywords() {
    this.formData.keywords = '';
  }


  onSearchClicked() {
    sendEvent(this.recordSearchFilterEvent, RecordSearchFilterEventType.SEARCH_CLICKED,
      {query: this.getRecordSearchQuery()});
  }


  private loadDataList() {

  }


  private initFormData() {
    this.formData = {
      type: this.query.type,
      datePeriod: this.query.datePeriod,
      keywords: this.query.keywords,
    };
  }


  private getRecordSearchQuery(): RecordSearchQuery {
    const query: RecordSearchQuery = {
      type: this.formData.type as RecordSearchType ?? null,
      datePeriod: this.formData.datePeriod,
      keywords: this.formData.keywords,
    };

    return query;
  }

}
