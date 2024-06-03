/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { RequestsStateSelector } from '@app/presentation/exported.presentation.types';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { ArrayLibrary, FormHelper, sendEvent } from '@app/shared/utils';

import { RequestsDataService } from '@app/data-services';

import { RequestTypeField, FormFieldData, FormFieldDataType, Request, RequestFields, RequestInputData,
         RequestsList, RequestType, EmptyRequest, EmptyRequestType } from '@app/models';


export enum RequestHeaderEventType {
  CREATE_REQUEST = 'RequestHeaderComponent.Event.CreateRequest',
  UPDATE_REQUEST = 'RequestHeaderComponent.Event.UpdateRequest',
  DELETE_REQUEST = 'RequestHeaderComponent.Event.DeleteRequest',
  CLOSE_REQUEST  = 'RequestHeaderComponent.Event.CloseRequest',
}

interface RequestFormModel extends FormGroup<{
  requesterOrgUnitUID: FormControl<string>;
  requestType: FormControl<RequestType>;
}> { }

@Component({
  selector: 'emp-pyc-request-header',
  templateUrl: './request-header.component.html',
})
export class RequestHeaderComponent implements OnChanges, OnInit, OnDestroy {

  @Input() requestsList: RequestsList = RequestsList.budgeting;

  @Input() request: Request = EmptyRequest;

  @Output() requestHeaderEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: RequestFormModel;

  dynamicFields: FormFieldData[] = [];

  hasExtraFields = false;

  controlType = FormFieldDataType;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  isLoadingRequesterOrgUnits = false;

  requesterOrgUnitsList: Identifiable[] = [];

  requestTypesList: RequestType[] = [];


  constructor(private uiLayer: PresentationLayer,
              private requestsData: RequestsDataService,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
    this.enableEditor(true);
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.request && this.isSaved) {
      this.enableEditor(false);
    }
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get isSaved(): boolean {
    return !isEmpty(this.request);
  }


  get hasActions(): boolean {
    return true;
  }


  existFormControl(field: string): boolean {
    return !!this.form.controls[field];
  }


  onRequesterOrgUnitUIDChanged(requesterOrgUnit: Identifiable) {
    this.form.controls.requestType.reset(null);
    this.onRequestTypeChanged(EmptyRequestType);
    this.getRequestType(requesterOrgUnit.uid);
  }


  onRequestTypeChanged(requestType: RequestType) {
    this.hasExtraFields = requestType.inputData.length > 0;
    this.buildDynamicFields(requestType.inputData);
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      let eventType = RequestHeaderEventType.CREATE_REQUEST;

      if (this.isSaved) {
        eventType = RequestHeaderEventType.UPDATE_REQUEST;
      }

      sendEvent(this.requestHeaderEvent, eventType, { requestFields: this.getFormData() });
    }
  }


  onDeleteButtonClicked() {
    this.showConfirmMessage(RequestHeaderEventType.DELETE_REQUEST);
  }


  onCloseButtonClicked() {
    this.showConfirmMessage(RequestHeaderEventType.CLOSE_REQUEST);
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;

    if (!this.editionMode && this.isSaved) {
      this.onRequestTypeChanged(this.request.requestType);
      this.setFormData();
    }

    setTimeout(() => this.formHelper.setDisableForm(this.form, !this.editionMode));
  }


  private initLists() {
    this.requesterOrgUnitsList = isEmpty(this.request.organizationalUnit) ? this.requesterOrgUnitsList :
      ArrayLibrary.insertIfNotExist(this.requesterOrgUnitsList ?? [], this.request.organizationalUnit, 'uid');
    this.requestTypesList = isEmpty(this.request.requestType) ? this.requestTypesList :
      ArrayLibrary.insertIfNotExist(this.requestTypesList ?? [], this.request.requestType, 'uid');
  }


  private loadDataLists() {
    this.isLoading = true;

    this.helper.select<Identifiable[]>(RequestsStateSelector.ORGANIZATIONAL_UNITS,
      { requestsList: this.requestsList })
      .firstValue()
      .then(x => this.resolveGetOrganizationalUnits(x))
      .finally(() => this.isLoading = false)
  }


  private resolveGetOrganizationalUnits(data: Identifiable[]) {
    this.requesterOrgUnitsList = data;
    this.initLists();
  }


  private getRequestType(requesterOrgUnitUID: string) {
    this.isLoadingRequesterOrgUnits = true;

    this.requestsData.getRequestTypes(this.requestsList, requesterOrgUnitUID)
      .firstValue()
      .then(x => this.resolveGetRequestTypes(x))
      .catch(e => this.resolveGetRequestTypes([]))
      .finally(() => this.isLoadingRequesterOrgUnits = false);
  }


  private resolveGetRequestTypes(data: RequestType[]) {
    this.requestTypesList = data;
    this.initLists();
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      requesterOrgUnitUID: ['', Validators.required],
      requestType: [null as RequestType, Validators.required],
    });

  }


  private setFormData() {
    setTimeout(() => {

      this.form.reset({
        requesterOrgUnitUID: this.request.organizationalUnit.uid,
        requestType: this.request.requestType,
      });

      this.request.requestTypeFields.forEach(x => this.setFormControlValue(x.field, x.value));
      this.initLists();

    });
  }


  private buildDynamicFields(inputData: RequestInputData[]) {
    this.dynamicFields.forEach(x => this.removeFormControl(x.field));
    this.dynamicFields = inputData.length > 0 ? inputData.map(x => this.getFormFieldData(x)) : [];
    return setTimeout(() => this.dynamicFields.forEach(x => this.addFormControl(x.field)));
  }


  private addFormControl(control: string) {
    if (!this.existFormControl(control)) {
      this.form.addControl(control as any, new FormControl('', Validators.required));
    }
  }


  private removeFormControl(control: string) {
    if (this.existFormControl(control)) {
      this.form.removeControl(control as any);
    }
  }


  private setFormControlValue(control: string, value: string) {
    if (this.existFormControl(control)) {
      this.form.controls[control].reset(value);
    }
  }


  private getFormFieldData(inputData: RequestInputData): FormFieldData {
    const data: FormFieldData = {
      label: inputData.label,
      field: inputData.field,
      fieldType: inputData.dataType,
      values: inputData.values,
      required: true,
      multiple: false,
    };

    return data;
  }


  private getFormData(): RequestFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const requestTypeFields: RequestTypeField[] =
      this.dynamicFields.map(x => this.buildRequestTypeField(x)) ?? [];

    const data: RequestFields = {
      requesterOrgUnitUID: this.form.value.requesterOrgUnitUID ?? '',
      requestTypeUID: this.form.value.requestType.uid ?? '',
      requestTypeFields,
    };

    return data;
  }


  private buildRequestTypeField(field: FormFieldData): RequestTypeField {
    const data: RequestTypeField = {
      field: field.field,
      value: this.form.value[field.field] ?? '',
    };

    return data;
  }


  private showConfirmMessage(eventType: RequestHeaderEventType) {
    const confirmType: 'AcceptCancel' | 'DeleteCancel' =
      eventType === RequestHeaderEventType.DELETE_REQUEST ? 'DeleteCancel' : 'AcceptCancel';
    const title = this.getConfirmTitle(eventType);
    const message = this.getConfirmMessage(eventType);

    this.messageBox.confirm(message, title, confirmType)
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.requestHeaderEvent, eventType, { requestUID: this.request.uid });
        }
      });
  }


  private getConfirmTitle(eventType: RequestHeaderEventType): string {
    switch (eventType) {
      case RequestHeaderEventType.DELETE_REQUEST: return 'Eliminar solicitud';
      case RequestHeaderEventType.CLOSE_REQUEST: return 'Cerrar solicitud';
      default: return '';
    }
  }


  private getConfirmMessage(eventType: RequestHeaderEventType): string {
    switch (eventType) {
      case RequestHeaderEventType.DELETE_REQUEST:
        return `Esta operación eliminará la solicitud
                <strong> ${this.request.organizationalUnit.name}:
                ${this.request.requestType.name}</strong>.
                <br><br>¿Elimino la solicitud?`;

      case RequestHeaderEventType.CLOSE_REQUEST:
        return `Esta operación cerrará la solicitud
                <strong> ${this.request.organizationalUnit.name}:
                ${this.request.requestType.name}</strong>.
                <br><br>¿Cierro la solicitud?`;

      default: return '';
    }
  }

}
