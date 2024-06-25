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

import { DynamicFormHelper, FormHelper, sendEvent } from '@app/shared/utils';

import { RequestsDataService } from '@app/data-services';

import { RequestQuery, RequestsList, EmptyRequestQuery, RequestType, FormFieldData, FormFieldDataType,
         EmptyRequestType, InputData, DataField } from '@app/models';

export enum RequestsFilterEventType {
  SEARCH_CLICKED = 'RequestsFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED = 'RequestsFilterComponent.Event.ClearClicked',
}

interface RequestsFilterFormModel extends FormGroup<{
  requesterOrgUnitUID: FormControl<string>;
  keywords: FormControl<string>;
  requestTypeUID: FormControl<string>;
  requestStatus: FormControl<string>;
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

  dynamicFields: FormFieldData[] = [];

  hasExtraFields = false;

  controlType = FormFieldDataType;

  formHelper = FormHelper;

  dynamicFormHelper = DynamicFormHelper;

  isLoading = false;

  isLoadingRequesterOrgUnits = false;

  requesterOrgUnitsList: Identifiable[] = [];

  requestTypesList: Identifiable[] = [];

  allRequestTypesList: Identifiable[] = [];

  requestStatusList: Identifiable[] = [];

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


  onRequesterOrgUnitChanged(requesterOrgUnit: Identifiable) {
    this.form.controls.requestTypeUID.reset();

    this.onRequestTypeChanged(EmptyRequestType);

    if (isEmpty(requesterOrgUnit)) {
      this.resetRequestTypesList();
    } else {
      this.getRequestTypeFiltered(requesterOrgUnit.uid);
    }
  }


  onRequestTypeChanged(requestType: RequestType) {
    this.buildNewDynamicFields(requestType?.inputData ?? []);
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
    this.clearDynamicFields();

    const payload = {
      isFormValid: this.form.valid,
      query: this.getFormData(),
    };

    sendEvent(this.requestsFilterEvent, RequestsFilterEventType.CLEAR_CLICKED, payload);
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      requesterOrgUnitUID: [''],
      keywords: [''],
      requestTypeUID: [''],
      requestStatus: [''],
      fromDate: [null],
      toDate: [null],
    });
  }


  private setFormData() {
    this.form.reset({
      requesterOrgUnitUID: this.query.requesterOrgUnitUID,
      keywords: this.query.keywords,
      requestTypeUID: this.query.requestTypeUID,
      requestStatus: this.query.requestStatus,
      fromDate: this.query.fromDate,
      toDate: this.query.toDate,
    });

    this.query.requestTypeFields.forEach(x =>
      DynamicFormHelper.setFormControlValue(this.form, x.field, x.value)
    );
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(RequestsStateSelector.ORGANIZATIONAL_UNITS,
        { requestsList: this.requestsList }),
      this.requestsData.getRequestTypes(this.requestsList),
      this.helper.select<Identifiable[]>(RequestsStateSelector.REQUEST_STATUS),
    ])
    .subscribe(([a, b, c]) => {
      this.requesterOrgUnitsList = a;
      this.setAllRequestTypesList(b);
      this.requestStatusList = c;
      this.isLoading = a.length === 0;
    });
  }


  private setAllRequestTypesList(requestTypes: RequestType[]) {
    this.allRequestTypesList = requestTypes ?? [];
    this.resetRequestTypesList();
  }


  private resetRequestTypesList() {
    this.requestTypesList = [...this.allRequestTypesList];
  }


  private getRequestTypeFiltered(requesterOrgUnitUID?: string) {
    this.isLoadingRequesterOrgUnits = true;

    this.requestsData.getRequestTypes(this.requestsList, requesterOrgUnitUID)
      .firstValue()
      .then(x => this.requestTypesList = x)
      .finally(() => this.isLoadingRequesterOrgUnits = false)
  }


  private clearFilters() {
    this.form.reset();
  }


  private clearDynamicFields() {
    this.buildNewDynamicFields([]);
  }


  private buildNewDynamicFields(inputData: InputData[]) {
    this.hasExtraFields = inputData.length > 0;
    const oldDynamicFields = [...this.dynamicFields];
    this.dynamicFields = [];
    setTimeout(() =>
      this.dynamicFields = DynamicFormHelper.buildDynamicFields(this.form, inputData, false, oldDynamicFields)
    );
  }


  private getFormData(): RequestQuery {
    const requestTypeFields: DataField[] =
      this.dynamicFields.map(x => DynamicFormHelper.buildDataField(this.form, x)) ?? [];

    const query: RequestQuery = {
      requestsList: this.requestsList,
      requesterOrgUnitUID: this.form.value.requesterOrgUnitUID,
      keywords: this.form.value.keywords ?? '',
      requestTypeUID: this.form.value.requestTypeUID,
      requestStatus: this.form.value.requestStatus,
      fromDate: this.form.value.fromDate,
      toDate: this.form.value.toDate,
      requestTypeFields,
    };

    return query;
  }

}
