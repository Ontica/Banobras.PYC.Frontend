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

import { ArrayLibrary, FormDynamicHelper, FormHelper, sendEvent } from '@app/shared/utils';

import { RequestsDataService } from '@app/data-services';

import { RequestTypeField, FormFieldData, FormFieldDataType, Request, RequestFields, RequestInputData,
         RequestsList, RequestType, EmptyRequest, EmptyRequestType, RequestActions,
         EmptyRequestActions } from '@app/models';


export enum RequestHeaderEventType {
  CREATE_REQUEST   = 'RequestHeaderComponent.Event.CreateRequest',
  UPDATE_REQUEST   = 'RequestHeaderComponent.Event.UpdateRequest',
  DELETE_REQUEST   = 'RequestHeaderComponent.Event.DeleteRequest',
  START_REQUEST    = 'RequestHeaderComponent.Event.StartRequest',
  ACTIVATE_REQUEST = 'RequestHeaderComponent.Event.ActivateRequest',
  SUSPEND_REQUEST  = 'RequestHeaderComponent.Event.SuspendRequest',
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

  @Input() isSaved = false;

  @Input() request: Request = EmptyRequest;

  @Input() actions: RequestActions = EmptyRequestActions;

  @Output() requestHeaderEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: RequestFormModel;

  dynamicFields: FormFieldData[] = [];

  hasExtraFields = false;

  controlType = FormFieldDataType;

  formHelper = FormHelper;

  formDynamicHelper = FormDynamicHelper;

  editionMode = false;

  isLoading = false;

  isLoadingRequesterOrgUnits = false;

  organizationalUnitsList: Identifiable[] = [];

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


  get hasActions(): boolean {
    return this.actions.canStart || this.actions.canActivate || this.actions.canSuspend ||
           this.actions.canDelete;
  }


  onRequesterOrgUnitUIDChanged(requesterOrgUnit: Identifiable) {
    this.form.controls.requestType.reset(null);
    this.onRequestTypeChanged(EmptyRequestType);
    this.getRequestType(requesterOrgUnit.uid);
  }


  onRequestTypeChanged(requestType: RequestType) {
    this.buildNewDynamicFields(requestType.inputData ?? []);
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


  onStartButtonClicked() {
    this.showConfirmMessage(RequestHeaderEventType.START_REQUEST);
  }


  onSuspendButtonClicked() {
    this.showConfirmMessage(RequestHeaderEventType.SUSPEND_REQUEST);
  }


  onActivateButtonClicked() {
    this.showConfirmMessage(RequestHeaderEventType.ACTIVATE_REQUEST);
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;

    if (!this.editionMode && this.isSaved) {
      const requestType = isEmpty(this.request.requestType) ? EmptyRequestType : this.request.requestType;
      this.onRequestTypeChanged(requestType);
      this.setFormData();
    }

    const disable = this.isSaved;

    setTimeout(() => this.formHelper.setDisableForm(this.form, disable));
  }


  private initLists() {
    this.organizationalUnitsList = isEmpty(this.request.requesterOrgUnit) ? this.organizationalUnitsList :
      ArrayLibrary.insertIfNotExist(this.organizationalUnitsList ?? [], this.request.requesterOrgUnit, 'uid');
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
    this.organizationalUnitsList = data;
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
        requesterOrgUnitUID: isEmpty(this.request.requesterOrgUnit) ? '' : this.request.requesterOrgUnit.uid,
        requestType: isEmpty(this.request.requestType) ? null : this.request.requestType,
      });

      this.request.requestTypeFields?.forEach(x =>
        FormDynamicHelper.setFormControlValue(this.form, x.field, x.value)
      );

      this.initLists();
    });
  }


  private buildNewDynamicFields(inputData: RequestInputData[]) {
    this.hasExtraFields = inputData.length > 0;
    const oldDynamicFields = [...this.dynamicFields];
    this.dynamicFields = [];
    setTimeout(() =>
      this.dynamicFields = FormDynamicHelper.buildDynamicFields(this.form, inputData, true, oldDynamicFields)
    );
  }


  private getFormData(): RequestFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const requestTypeFields: RequestTypeField[] =
      this.dynamicFields.map(x => FormDynamicHelper.buildRequestTypeField(this.form, x)) ?? [];

    const data: RequestFields = {
      requesterOrgUnitUID: this.form.value.requesterOrgUnitUID ?? '',
      requestTypeUID: this.form.value.requestType.uid ?? '',
      requestTypeFields,
    };

    return data;
  }


  private showConfirmMessage(eventType: RequestHeaderEventType) {
    const confirmType = this.getConfirmType(eventType);
    const title = this.getConfirmTitle(eventType);
    const message = this.getConfirmMessage(eventType);

    this.messageBox.confirm(message, title, confirmType)
      .firstValue()
      .then(x => this.validateAndSendEvent(eventType, x));
  }


  private getConfirmType(eventType: RequestHeaderEventType): 'AcceptCancel' | 'DeleteCancel' {
    switch (eventType) {
      case RequestHeaderEventType.DELETE_REQUEST:
      case RequestHeaderEventType.SUSPEND_REQUEST:
        return 'DeleteCancel';
      case RequestHeaderEventType.START_REQUEST:
      case RequestHeaderEventType.ACTIVATE_REQUEST:
      default:
        return 'AcceptCancel';
    }
  }


  private getConfirmTitle(eventType: RequestHeaderEventType): string {
    switch (eventType) {
      case RequestHeaderEventType.DELETE_REQUEST: return 'Eliminar solicitud';
      case RequestHeaderEventType.START_REQUEST: return 'Iniciar proceso';
      case RequestHeaderEventType.SUSPEND_REQUEST: return 'Suspender solicitud';
      case RequestHeaderEventType.ACTIVATE_REQUEST: return 'Reactivar solicitud';
      default: return '';
    }
  }


  private getConfirmMessage(eventType: RequestHeaderEventType): string {
    switch (eventType) {
      case RequestHeaderEventType.DELETE_REQUEST:
        return `Esta operación eliminará la solicitud
                <strong>${this.request.uniqueID}: ${this.request.requestType.name}</strong>
                de <strong>${this.request.requesterOrgUnit.name}</strong>.

                <br><br>¿Elimino la solicitud?`;

      case RequestHeaderEventType.START_REQUEST:
        return `Esta operación iniciará el proceso de la solicitud
                <strong>${this.request.uniqueID}: ${this.request.requestType.name}</strong>
                de <strong>${this.request.requesterOrgUnit.name}</strong>.
                <br><br>¿Inicio el proceso de la solicitud?`;

      case RequestHeaderEventType.SUSPEND_REQUEST:
        return `Esta operación suspenderá la solicitud
                <strong>${this.request.uniqueID}: ${this.request.requestType.name}</strong>
                de <strong>${this.request.requesterOrgUnit.name}</strong>.
                <br><br>¿Suspendo la solicitud?`;

      case RequestHeaderEventType.ACTIVATE_REQUEST:
        return `Esta operación reactivará la solicitud
                <strong>${this.request.uniqueID}: ${this.request.requestType.name}</strong>
                de <strong>${this.request.requesterOrgUnit.name}</strong>.
                <br><br>¿Reactivo la solicitud?`;

      default: return '';
    }
  }


  private validateAndSendEvent(eventType: RequestHeaderEventType, send: boolean) {
    if (send) {
      sendEvent(this.requestHeaderEvent, eventType, { requestUID: this.request.uid });
    }
  }

}
