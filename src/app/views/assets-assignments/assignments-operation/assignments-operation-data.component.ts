/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, DateString, EventInfo, Identifiable, Validate } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { SearcherAPIS } from '@app/data-services';

import { AssetsAssignmentsOperationCommand, AssetsAssignmentsOperationData,
         EmptyAssetsAssignmentsOperationData, EmptyLocationSelection, getAssetsAssignmentsOperationName,
         LocationSelection, RequestsList } from '@app/models';


export enum AssignmentsOperationDataEventType {
  EXECUTE_CLICKED     = 'AssetsAssignmentsOperationDataComponent.Event.ExecuteClicked',
  CLOSE_MODAL_CLICKED = 'AssetsAssignmentsOperationDataComponent.Event.CloseModalClicked',
}


interface AssignmentsOperationDataModel extends FormGroup<{
  applicationDate: FormControl<DateString>;
  assignedToUID: FormControl<string>;
  assignedToOrgUnitUID: FormControl<string>;
  location: FormControl<LocationSelection>;
  identificators: FormControl<string[]>;
  tags: FormControl<string[]>;
  description: FormControl<string>;
}> { }

@Component({
  selector: 'emp-inv-assignments-operation-data',
  templateUrl: './assignments-operation-data.component.html',
})
export class AssetsAssignmentsOperationDataComponent implements OnInit, OnDestroy {

  @Input() data: AssetsAssignmentsOperationData = Object.assign({}, EmptyAssetsAssignmentsOperationData);

  @Output() assignmentsOperationDataEvent = new EventEmitter<EventInfo>();

  form: AssignmentsOperationDataModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  orgUnitsList: Identifiable[] = [];

  assigneesAPI = SearcherAPIS.assetsTransactionsAssignees;

  managersAPI = SearcherAPIS.assetsTransactionsManagers;

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get title(): string {
    const isAssignments = this.data.assignments.length > 0;
    const itemsType = isAssignments ? 'resguardos' : 'movimientos';
    const itemsCount = isAssignments ? this.data.assignments.length : this.data.assets.length;
    return `${getAssetsAssignmentsOperationName(this.data.operation)} (${itemsCount} ${itemsType})`
  }


  onCloseModalClicked() {
    sendEvent(this.assignmentsOperationDataEvent, AssignmentsOperationDataEventType.CLOSE_MODAL_CLICKED);
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const payload = {
        operation: this.data.operation,
        command: this.getFormData()
      };

      sendEvent(this.assignmentsOperationDataEvent, AssignmentsOperationDataEventType.EXECUTE_CLICKED, payload);
    }
  }


  private loadDataLists() {
    this.isLoading = true;

    this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS, { requestsList: RequestsList.assets })
      .subscribe(x => {
        this.orgUnitsList = x;
        this.isLoading = false;
      });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      applicationDate: [null],
      assignedToUID: ['', Validators.required],
      assignedToOrgUnitUID: ['', Validators.required],
      location: [EmptyLocationSelection, Validate.objectFieldsRequired('building', 'floor', 'place')],
      identificators: [null],
      tags: [null],
      description: ['', Validators.required],
    });
  }


  private getFormData(): AssetsAssignmentsOperationCommand {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    let data: AssetsAssignmentsOperationCommand = {
      applicationDate: this.form.value.applicationDate ?? null,
      assignedToUID: this.form.value.assignedToUID ?? null,
      assignedToOrgUnitUID: this.form.value.assignedToOrgUnitUID ?? null,
      locationUID: this.form.value.location.place.uid ?? null,
      identificators: this.form.value.identificators ?? [],
      tags: this.form.value.tags ?? [],
      description: this.form.value.description ?? null,
    };

    if (this.data.assignments.length > 0) data.assignments = this.data.assignments;
    if (this.data.assets.length > 0) data.assets = this.data.assets;

    return data;
  }

}
