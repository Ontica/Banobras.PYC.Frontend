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

import { DateString, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { RequestsStateSelector } from '@app/presentation/exported.presentation.types';

import { expandCollapse } from '@app/shared/animations/animations';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { RequestsDataService } from '@app/data-services';

import { RequestQuery, RequestsList, EmptyRequestQuery } from '@app/models';

export enum RequestsFilterEventType {
  SEARCH_CLICKED = 'RequestsFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED = 'RequestsFilterComponent.Event.ClearClicked',
}

interface RequestsFilterFormModel extends FormGroup<{
  organizationalUnitUID: FormControl<string>;
  requestTypeUID: FormControl<string>;
  requestStatus: FormControl<string>;
  responsibleUID: FormControl<string>;
  fromDate: FormControl<DateString>;
  toDate: FormControl<DateString>;
}> { }

@Component({
  selector: 'emp-pyc-requests-filter',
  templateUrl: './requests-filter.component.html',
  animations: [expandCollapse],
})
export class RequestsFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() requestsList: RequestsList = RequestsList.budgeting;

  @Input() query: RequestQuery = Object.assign({}, EmptyRequestQuery);

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() requestsFilterEvent = new EventEmitter<EventInfo>();

  form: RequestsFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  isLoadingOrganizationalUnits = false;

  organizationalUnitsList: Identifiable[] = [];

  requestTypesList: Identifiable[] = [];

  requestStatusList: Identifiable[] = [];

  responsiblesList: Identifiable[] = [];

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private requestsData: RequestsDataService) {
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


  onOrganizationalUnitChanged(organizationalUnit: Identifiable) {
    this.form.controls.requestTypeUID.reset();

    if (isEmpty(organizationalUnit)) {
      this.requestTypesList = [];
    } else {
      this.getRequestType(organizationalUnit.uid);
    }
  }


  onSearchClicked() {
    if (this.form.valid) {
      const payload = {
        isFormValid: this.form.valid,
        query: this.getFormData(),
      };

      sendEvent(this.requestsFilterEvent, RequestsFilterEventType.SEARCH_CLICKED, payload);
    }
  }


  onClearFilters() {
    this.clearFilters();

    const payload = {
      isFormValid: this.form.valid,
      query: this.getFormData(),
    };

    sendEvent(this.requestsFilterEvent, RequestsFilterEventType.CLEAR_CLICKED, payload);
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      organizationalUnitUID: [''],
      requestTypeUID: [''],
      requestStatus: [''],
      responsibleUID: [''],
      fromDate: [null],
      toDate: [null],
    });
  }


  private setFormData() {
    this.form.reset({
      organizationalUnitUID: this.query.organizationalUnitUID,
      requestTypeUID: this.query.requestTypeUID,
      requestStatus: this.query.requestStatus,
      responsibleUID: this.query.responsibleUID,
      fromDate: this.query.fromDate,
      toDate: this.query.toDate,
    });
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(RequestsStateSelector.ORGANIZATIONAL_UNITS,
        { requestsList: this.requestsList }),
      this.helper.select<Identifiable[]>(RequestsStateSelector.REQUEST_STATUS),
      this.requestsData.getRequestResponsibles(),
    ])
    .subscribe(([x, y, z]) => {
      this.organizationalUnitsList = x;
      this.requestStatusList = y;
      this.responsiblesList = z;
      this.isLoading = x.length === 0;
    });
  }


  private getRequestType(organizationalUnitUID: string) {
    this.isLoadingOrganizationalUnits = true;

    this.requestsData.getRequestTypes(this.requestsList, organizationalUnitUID)
      .firstValue()
      .then(x => this.requestTypesList = x)
      .finally(() => this.isLoadingOrganizationalUnits = false)
  }


  private clearFilters() {
    this.form.reset();
  }


  private getFormData(): RequestQuery {
    const query: RequestQuery = {
      requestsList: this.requestsList,
      organizationalUnitUID: this.form.value.organizationalUnitUID,
      requestTypeUID: this.form.value.requestTypeUID,
      requestStatus: this.form.value.requestStatus,
      responsibleUID: this.form.value.responsibleUID,
      fromDate: this.form.value.fromDate,
      toDate: this.form.value.toDate,
      requestFields: [],
    };

    return query;
  }

}
