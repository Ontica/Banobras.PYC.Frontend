/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { EventInfo, Identifiable } from '@app/core';

import { empExpandCollapse, FormHelper, sendEvent } from '@app/shared/utils';

import { EmptySuppliersQuery, SuppliersQuery, EntityStatus, EntityStatusList } from '@app/models';


export enum SuppliersFilterEventType {
  SEARCH_CLICKED = 'SuppliersFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'SuppliersFilterComponent.Event.ClearClicked',
}

interface SuppliersFilterFormModel extends FormGroup<{
  status: FormControl<EntityStatus>;
  keywords: FormControl<string>;
}> { }


@Component({
  selector: 'emp-ng-suppliers-filter',
  templateUrl: './suppliers-filter.component.html',
  animations: [empExpandCollapse],
})
export class SuppliersFilterComponent implements OnChanges, OnInit {

  @Input() query: SuppliersQuery = Object.assign({}, EmptySuppliersQuery);

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() suppliersFilterEvent = new EventEmitter<EventInfo>();

  form: SuppliersFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  statusList: Identifiable<EntityStatus>[] = EntityStatusList;


  constructor() {
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


  onShowFiltersClicked() {
    this.showFilters = !this.showFilters;
    this.showFiltersChange.emit(this.showFilters);
  }


  onSearchClicked() {
    if (this.form.valid) {
      sendEvent(this.suppliersFilterEvent, SuppliersFilterEventType.SEARCH_CLICKED,
        { query: this.getFormData() });
    }
  }


  onClearFilters() {
    this.clearFilters();
    sendEvent(this.suppliersFilterEvent, SuppliersFilterEventType.CLEAR_CLICKED,
      { query: this.getFormData() });
  }


  private loadDataLists() {

  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      status: [null],
      keywords: [null],
    });
  }


  private setFormData() {
    this.form.reset({
      status: this.query.status,
      keywords: this.query.keywords,
    });
  }


  private getFormData(): SuppliersQuery {
    const query: SuppliersQuery = {
      status: this.form.value.status ?? null,
      keywords: this.form.value.keywords ?? null,
    };

    return query;
  }


  private clearFilters() {
    this.form.reset();
  }

}
