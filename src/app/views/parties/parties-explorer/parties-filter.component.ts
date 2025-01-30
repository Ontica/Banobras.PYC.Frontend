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

import { EmptyPartiesQuery, PartiesQuery, EntityStatus, EntityStatusList, PartyObjectTypes,
         EmptyPartyExplorerTypeConfig, ExplorerTypeConfig } from '@app/models';


export enum PartiesFilterEventType {
  SEARCH_CLICKED = 'PartiesFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'PartiesFilterComponent.Event.ClearClicked',
}

interface PartiesFilterFormModel extends FormGroup<{
  status: FormControl<EntityStatus>;
  keywords: FormControl<string>;
}> { }


@Component({
  selector: 'emp-ng-parties-filter',
  templateUrl: './parties-filter.component.html',
  animations: [empExpandCollapse],
})
export class PartiesFilterComponent implements OnChanges, OnInit {

  @Input() config: ExplorerTypeConfig<PartyObjectTypes> = EmptyPartyExplorerTypeConfig;

  @Input() query: PartiesQuery = Object.assign({}, EmptyPartiesQuery);

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() partiesFilterEvent = new EventEmitter<EventInfo>();

  form: PartiesFilterFormModel;

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
      sendEvent(this.partiesFilterEvent, PartiesFilterEventType.SEARCH_CLICKED,
        { query: this.getFormData() });
    }
  }


  onClearFilters() {
    this.clearFilters();
    sendEvent(this.partiesFilterEvent, PartiesFilterEventType.CLEAR_CLICKED,
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


  private getFormData(): PartiesQuery {
    const query: PartiesQuery = {
      typeUID: this.config.type,
      status: this.form.value.status ?? null,
      keywords: this.form.value.keywords ?? null,
    };

    return query;
  }


  private clearFilters() {
    this.form.reset();
  }

}
