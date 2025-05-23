/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges,
         ViewChild } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { ArrayLibrary, FormHelper, sendEvent } from '@app/shared/utils';

import { SelectBoxTypeaheadComponent } from '@app/shared/form-controls';

import { CashFlowProjectionsDataService, SearcherAPIS } from '@app/data-services';

import { CashFlowProjection, CashFlowProjectionActions, CashFlowProjectionFields,
         CashFlowProjectionRejectFields, EmptyCashFlowProjection,
         EmptyCashFlowProjectionActions} from '@app/models';

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
  basePartyUID: FormControl<string>;
  planUID: FormControl<string>;
  categoryUID: FormControl<string>;
  classificationUID: FormControl<string>;
  operationSourceUID: FormControl<string>;
  baseProjectUID: FormControl<string>;
  baseAccountUID: FormControl<string>;
  description: FormControl<string>;
  justification: FormControl<string>;
  tags: FormControl<string[]>;
}> { }

@Component({
  selector: 'emp-cf-projection-header',
  templateUrl: './projection-header.component.html',
})
export class CashFlowProjectionHeaderComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('baseEntitySearcher') baseEntitySearcher: SelectBoxTypeaheadComponent;

  @Input() isSaved = false;

  @Input() projection: CashFlowProjection = EmptyCashFlowProjection;

  @Input() actions: CashFlowProjectionActions = EmptyCashFlowProjectionActions;

  @Output() projectionHeaderEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: ProjectionFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  orgUnitsList: Identifiable[] = [];

  categoriesList: Identifiable[] = [];

  plansList: Identifiable[] = [];

  classificationsList: Identifiable[] = [];

  operationSourcesList: Identifiable[] = [];

  accountsAPI = SearcherAPIS.cashFlowAccounts;

  projectsAPI = SearcherAPIS.cashFlowProjects;

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


  get selectionPlaceholder(): string {
    if (!this.editionMode) {
      return 'No determinado';
    }

    return 'Seleccionar';
  }


  get searcherPlaceholder(): string {
    if (!this.editionMode) {
      return 'No determinado';
    }

    return 'Buscar...';
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

  }


  private validateInitData() {
    if (this.isSaved) {
      this.orgUnitsList = ArrayLibrary.insertIfNotExist(this.orgUnitsList ?? [], this.projection.baseParty, 'uid');
      this.categoriesList = ArrayLibrary.insertIfNotExist(this.categoriesList ?? [], this.projection.category, 'uid');
      this.plansList = ArrayLibrary.insertIfNotExist(this.plansList ?? [], this.projection.plan, 'uid');
      this.classificationsList = ArrayLibrary.insertIfNotExist(this.classificationsList ?? [], this.projection.classification, 'uid');
      this.operationSourcesList = ArrayLibrary.insertIfNotExist(this.operationSourcesList ?? [], this.projection.operationSource, 'uid');
    }
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      basePartyUID: ['', Validators.required],
      planUID: ['', Validators.required],
      categoryUID: ['', Validators.required],
      classificationUID: ['', Validators.required],
      operationSourceUID: [''],
      baseProjectUID: [''],
      baseAccountUID: [''],
      description: [''],
      justification: [''],
      tags: [null],
    });
  }


  private setFormData() {
    setTimeout(() => {
      this.form.reset({
        basePartyUID: isEmpty(this.projection.baseParty) ? null : this.projection.baseParty.uid,
        planUID: isEmpty(this.projection.plan) ? null : this.projection.plan.uid,
        categoryUID: isEmpty(this.projection.category) ? null : this.projection.category.uid,
        classificationUID: isEmpty(this.projection.classification) ? null : this.projection.classification.uid,
        operationSourceUID: isEmpty(this.projection.operationSource) ? null : this.projection.operationSource.uid,
        baseProjectUID: isEmpty(this.projection.baseProject) ? null : this.projection.baseProject.uid,
        baseAccountUID: isEmpty(this.projection.baseAccount) ? null : this.projection.baseAccount.uid,
        description: this.projection.description ?? null,
        justification: this.projection.justification ?? null,
        tags: this.projection.tags ?? [],
      });

      this.validateInitData();
    });
  }


  private getFormData(): CashFlowProjectionFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const data: CashFlowProjectionFields = {
      basePartyUID: this.form.value.basePartyUID ?? null,
      planUID: this.form.value.planUID ?? null,
      categoryUID: this.form.value.categoryUID ?? null,
      classificationUID: this.form.value.classificationUID ?? null,
      operationSourceUID: this.form.value.operationSourceUID ?? null,
      baseProjectUID: this.form.value.baseProjectUID ?? null,
      baseAccountUID: this.form.value.baseAccountUID ?? null,
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
