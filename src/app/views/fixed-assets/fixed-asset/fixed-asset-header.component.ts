/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { ArrayLibrary, FormHelper, sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { FixedAsset, FixedAssetFields, DateRange, EmptyFixedAsset, EmptyDateRange, BaseActions,
         EmptyBaseActions } from '@app/models';


export enum FixedAssetHeaderEventType {
  CREATE = 'FixedAssetHeaderComponent.Event.CreateFixedAsset',
  UPDATE = 'FixedAssetHeaderComponent.Event.UpdateFixedAsset',
  DELETE = 'FixedAssetHeaderComponent.Event.DeleteFixedAsset',
}

interface FixedAssetFormModel extends FormGroup<{
  fixedAssetTypeUID: FormControl<string>;
  datePeriod: FormControl<DateRange>;
  custodianOrgUnitUID: FormControl<string>;
  custodianPersonUID: FormControl<string>;
  name: FormControl<string>;
  brand: FormControl<string>;
  model: FormControl<string>;
  year: FormControl<number>;
  label: FormControl<string>;
  location: FormControl<string>;
  description: FormControl<string>;
}> { }

@Component({
  selector: 'emp-pyc-fixed-asset-header',
  templateUrl: './fixed-asset-header.component.html',
})
export class FixedAssetHeaderComponent implements OnInit, OnChanges {

  @Input() isSaved = false;

  @Input() fixedAsset: FixedAsset = EmptyFixedAsset;

  @Input() actions: BaseActions = EmptyBaseActions;

  @Output() fixedAssetHeaderEvent = new EventEmitter<EventInfo>();

  form: FixedAssetFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  organizationalUnitsList: Identifiable[] = [];

  fixedAssetTypesList: Identifiable[] = [];

  custodianPersonsList: Identifiable[] = [];


  constructor(private messageBox: MessageBoxService) {
    this.initForm();
    this.enableEditor(true);
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.fixedAsset && this.isSaved) {
      this.enableEditor(false);
      this.validateDataLists();
    }
  }


  get hasActions(): boolean {
    return this.actions.canDelete || this.actions.canUpdate;
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      let eventType = FixedAssetHeaderEventType.CREATE;

      if (this.isSaved) {
        eventType = FixedAssetHeaderEventType.UPDATE;
      }

      sendEvent(this.fixedAssetHeaderEvent, eventType, { fixedAssetFields: this.getFormData() });
    }
  }


  onDeleteButtonClicked() {
    this.showConfirmMessage(FixedAssetHeaderEventType.DELETE);
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;

    if (!this.editionMode && this.isSaved) {
      this.setFormData();
    }

    const disable = this.isSaved && (!this.editionMode || !this.actions.canUpdate);

    setTimeout(() => this.formHelper.setDisableForm(this.form, disable));
  }


  private loadDataLists() {

  }


  private validateDataLists() {
    this.organizationalUnitsList =
      ArrayLibrary.insertIfNotExist(this.organizationalUnitsList ?? [], this.fixedAsset.custodianOrgUnit, 'uid');
    this.fixedAssetTypesList =
      ArrayLibrary.insertIfNotExist(this.fixedAssetTypesList ?? [], this.fixedAsset.fixedAssetType, 'uid');
    this.custodianPersonsList =
      ArrayLibrary.insertIfNotExist(this.custodianPersonsList ?? [], this.fixedAsset.custodianPerson, 'uid');
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      fixedAssetTypeUID: [''],
      datePeriod: [EmptyDateRange],
      name: [''],
      custodianOrgUnitUID: [''],
      custodianPersonUID: [''],
      brand: [''],
      model: [''],
      year: [null],
      label: [''],
      location: [''],
      description: [''],
    });
  }


  private setFormData() {
    setTimeout(() => {
      this.form.reset({
        fixedAssetTypeUID: isEmpty(this.fixedAsset.fixedAssetType) ? null : this.fixedAsset.fixedAssetType.uid,
        name: this.fixedAsset.name ?? '',
        datePeriod: { fromDate: this.fixedAsset.startDate ?? null, toDate: this.fixedAsset.endDate ?? null },
        custodianOrgUnitUID: isEmpty(this.fixedAsset.custodianOrgUnit) ? null : this.fixedAsset.custodianOrgUnit.uid,
        custodianPersonUID: isEmpty(this.fixedAsset.custodianPerson) ? null : this.fixedAsset.custodianPerson.uid,
        brand: this.fixedAsset.brand ?? '',
        model: this.fixedAsset.model ?? '',
        year: this.fixedAsset.year > 0 ? this.fixedAsset.year : null,
        label: this.fixedAsset.label ?? '',
        location: this.fixedAsset.location ?? '',
        description: this.fixedAsset.description ?? '',
      });
    });
  }


  private getFormData(): FixedAssetFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const data: FixedAssetFields = {
      fixedAssetTypeUID: this.form.value.fixedAssetTypeUID ?? null,
      name: this.form.value.name ?? null,
      description: this.form.value.description ?? null,
      brand: this.form.value.brand ?? null,
      model: this.form.value.model ?? null,
      year: this.form.value.year > 0 ? this.form.value.year : null,
      label: this.form.value.label ?? null,
      custodianOrgUnitUID: this.form.value.custodianOrgUnitUID ?? null,
      custodianPersonUID: this.form.value.custodianPersonUID ?? null,
      location: this.form.value.location ?? null,
      startDate: this.form.value.datePeriod.fromDate ?? null,
      endDate: this.form.value.datePeriod.toDate ?? null,
    };

    return data;
  }


  private showConfirmMessage(eventType: FixedAssetHeaderEventType) {
    const confirmType = this.getConfirmType(eventType);
    const title = this.getConfirmTitle(eventType);
    const message = this.getConfirmMessage(eventType);

    this.messageBox.confirm(message, title, confirmType)
      .firstValue()
      .then(x => this.validateAndSendEvent(eventType, x));
  }


  private getConfirmType(eventType: FixedAssetHeaderEventType): 'AcceptCancel' | 'DeleteCancel' {
    switch (eventType) {
      case FixedAssetHeaderEventType.DELETE:
        return 'DeleteCancel';
      default:
        return 'AcceptCancel';
    }
  }


  private getConfirmTitle(eventType: FixedAssetHeaderEventType): string {
    switch (eventType) {
      case FixedAssetHeaderEventType.DELETE: return 'Eliminar activo fijo';
      default: return '';
    }
  }


  private getConfirmMessage(eventType: FixedAssetHeaderEventType): string {
    switch (eventType) {
      case FixedAssetHeaderEventType.DELETE:
        return `Esta operación eliminará el activo fijo
                <strong>${this.fixedAsset.inventoryNo}: ${this.fixedAsset.name}</strong>
                (${this.fixedAsset.fixedAssetType.name})
                del área responsable <strong>${this.fixedAsset.custodianOrgUnit.name}</strong>.

                <br><br>¿Elimino el activo fijo?`;

      default: return '';
    }
  }


  private validateAndSendEvent(eventType: FixedAssetHeaderEventType, send: boolean) {
    if (send) {
      sendEvent(this.fixedAssetHeaderEvent, eventType, { fixedAssetUID: this.fixedAsset.uid });
    }
  }

}
