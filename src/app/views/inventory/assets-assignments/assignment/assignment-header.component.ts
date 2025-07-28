/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, Identifiable, isEmpty, Validate } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { ArrayLibrary, FormHelper, sendEvent, sendEventIf } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { SearcherAPIS } from '@app/data-services';

import { AssetsAssignment, AssetsAssignmentFields, BaseActions, buildLocationSelection, EmptyAssetsAssignment,
         EmptyBaseActions, EmptyLocationSelection, LocationSelection, RequestsList } from '@app/models';


export enum AssignmentHeaderEventType {
  CREATE = 'AssetsAssignmentHeaderComponent.Event.Create',
  UPDATE = 'AssetsAssignmentHeaderComponent.Event.Update',
  DELETE = 'AssetsAssignmentHeaderComponent.Event.Delete',
}


interface AssignmentFormModel extends FormGroup<{
  assignedToUID: FormControl<string>;
  assignedToOrgUnitUID: FormControl<string>;
  releasedByUID: FormControl<string>;
  releasedByOrgUnitUID: FormControl<string>;
  location: FormControl<LocationSelection>;
}> { }

@Component({
  selector: 'emp-inv-assignment-header',
  templateUrl: './assignment-header.component.html',
})
export class AssetsAssignmentHeaderComponent implements OnInit, OnChanges, OnDestroy {

  @Input() isSaved = false;

  @Input() assignment: AssetsAssignment = EmptyAssetsAssignment;

  @Input() actions: BaseActions = EmptyBaseActions;

  @Output() assignmentHeaderEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: AssignmentFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  orgUnitsList: Identifiable[] = [];

  assigneesAPI = SearcherAPIS.assetsAssignees;


  constructor(private uiLayer: PresentationLayer,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
    this.enableEditor(true);
  }


  ngOnInit() {
    this.loadDataLists();
    this.validateFieldsRequired();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.assignment && this.isSaved) {
      this.enableEditor(false);
    }
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get hasActions(): boolean {
    return this.actions.canDelete || this.actions.canUpdate;
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.isSaved ? AssignmentHeaderEventType.UPDATE : AssignmentHeaderEventType.CREATE;
      sendEvent(this.assignmentHeaderEvent, eventType, { dataFields: this.getFormData() });
    }
  }


  onDeleteButtonClicked() {
    this.showConfirmMessage(AssignmentHeaderEventType.DELETE);
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;

    if (!this.editionMode && this.isSaved) {
      this.setFormData();
    }

    this.validateFormDisabled();
    this.validateFieldsRequired();
  }


  private loadDataLists() {
    this.isLoading = true;

    this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS, { requestsList: RequestsList.assets })
      .subscribe(x => {
        this.setOrganizationalUnitsList(x);
        this.isLoading = false;
      });
  }


  private setOrganizationalUnitsList(data: Identifiable[]) {
    this.orgUnitsList = data;
    this.validateDataLists();
  }


  private validateDataLists() {
    if(this.isSaved) {
      this.orgUnitsList =
        ArrayLibrary.insertIfNotExist(this.orgUnitsList ?? [], this.assignment.assignedToOrgUnit, 'uid');
    }
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      assignedToUID: ['', Validators.required],
      assignedToOrgUnitUID: ['', Validators.required],
      releasedByUID: ['', Validators.required],
      releasedByOrgUnitUID: ['', Validators.required],
      location: [EmptyLocationSelection, Validate.objectFieldsRequired('building', 'floor', 'place')],
    });
  }


  private setFormData() {
    setTimeout(() => {
      const locationData = buildLocationSelection(
        this.assignment.building, this.assignment.floor, this.assignment.place
      );

      this.form.reset({
        assignedToUID: isEmpty(this.assignment.assignedTo) ? null : this.assignment.assignedTo.uid,
        assignedToOrgUnitUID: isEmpty(this.assignment.assignedToOrgUnit) ? null : this.assignment.assignedToOrgUnit.uid,
        releasedByUID: isEmpty(this.assignment.releasedBy) ? null : this.assignment.releasedBy.uid,
        releasedByOrgUnitUID: isEmpty(this.assignment.releasedByOrgUnit) ? null : this.assignment.releasedByOrgUnit.uid,
        location: locationData,
      });

      this.validateDataLists();
    });
  }


  private getFormData(): AssetsAssignmentFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const data: AssetsAssignmentFields = {
      assignedToUID: this.form.value.assignedToUID ?? null,
      assignedToOrgUnitUID: this.form.value.assignedToOrgUnitUID ?? null,
      releasedByUID: this.form.value.releasedByUID ?? null,
      releasedByOrgUnitUID: this.form.value.releasedByOrgUnitUID ?? null,
      locationUID: this.form.value.location.place.uid ?? null,
    };

    return data;
  }


  private validateFieldsRequired() {
    setTimeout(() => {
      FormHelper.markControlsAsUntouched(this.form.controls.assignedToUID);
    });
  }


  private validateFormDisabled() {
    setTimeout(() => {
      const disable = this.isSaved && (!this.editionMode || !this.actions.canUpdate);
      this.formHelper.setDisableForm(this.form, disable);
    });
  }


  private showConfirmMessage(eventType: AssignmentHeaderEventType) {
    const assignmentUID = this.assignment.uid;
    const confirmType = this.getConfirmType(eventType);
    const title = this.getConfirmTitle(eventType);
    const message = this.getConfirmMessage(eventType);

    this.messageBox.confirm(message, title, confirmType)
      .firstValue()
      .then(x => sendEventIf(x, this.assignmentHeaderEvent, eventType, { assignmentUID }));
  }


  private getConfirmType(eventType: AssignmentHeaderEventType): 'AcceptCancel' | 'DeleteCancel' {
    switch (eventType) {
      case AssignmentHeaderEventType.DELETE:
        return 'DeleteCancel';
      default:
        return 'AcceptCancel';
    }
  }


  private getConfirmTitle(eventType: AssignmentHeaderEventType): string {
    switch (eventType) {
      case AssignmentHeaderEventType.DELETE: return 'Eliminar resguardo';
      default: return '';
    }
  }


  private getConfirmMessage(eventType: AssignmentHeaderEventType): string {
    const description = `el resguardo a cargo de
      <strong>${this.assignment.assignedTo.name} (${this.assignment.assignedToOrgUnit.name})</strong>
      y localización en <strong>${this.assignment.locationName}</strong>`;

    switch (eventType) {
      case AssignmentHeaderEventType.DELETE:
        return `Esta operación eliminará ${description}.<br><br>¿Elimino el resguardo?`;
      default: return '';
    }
  }

}
