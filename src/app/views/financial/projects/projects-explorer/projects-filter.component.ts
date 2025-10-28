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

import { EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { CataloguesStateSelector,
         FinancialStateSelector } from '@app/presentation/exported.presentation.types';

import { empExpandCollapse, FormHelper, sendEvent } from '@app/shared/utils';

import { FinancialProjectsQuery, EmptyFinancialProjectsQuery, EntityStatusList, EntityStatus,
         RequestsList } from '@app/models';


export enum ProjectsFilterEventType {
  SEARCH_CLICKED = 'FinancialProjectsFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'FinancialProjectsFilterComponent.Event.ClearClicked',
}

interface ProjectsFilterFormModel extends FormGroup<{
  keywords: FormControl<string>;
  status: FormControl<EntityStatus>;
  baseOrgUnitUID: FormControl<string>;
  projectTypeUID: FormControl<string>;
  programUID: FormControl<string>;
  subprogramUID: FormControl<string>;
}> { }

@Component({
  selector: 'emp-financial-projects-filter',
  templateUrl: './projects-filter.component.html',
  animations: [empExpandCollapse],
})
export class FinancialProjectsFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() query: FinancialProjectsQuery = Object.assign({}, EmptyFinancialProjectsQuery);

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() projectsFilterEvent = new EventEmitter<EventInfo>();

  form: ProjectsFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  statusList: Identifiable<EntityStatus>[] = EntityStatusList;

  orgUnitsList: Identifiable[] = [];

  projectTypesList: Identifiable[] = [];

  programsList: Identifiable[] = [];

  subprogramsList: Identifiable[] = [];

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


  onShowFiltersClicked() {
    this.showFilters = !this.showFilters;
    this.showFiltersChange.emit(this.showFilters);
  }


  onSearchClicked() {
    if (this.form.valid) {
      sendEvent(this.projectsFilterEvent, ProjectsFilterEventType.SEARCH_CLICKED,
        { query: this.getFormData() });
    }
  }


  onClearFilters() {
    this.clearFilters();
    sendEvent(this.projectsFilterEvent, ProjectsFilterEventType.CLEAR_CLICKED,
      { query: this.getFormData() });
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS, { requestsList: RequestsList.cashflow }),
      this.helper.select<Identifiable[]>(FinancialStateSelector.PROJECT_TYPES),
      this.helper.select<Identifiable[]>(FinancialStateSelector.PROGRAMS),
      this.helper.select<Identifiable[]>(FinancialStateSelector.SUBPROGRAMS),
    ])
    .subscribe(([a, b, c, d]) => {
      this.orgUnitsList = a;
      this.projectTypesList = b;
      this.programsList = c;
      this.subprogramsList = d;
      this.isLoading = false;
    });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      keywords: [null],
      status: [null],
      baseOrgUnitUID: [null],
      projectTypeUID: [null],
      programUID: [null],
      subprogramUID: [null],
    });
  }


  private setFormData() {
    this.form.reset({
      keywords: this.query.keywords,
      status: this.query.status,
      baseOrgUnitUID: this.query.baseOrgUnitUID,
      projectTypeUID: this.query.projectTypeUID,
      programUID: this.query.programUID,
      subprogramUID: this.query.subprogramUID,
    });
  }


  private getFormData(): FinancialProjectsQuery {
    const query: FinancialProjectsQuery = {
      keywords: this.form.value.keywords ?? null,
      status: this.form.value.status ?? null,
      baseOrgUnitUID: this.form.value.baseOrgUnitUID ?? null,
      projectTypeUID: this.form.value.projectTypeUID ?? null,
      programUID: this.form.value.programUID ?? null,
      subprogramUID: this.form.value.subprogramUID ?? null,
    };

    return query;
  }


  private clearFilters() {
    this.form.reset();
  }

}
