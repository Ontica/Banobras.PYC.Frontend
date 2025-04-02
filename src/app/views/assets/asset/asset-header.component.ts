/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { ArrayLibrary, FormHelper, sendEvent } from '@app/shared/utils';

import { Asset, AssetFields, DateRange, EmptyAsset, EmptyDateRange, BaseActions, EmptyBaseActions,
         LocationSelection, EmptyLocationSelection, buildLocationSelection } from '@app/models';


export enum AssetHeaderEventType {
  CREATE = 'AssetHeaderComponent.Event.CreateAsset',
  UPDATE = 'AssetHeaderComponent.Event.UpdateAsset',
  DELETE = 'AssetHeaderComponent.Event.DeleteAsset',
}

interface AssetFormModel extends FormGroup<{
  assetTypeUID: FormControl<string>;
  datePeriod: FormControl<DateRange>;
  assignedToOrgUnitUID: FormControl<string>;
  assignedToUID: FormControl<string>;
  name: FormControl<string>;
  brand: FormControl<string>;
  model: FormControl<string>;
  year: FormControl<number>;
  location: FormControl<LocationSelection>;
  description: FormControl<string>;
}> { }

@Component({
  selector: 'emp-pyc-asset-header',
  templateUrl: './asset-header.component.html',
})
export class AssetHeaderComponent implements OnInit, OnChanges {

  @Input() isSaved = false;

  @Input() asset: Asset = EmptyAsset;

  @Input() actions: BaseActions = EmptyBaseActions;

  @Output() assetHeaderEvent = new EventEmitter<EventInfo>();

  form: AssetFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  organizationalUnitsList: Identifiable[] = [];

  assetTypesList: Identifiable[] = [];

  assignedTosList: Identifiable[] = [];


  constructor(private messageBox: MessageBoxService) {
    this.initForm();
    this.enableEditor(true);
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.asset && this.isSaved) {
      this.enableEditor(false);
      this.validateDataLists();
    }
  }


  get hasActions(): boolean {
    return this.actions.canDelete || this.actions.canUpdate;
  }


  onSubmitButtonClicked() {
    if (FormHelper.isFormReadyAndInvalidate(this.form)) {
      let eventType = AssetHeaderEventType.CREATE;

      if (this.isSaved) {
        eventType = AssetHeaderEventType.UPDATE;
      }

      sendEvent(this.assetHeaderEvent, eventType, { dataFields: this.getFormData() });
    }
  }


  onDeleteButtonClicked() {
    this.showConfirmMessage(AssetHeaderEventType.DELETE);
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;

    if (!this.editionMode && this.isSaved) {
      this.setFormData();
    }

    this.validateFormDisabled();
  }


  private loadDataLists() {

  }


  private validateDataLists() {
    if (this.asset.assignedToOrgUnit) {
      this.organizationalUnitsList =
        ArrayLibrary.insertIfNotExist(this.organizationalUnitsList ?? [], this.asset.assignedToOrgUnit, 'uid');
    }
    if (this.asset.assignedTo) {
      this.assignedTosList =
        ArrayLibrary.insertIfNotExist(this.assignedTosList ?? [], this.asset.assignedTo, 'uid');
    }
    if (this.asset.assetType) {
      this.assetTypesList =
        ArrayLibrary.insertIfNotExist(this.assetTypesList ?? [], this.asset.assetType, 'uid');
    }
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      assetTypeUID: [''],
      datePeriod: [EmptyDateRange],
      name: [''],
      assignedToOrgUnitUID: [''],
      assignedToUID: [''],
      brand: [''],
      model: [''],
      year: [null],
      location: [EmptyLocationSelection],
      description: [''],
    });
  }


  private setFormData() {
    setTimeout(() => {
      const locationData = buildLocationSelection(this.asset.building, this.asset.floor, this.asset.place);

      this.form.reset({
        assetTypeUID: isEmpty(this.asset.assetType) ? null : this.asset.assetType.uid,
        name: this.asset.name ?? '',
        datePeriod: { fromDate: this.asset.startDate ?? null, toDate: this.asset.endDate ?? null },
        assignedToOrgUnitUID: isEmpty(this.asset.assignedToOrgUnit) ? null : this.asset.assignedToOrgUnit.uid,
        assignedToUID: isEmpty(this.asset.assignedTo) ? null : this.asset.assignedTo.uid,
        brand: this.asset.brand ?? '',
        model: this.asset.model ?? '',
        year: this.asset.year > 0 ? this.asset.year : null,
        location: locationData,
        description: this.asset.description ?? '',
      });
    });
  }


  private validateFormDisabled() {
    setTimeout(() => {
      const disable = this.isSaved && (!this.editionMode || !this.actions.canUpdate);
      FormHelper.setDisableForm(this.form, disable);
    });
  }


  private getFormData(): AssetFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const data: AssetFields = {
      assetTypeUID: this.form.value.assetTypeUID ?? null,
      name: this.form.value.name ?? null,
      description: this.form.value.description ?? null,
      brand: this.form.value.brand ?? null,
      model: this.form.value.model ?? null,
      year: this.form.value.year > 0 ? this.form.value.year : null,
      assignedToOrgUnitUID: this.form.value.assignedToOrgUnitUID ?? null,
      assignedToUID: this.form.value.assignedToUID ?? null,
      buildingUID: this.form.value.location?.building?.uid ?? null,
      floorUID: this.form.value.location?.floor?.uid ?? null,
      placeUID: this.form.value.location?.place?.uid ?? null,
      startDate: this.form.value.datePeriod.fromDate ?? null,
      endDate: this.form.value.datePeriod.toDate ?? null,
    };

    return data;
  }


  private showConfirmMessage(eventType: AssetHeaderEventType) {
    const confirmType = this.getConfirmType(eventType);
    const title = this.getConfirmTitle(eventType);
    const message = this.getConfirmMessage(eventType);

    this.messageBox.confirm(message, title, confirmType)
      .firstValue()
      .then(x => this.validateAndSendEvent(eventType, x));
  }


  private getConfirmType(eventType: AssetHeaderEventType): 'AcceptCancel' | 'DeleteCancel' {
    switch (eventType) {
      case AssetHeaderEventType.DELETE:
        return 'DeleteCancel';
      default:
        return 'AcceptCancel';
    }
  }


  private getConfirmTitle(eventType: AssetHeaderEventType): string {
    switch (eventType) {
      case AssetHeaderEventType.DELETE: return 'Eliminar activo fijo';
      default: return '';
    }
  }


  private getConfirmMessage(eventType: AssetHeaderEventType): string {
    switch (eventType) {
      case AssetHeaderEventType.DELETE:
        return `Esta operación eliminará el activo fijo
                <strong>${this.asset.assetNo}: ${this.asset.name}</strong>
                (${this.asset.assetType?.name ?? 'No determinado'})
                del área responsable <strong>${this.asset.assignedToOrgUnit?.name ?? 'No determinado'}</strong>.

                <br><br>¿Elimino el activo fijo?`;

      default: return '';
    }
  }


  private validateAndSendEvent(eventType: AssetHeaderEventType, send: boolean) {
    if (send) {
      sendEvent(this.assetHeaderEvent, eventType, { assetUID: this.asset.uid });
    }
  }

}
