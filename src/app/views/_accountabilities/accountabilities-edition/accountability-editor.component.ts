/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, DateString, EventInfo, isEmpty } from '@app/core';

import { ArrayLibrary, FormHelper, sendEvent } from '@app/shared/utils';

import { SearcherAPIS } from '@app/data-services';

import { EmptyAccountability, Accountability, PartyRelationFields, PartyRelationType,
         PartyRole } from '@app/models';


export enum AccountabilityEditorEventType {
  CLOSE_BUTTON_CLICKED = 'AccountabilityEditorComponent.Event.CloseButtonClicked',
  CREATE_CLICKED       = 'AccountabilityEditorComponent.Event.CreateClicked',
  UPDATE_CLICKED       = 'AccountabilityEditorComponent.Event.UpdateClicked',
}

interface AccountabilityFormModel extends FormGroup<{
  partyRelationTypeUID: FormControl<string>;
  roleUID: FormControl<string>;
  responsibleUID: FormControl<string>;
  commissionerUID: FormControl<string>;
  code: FormControl<string>;
  description: FormControl<string>;
  tags: FormControl<string[]>;
  startDate: FormControl<DateString>;
}> { }

@Component({
  selector: 'emp-ng-accountability-editor',
  templateUrl: './accountability-editor.component.html',
})
export class AccountabilityEditorComponent implements OnChanges, OnInit {

  @Input() commissionerUID = '';

  @Input() responsibleUID = '';

  @Input() accountability: Accountability = EmptyAccountability;

  @Input() partyRelationTypesList: PartyRelationType[] = [];

  @Input() displayResponsible = false;

  @Input() displayCommissioner = false;

  @Input() canUpdate = false;

  @Output() accountabilityEditorEvent = new EventEmitter<EventInfo>();

  form: AccountabilityFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isFormDataReady = false;

  rolesList: PartyRole[] = [];

  responsiblesAPI = SearcherAPIS.accountabilityResponsibles;

  commissionersAPI = SearcherAPIS.accountabilityCommissioners;

  requiresCode = false;


  constructor() {
    this.initForm();
  }


  ngOnInit() {
    this.validateInitDataList();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (!this.isSaved) {
      this.enableCreateMode();
    }

    if (this.isSaved && changes.accountability) {
      this.enableUpdateMode();
    }
  }


  get title(): string {
    if (!this.isSaved) return 'Agregar responsabilidad';

    return `${this.canUpdate ?
      'Editar responsabilidad' :
      'Responsabilidad'} - ${this.accountability.partyRelationType.name}`;
  }


  get isSaved(): boolean {
    return !isEmpty(this.accountability);
  }


  onPartyRelationTypeChanges(type: PartyRelationType) {
    this.form.controls.roleUID.reset();
    this.rolesList = isEmpty(type) ? [] : type.roles;
    this.onRoleChanges(null);
  }


  onRoleChanges(role: PartyRole) {
    this.form.controls.responsibleUID.reset();
    this.requiresCode = isEmpty(role) ? false : role.requiresCode;
    this.validateFieldsEnabled();
  }


  onCloseButtonClicked() {
    sendEvent(this.accountabilityEditorEvent, AccountabilityEditorEventType.CLOSE_BUTTON_CLICKED);
  }


  onSubmitButtonClicked() {
    if (FormHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.isSaved ? AccountabilityEditorEventType.UPDATE_CLICKED :
        AccountabilityEditorEventType.CREATE_CLICKED;

      const payload = {
        commissionerUID: this.form.value.commissionerUID,
        responsibleUID: this.form.value.responsibleUID,
        accountabilityUID: this.isSaved ? this.accountability?.uid : null,
        dataFields: this.getFormData(),
      };

      sendEvent(this.accountabilityEditorEvent, eventType, payload);
    }
  }


  private enableUpdateMode() {
    this.editionMode = this.canUpdate;
    this.setFormDataForUpdate();
    this.validateFormDisabled();
  }


  private enableCreateMode() {
    this.editionMode = true;
    this.setFormDataForCreate();
    this.validateFieldsEnabled();
  }


  private validateInitDataList() {
    if (!this.isSaved) {
      return;
    }

    const relationType = this.partyRelationTypesList.find(x => x.uid === this.accountability.partyRelationType.uid);
    const role = relationType?.roles?.find(x => x.uid === this.accountability.role.uid);

    this.rolesList = ArrayLibrary.insertIfNotExist(relationType?.roles ?? [], this.accountability.role as any, 'uid');
    this.requiresCode = isEmpty(role) ? false : role.requiresCode;
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      partyRelationTypeUID: ['', Validators.required],
      responsibleUID: ['', Validators.required],
      commissionerUID: ['', Validators.required],
      roleUID: ['', Validators.required],
      code: [''],
      description: [''],
      tags: [null],
      startDate: [null],
    });
  }


  private setFormDataForUpdate() {
    this.isFormDataReady = false;

    setTimeout(() => {
      this.form.reset({
        partyRelationTypeUID: isEmpty(this.accountability.partyRelationType) ? null : this.accountability.partyRelationType.uid,
        responsibleUID: isEmpty(this.accountability.responsible) ? null : this.accountability.responsible.uid,
        commissionerUID: isEmpty(this.accountability.commissioner) ? null : this.accountability.commissioner.uid,
        roleUID: isEmpty(this.accountability.role) ? null : this.accountability.role.uid,
        code: this.accountability.code ?? null,
        description: this.accountability.description ?? null,
        tags: this.accountability.tags ?? [],
        startDate: this.accountability.startDate ?? null,
      });

      this.validateInitDataList();
      this.isFormDataReady = true;
    });
  }


  private setFormDataForCreate() {
    this.isFormDataReady = false;

    setTimeout(() => {
      this.form.reset({
        responsibleUID: this.responsibleUID,
        commissionerUID: this.commissionerUID,
      });

      this.isFormDataReady = true;
    });
  }


  private validateFormDisabled() {
    setTimeout(() => {
      const disable = this.isSaved && (!this.editionMode || !this.canUpdate);
      FormHelper.setDisableForm(this.form, disable);
      this.validateFieldsEnabled();
    });
  }


  private validateFieldsEnabled() {
    const isRoleValid = this.form.controls.roleUID.valid;
    FormHelper.setDisableControl(this.form.controls.responsibleUID, !isRoleValid);
    FormHelper.setDisableControl(this.form.controls.commissionerUID, !isRoleValid);
  }


  private getFormData(): PartyRelationFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: PartyRelationFields = {
      partyRelationTypeUID: formModel.partyRelationTypeUID ?? '',
      responsibleUID: formModel.responsibleUID ?? '',
      commissionerUID: formModel.commissionerUID ?? '',
      roleUID: formModel.roleUID ?? '',
      code: formModel.code ?? '',
      description: formModel.description ?? '',
      tags: formModel.tags ?? [],
      startDate: formModel.startDate ?? null,
    };

    return data;
  }

}
