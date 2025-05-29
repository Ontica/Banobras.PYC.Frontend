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

import { ArrayLibrary, FormHelper, sendEvent } from '@app/shared/utils';

import { CashFlowProjectionsDataService } from '@app/data-services';

import { CashFlowProjectForEdition, CashFlowProjection, CashFlowProjectionActions, CashFlowProjectionFields,
         CashFlowProjectionOrgUnitsForEdition, CashFlowProjectionRejectFields,
         CashFlowProjectionTypeForEdition, CashFlowProjectTypeForEdition, EmptyCashFlowProjection,
         EmptyCashFlowProjectionActions } from '@app/models';

import { ConfirmSubmitModalEventType,
         ConfirmSubmitType } from '@app/views/entity-records/confirm-submit-modal/confirm-submit-modal.component';


export enum ProjectionHeaderEventType {
  CREATE            = 'CashFlowProjectionHeaderComponent.Event.Create',
  UPDATE            = 'CashFlowProjectionHeaderComponent.Event.Update',
  DELETE            = 'CashFlowProjectionHeaderComponent.Event.Delete',
  SEND_TO_AUTHORIZE = 'CashFlowProjectionHeaderComponent.Event.SendToAuthorization',
  AUTHORIZE         = 'CashFlowProjectionHeaderComponent.Event.Authorize',
  REJECT            = 'CashFlowProjectionHeaderComponent.Event.Reject',
  CLOSE             = 'CashFlowProjectionHeaderComponent.Event.Close',
}

interface ProjectionFormModel extends FormGroup<{
  partyUID: FormControl<string>;
  planUID: FormControl<string>;
  projectionTypeUID: FormControl<string>;
  projectTypeUID: FormControl<string>;
  sourceUID: FormControl<string>;
  projectUID: FormControl<string>;
  accountUID: FormControl<string>;
  description: FormControl<string>;
  justification: FormControl<string>;
  tags: FormControl<string[]>;
}> { }

@Component({
  selector: 'emp-cf-projection-header',
  templateUrl: './projection-header.component.html',
})
export class CashFlowProjectionHeaderComponent implements OnInit, OnChanges, OnDestroy {

  @Input() isSaved = false;

  @Input() projection: CashFlowProjection = EmptyCashFlowProjection;

  @Input() actions: CashFlowProjectionActions = EmptyCashFlowProjectionActions;

  @Output() projectionHeaderEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: ProjectionFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  orgUnitsList: CashFlowProjectionOrgUnitsForEdition[] = [];

  projectionTypesList: Identifiable[] = [];

  plansList: Identifiable[] = [];

  projectTypesList: Identifiable[] = [];

  sourcesList: Identifiable[] = [];

  accountsList: Identifiable[] = [];

  projectsList: Identifiable[] = [];

  confirmModalMode: ConfirmSubmitType = null;


  constructor(private uiLayer: PresentationLayer,
              private projectionsData: CashFlowProjectionsDataService,) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
    this.enableEditor(true);
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.projection && this.isSaved) {
      this.enableEditor(false);
    }
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get hasActions(): boolean {
    return this.actions.canSendToAuthorization || this.actions.canAuthorize || this.actions.canReject ||
           this.actions.canClose || this.actions.canDelete || this.actions.canUpdate;
  }


  onOrgUnitChanges(orgUnit: CashFlowProjectionOrgUnitsForEdition) {
    this.form.controls.planUID.reset();
    this.form.controls.projectionTypeUID.reset();
    this.form.controls.projectTypeUID.reset();
    this.form.controls.sourceUID.reset();
    this.form.controls.projectUID.reset();
    this.form.controls.accountUID.reset();

    this.plansList = orgUnit?.plans ?? [];
    this.projectionTypesList = orgUnit?.projectionTypes ?? [];
    this.projectTypesList = [];
    this.sourcesList = [];
    this.projectsList = [];
    this.accountsList = [];
  }


  onProjectionTypeChanges(projectionType: CashFlowProjectionTypeForEdition) {
    this.form.controls.projectTypeUID.reset();
    this.form.controls.sourceUID.reset();
    this.form.controls.projectUID.reset();
    this.form.controls.accountUID.reset();

    this.projectTypesList = projectionType.projectTypes;
    this.sourcesList = projectionType.sources;
    this.projectsList = [];
    this.accountsList = [];
  }


  onProjectTypeChanges(projectType: CashFlowProjectTypeForEdition) {
    this.form.controls.projectUID.reset();
    this.form.controls.accountUID.reset();

    this.projectsList = projectType.projects;
    this.accountsList = [];
  }


  onProjectChanges(project: CashFlowProjectForEdition) {
    this.form.controls.accountUID.reset();
    this.accountsList = project.accounts;
  }


  onEventButtonClicked(mode: ConfirmSubmitType) {
    this.confirmModalMode = mode;
  }


  onConfirmSubmitModalEvent(event: EventInfo) {
    switch (event.type as ConfirmSubmitModalEventType) {
      case ConfirmSubmitModalEventType.CLOSE_BUTTON_CLICKED:
        this.confirmModalMode = null;
        return;
      case ConfirmSubmitModalEventType.SUBMIT_BUTTON_CLICKED:
        const dataFields: CashFlowProjectionRejectFields = { message: event.payload.notes ?? null };
        this.validateActionConfirmedToEmit(dataFields);
        this.confirmModalMode = null;
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.isSaved ? ProjectionHeaderEventType.UPDATE : ProjectionHeaderEventType.CREATE;
      sendEvent(this.projectionHeaderEvent, eventType, { dataFields: this.getFormData() });
    }
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;

    if (!this.editionMode && this.isSaved) {
      this.setFormData();
    }

    this.validateFormDisabled();
  }


  private loadDataLists() {
    this.isLoading = true;

    this.projectionsData.getStructuredDataForEdition()
    .subscribe(x => {
      this.setOrgUnitsList(x);
      this.isLoading = x.length === 0;
    });
  }


  private setOrgUnitsList(data: CashFlowProjectionOrgUnitsForEdition[]) {
    this.orgUnitsList = data;
    this.validateInitDataList();
  }


  private validateInitDataList() {
    if (!this.isSaved) {
      return;
    }

    const orgUnit = this.orgUnitsList.find(x => x.uid === this.projection.party.uid);
    const projectionType = orgUnit?.projectionTypes?.find(x => x.uid === this.projection.projectionType.uid);
    const projectType = projectionType?.projectTypes?.find(x => x.uid === this.projection.projectType.uid);
    const project = projectType?.projects?.find(x => x.uid === this.projection.project.uid);

    this.plansList = orgUnit?.plans ?? [];
    this.projectionTypesList = orgUnit?.projectionTypes ?? [];
    this.sourcesList = projectionType?.sources ?? [];
    this.projectTypesList = projectionType?.projectTypes ?? [];
    this.projectsList = projectType?.projects ?? [];
    this.accountsList = project?.accounts ?? [];

    this.orgUnitsList = ArrayLibrary.insertIfNotExist(this.orgUnitsList ?? [], this.projection.party as any, 'uid');
    this.plansList = ArrayLibrary.insertIfNotExist(this.plansList ?? [], this.projection.plan, 'uid');
    this.projectionTypesList = ArrayLibrary.insertIfNotExist(this.projectionTypesList ?? [], this.projection.projectionType, 'uid');
    this.sourcesList = ArrayLibrary.insertIfNotExist(this.sourcesList ?? [], this.projection.source, 'uid');
    this.projectTypesList = ArrayLibrary.insertIfNotExist(this.projectTypesList ?? [], this.projection.projectType, 'uid');
    this.projectsList = ArrayLibrary.insertIfNotExist(this.projectsList ?? [], this.projection.project, 'uid');
    this.accountsList = ArrayLibrary.insertIfNotExist(this.accountsList ?? [], this.projection.account, 'uid');
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      partyUID: ['', Validators.required],
      planUID: ['', Validators.required],
      projectionTypeUID: ['', Validators.required],
      projectTypeUID: ['', Validators.required],
      sourceUID: ['', Validators.required],
      projectUID: ['', Validators.required],
      accountUID: ['', Validators.required],
      description: [''],
      justification: [''],
      tags: [null],
    });
  }


  private setFormData() {
    setTimeout(() => {
      this.form.reset({
        partyUID: isEmpty(this.projection.party) ? null : this.projection.party.uid,
        planUID: isEmpty(this.projection.plan) ? null : this.projection.plan.uid,
        projectionTypeUID: isEmpty(this.projection.projectionType) ? null : this.projection.projectionType.uid,
        projectTypeUID: isEmpty(this.projection.projectType) ? null : this.projection.projectType.uid,
        sourceUID: isEmpty(this.projection.source) ? null : this.projection.source.uid,
        projectUID: isEmpty(this.projection.project) ? null : this.projection.project.uid,
        accountUID: isEmpty(this.projection.account) ? null : this.projection.account.uid,
        description: this.projection.description ?? null,
        justification: this.projection.justification ?? null,
        tags: this.projection.tags ?? [],
      });

      this.validateInitDataList();
    });
  }


  private getFormData(): CashFlowProjectionFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const data: CashFlowProjectionFields = {
      partyUID: this.form.value.partyUID ?? null,
      planUID: this.form.value.planUID ?? null,
      projectionTypeUID: this.form.value.projectionTypeUID ?? null,
      projectTypeUID: this.form.value.projectTypeUID ?? null,
      sourceUID: this.form.value.sourceUID ?? null,
      projectUID: this.form.value.projectUID ?? null,
      accountUID: this.form.value.accountUID ?? null,
      description: this.form.value.description ?? null,
      justification: this.form.value.justification ?? null,
      tags: this.form.value.tags ?? null,
    };

    return data;
  }


  private validateFormDisabled() {
    setTimeout(() => {
      const disable = this.isSaved && (!this.editionMode || !this.actions.canUpdate);
      this.formHelper.setDisableForm(this.form, disable);
    });
  }


  private validateActionConfirmedToEmit(dataFields: CashFlowProjectionRejectFields) {
    switch (this.confirmModalMode) {
      case 'Delete':
        sendEvent(this.projectionHeaderEvent, ProjectionHeaderEventType.DELETE, { dataFields });
        return;
      case 'SendToAuthorization':
        sendEvent(this.projectionHeaderEvent, ProjectionHeaderEventType.SEND_TO_AUTHORIZE, { dataFields });
        return;
      case 'Authorize':
        sendEvent(this.projectionHeaderEvent, ProjectionHeaderEventType.AUTHORIZE, { dataFields });
        return;
      case 'Reject':
        sendEvent(this.projectionHeaderEvent, ProjectionHeaderEventType.REJECT, { dataFields });
        return;
      case 'Close':
        sendEvent(this.projectionHeaderEvent, ProjectionHeaderEventType.CLOSE, { dataFields });
        return;
      default:
        console.log(`Unhandled user interface action ${this.confirmModalMode}`);
        return;
    }
  }

}
