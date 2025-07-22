/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Assertion, DateString, EventInfo, Identifiable, isEmpty } from '@app/core';

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
  assetNo: FormControl<string>;
  condition: FormControl<string>;
  inUse: FormControl<string>;
  datePeriod: FormControl<DateRange>;
  assignedToOrgUnitUID: FormControl<string>;
  assignedToUID: FormControl<string>;
  name: FormControl<string>;
  location: FormControl<LocationSelection>;
  brand: FormControl<string>;
  model: FormControl<string>;
  serialNo: FormControl<string>;
  acquisitionDate: FormControl<DateString>;
  invoiceNo: FormControl<string>;
  accountingTag: FormControl<string>;
  historicalValue: FormControl<number>;
  supplierName: FormControl<string>;
  tags: FormControl<string[]>;
  identificators: FormControl<string[]>;
  description: FormControl<string>;
}> { }

@Component({
  selector: 'emp-inv-asset-header',
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

  inUseList: Identifiable[] = [];


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
      const eventType = this.isSaved ? AssetHeaderEventType.UPDATE : AssetHeaderEventType.CREATE;
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
    if (this.asset.assetType) {
      this.assetTypesList =
        ArrayLibrary.insertIfNotExist(this.assetTypesList ?? [], this.asset.assetType, 'uid');
    }
    if (this.asset.assignedTo) {
      this.assignedTosList =
        ArrayLibrary.insertIfNotExist(this.assignedTosList ?? [], this.asset.assignedTo, 'uid');
    }
    if (this.asset.assignedToOrgUnit) {
      this.organizationalUnitsList =
        ArrayLibrary.insertIfNotExist(this.organizationalUnitsList ?? [], this.asset.assignedToOrgUnit, 'uid');
    }
    if (this.asset.inUse) {
      this.inUseList =
        ArrayLibrary.insertIfNotExist(this.inUseList ?? [], this.asset.inUse, 'uid');
    }
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      assetTypeUID: [''],
      assetNo: [''],
      condition: [''],
      inUse: [''],
      datePeriod: [EmptyDateRange],
      name: [''],
      assignedToOrgUnitUID: [''],
      assignedToUID: [''],
      location: [EmptyLocationSelection],
      brand: [''],
      model: [''],
      serialNo: [''],
      acquisitionDate: ['' as DateString],
      invoiceNo: [''],
      accountingTag: [''],
      historicalValue: [null as number],
      supplierName: [''],
      identificators: [null],
      tags: [null],
      description: [''],
    });
  }


  private setFormData() {
    setTimeout(() => {
      const locationData = buildLocationSelection(this.asset.building, this.asset.floor, this.asset.place);

      this.form.reset({
        assetTypeUID: isEmpty(this.asset.assetType) ? null : this.asset.assetType.uid,
        assetNo: this.asset.assetNo ?? '',
        condition: this.asset.condition ?? '',
        inUse: isEmpty(this.asset.inUse) ? null : this.asset.inUse.uid,
        datePeriod: { fromDate: this.asset.startDate ?? null, toDate: this.asset.endDate ?? null },
        assignedToOrgUnitUID: isEmpty(this.asset.assignedToOrgUnit) ? null : this.asset.assignedToOrgUnit.uid,
        assignedToUID: isEmpty(this.asset.assignedTo) ? null : this.asset.assignedTo.uid,
        name: this.asset.name ?? '',
        location: locationData,
        brand: this.asset.brand ?? '',
        model: this.asset.model ?? '',
        serialNo: this.asset.serialNo ?? '',
        acquisitionDate: this.asset.acquisitionDate ?? '',
        invoiceNo: this.asset.invoiceNo ?? '',
        accountingTag: this.asset.accountingTag ?? '',
        historicalValue: this.asset.historicalValue > 0 ? this.asset.historicalValue : null,
        supplierName: this.asset.supplierName ?? '',
        identificators: this.asset.identificators ?? null,
        tags: this.asset.tags ?? null,
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
      assetNo: this.form.value.assetNo ?? null,
      condition: this.form.value.condition ?? null,
      inUse: this.form.value.inUse ?? null,
      startDate: this.form.value.datePeriod.fromDate ?? null,
      endDate: this.form.value.datePeriod.toDate ?? null,
      assignedToOrgUnitUID: this.form.value.assignedToOrgUnitUID ?? null,
      assignedToUID: this.form.value.assignedToUID ?? null,
      name: this.form.value.name ?? null,
      buildingUID: this.form.value.location?.building?.uid ?? null,
      floorUID: this.form.value.location?.floor?.uid ?? null,
      placeUID: this.form.value.location?.place?.uid ?? null,
      brand: this.form.value.brand ?? null,
      model: this.form.value.model ?? null,
      serialNo: this.form.value.serialNo ?? null,
      acquisitionDate: this.form.value.acquisitionDate ?? null,
      invoiceNo: this.form.value.invoiceNo ?? null,
      accountingTag: this.form.value.accountingTag ?? null,
      historicalValue: this.form.value.historicalValue > 0 ? this.form.value.historicalValue : null,
      supplierName: this.form.value.supplierName ?? null,
      identificators: this.form.value.identificators ?? [],
      tags: this.form.value.tags ?? [],
      description: this.form.value.description ?? null,
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
        const assignedTo = this.asset.assignedTo?.name ?? 'No determinado';
        const assignedToOrgUnit = this.asset.assignedToOrgUnit?.name ?? 'No determinado';

        return `Esta operación eliminará el activo fijo
                <strong>${this.asset.assetNo}: ${this.asset.name}</strong>
                (${this.asset.assetType?.name ?? 'No determinado'})
                del resguardatario <strong>${assignedTo} (${assignedToOrgUnit})</strong>.
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
