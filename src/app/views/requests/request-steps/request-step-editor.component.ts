/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { combineLatest } from 'rxjs';

import { Assertion, DateString, EventInfo, Identifiable, isEmpty } from '@app/core';

import { CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { ArrayLibrary, FormHelper, sendEvent } from '@app/shared/utils';

import { CataloguesDataService, StepsDataService } from '@app/data-services';

import { EmptyStep, PositioningRule, PositioningRuleList, Priority, PriorityList, RequestsList, Step,
         StepFields, StepStatus } from '@app/models';

export enum RequestStepEditorEventType {
  CLOSE_BUTTON_CLICKED = 'RequestStepEditorComponent.Event.CloseButtonClicked',
  INSERT_STEP          = 'RequestStepEditorComponent.Event.InsertStep',
  UPDATE_STEP          = 'RequestStepEditorComponent.Event.UpdateStep',
}

interface RequestStepFormModel extends FormGroup<{
  workflowInstanceUID: FormControl<string>;
  workflowModelItemUID: FormControl<string>;
  positioningRule: FormControl<PositioningRule>;
  positioningOffsetStepUID: FormControl<string>;
  position: FormControl<number>;
  description: FormControl<string>;
  requestedByOrgUnitUID: FormControl<string>;
  requestedByUID: FormControl<string>;
  assignedToOrgUnitUID: FormControl<string>;
  assignedToUID: FormControl<string>;
  priority: FormControl<string>;
  dueTime: FormControl<DateString>;
}> { }

@Component({
  selector: 'emp-pyc-request-step-editor',
  templateUrl: './request-step-editor.component.html',
})
export class RequestStepEditorComponent implements OnChanges, OnInit, OnDestroy {

  @Input() requestsList: RequestsList = RequestsList.budgeting;

  @Input() requestUID = '';

  @Input() workflowInstancesList: Identifiable[] = [];

  @Input() step: Step = EmptyStep;

  @Input() stepsList: Step[] = [];

  @Output() requestStepEditorEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: RequestStepFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  isLoadingWorkflowModelItems = false;

  workflowModelItemList: Identifiable[] = [];

  positioningRuleList: Identifiable[] = PositioningRuleList;

  validStepsList: Step[] = [];

  orgUnitsList: Identifiable[] = [];

  responsableList: Identifiable[] = [];

  priorityList: Identifiable[] = PriorityList;

  Priority = Priority;


  constructor(private uiLayer: PresentationLayer,
              private stepsData: StepsDataService,
              private cataloguesData: CataloguesDataService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.step && this.isSaved) {
      this.enableEditor();
    }

    if (changes.stepsList) {
      this.setValidStepsList();
    }
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get isSaved(): boolean {
    return !isEmpty(this.step);
  }


  get canUpdate(): boolean {
    return !this.isSaved || this.step.actions.canUpdate;
  }


  get stepFullName(): string {
    return `(${this.step.stepNo}) ${this.step.name}`;
  }


  get title(): string {
    if(!this.isSaved) return 'Agregar tarea';
    if (this.step.actions.canUpdate) return `Editar Tarea - ${this.stepFullName}`
    return `Detalle de tarea - ${this.stepFullName}`;
  }

  get displayPositioningRules(): boolean {
    return !this.isSaved;
  }


  get displayPositioningOffsetStep(): boolean {
    return [PositioningRule.AfterOffset, PositioningRule.BeforeOffset].includes(this.form.value.positioningRule);
  }

  get displayPosition(): boolean {
    return PositioningRule.ByPositionValue === this.form.value.positioningRule;
  }


  onCloseButtonClicked() {
    sendEvent(this.requestStepEditorEvent, RequestStepEditorEventType.CLOSE_BUTTON_CLICKED);
  }


  onWorkflowInstanceChanged(workflowInstanceUID: Identifiable) {
    this.form.controls.workflowModelItemUID.reset();

    if (isEmpty(workflowInstanceUID)) {
      this.workflowModelItemList = [];
    } else {
      this.getWorkflowModelItems(workflowInstanceUID.uid);
    }
  }


  onPositioningRuleChanged() {
    if (this.displayPositioningOffsetStep) {
      this.formHelper.setControlValidators(this.form.controls.positioningOffsetStepUID, Validators.required);
    } else {
      this.formHelper.clearControlValidators(this.form.controls.positioningOffsetStepUID);
    }

    if (this.displayPosition) {
      this.formHelper.setControlValidators(this.form.controls.position, [Validators.required]);
    } else {
      this.formHelper.clearControlValidators(this.form.controls.position);
    }

    this.setValidStepsList();
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      let eventType = RequestStepEditorEventType.INSERT_STEP;

      const payload = {
        workflowInstanceUID: this.isSaved ? this.step.workflowInstance.uid : this.form.value.workflowInstanceUID,
        stepUID: this.isSaved ? this.step.uid : null,
        dataFields: this.getFormData()
      };

      if (this.isSaved) {
        eventType = RequestStepEditorEventType.UPDATE_STEP;
      }

      sendEvent(this.requestStepEditorEvent, eventType, payload);
    }
  }


  private enableEditor() {
    this.editionMode = this.canUpdate;

    if (this.isSaved) {
      this.setFormData();
    }

    this.validateDisabledFields();
    this.validateNonRequiredFields();
  }


  private validateDisabledFields(){
    this.formHelper.setDisableForm(this.form, !this.canUpdate);

    if (this.canUpdate && this.isSaved) {
      this.formHelper.setDisableControl(this.form.controls.workflowInstanceUID, true);
      this.formHelper.setDisableControl(this.form.controls.workflowModelItemUID, true);
    }
  }


  private validateNonRequiredFields() {
    if (this.isSaved) {
      this.formHelper.clearControlValidators(this.form.controls.positioningRule);
    }
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS,
        { requestsList: RequestsList.payments }),
      this.cataloguesData.getResponsibles(),
    ])
    .subscribe(([a, b]) => {
      this.orgUnitsList = a;
      this.setResponsableList(b);
      this.isLoading = a.length === 0;
    });
  }


  private getWorkflowModelItems(workflowInstanceUID: string) {
    this.isLoadingWorkflowModelItems = true;

    this.stepsData.getWorkflowModelItems(workflowInstanceUID)
      .firstValue()
      .then(x => this.workflowModelItemList = x)
      .finally(() => this.isLoadingWorkflowModelItems = false);
  }


  private setResponsableList(responsables: Identifiable[]) {
    this.responsableList = responsables;

    if (this.isSaved) {
      this.responsableList = isEmpty(this.step.requestedBy) ? this.responsableList :
        ArrayLibrary.insertIfNotExist(this.responsableList ?? [], this.step.requestedBy, 'uid');
      this.responsableList = isEmpty(this.step.assignedTo) ? this.responsableList :
        ArrayLibrary.insertIfNotExist(this.responsableList ?? [], this.step.assignedTo, 'uid');
    }
  }


  private setValidStepsList() {
    if (PositioningRule.BeforeOffset === this.form.value.positioningRule) {
      this.validStepsList = this.stepsList.filter(x => x.status.uid === StepStatus.Waiting);
      return;
    }
    if (PositioningRule.AfterOffset === this.form.value.positioningRule) {
      this.validStepsList =
        this.stepsList.filter(x => x.status.uid === StepStatus.Waiting || x.status.uid === StepStatus.Pending);
      return;
    }
    this.validStepsList = [...[], ...this.stepsList];
  }


  private initWorkflowModelItemList() {
    this.workflowModelItemList = isEmpty(this.step.workflowModelItem) ? this.workflowModelItemList :
      ArrayLibrary.insertIfNotExist(this.workflowModelItemList ?? [], this.step.workflowModelItem, 'uid');
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      workflowInstanceUID: ['', Validators.required],
      workflowModelItemUID: ['', Validators.required],
      positioningRule: [PositioningRule.AtEnd, Validators.required],
      positioningOffsetStepUID: [''],
      position: [null as number],
      description: [''],
      requestedByOrgUnitUID: ['', Validators.required],
      requestedByUID: ['', Validators.required],
      assignedToOrgUnitUID: ['', Validators.required],
      assignedToUID: ['', Validators.required],
      priority: ['', Validators.required],
      dueTime: [null],
    });
  }


  private setFormData() {
    setTimeout(() => {
      this.form.reset({
        workflowInstanceUID: this.step.workflowInstance.uid,
        workflowModelItemUID: this.step.workflowModelItem.uid,
        positioningRule: PositioningRule.ByPositionValue,
        position: +this.step.stepNo || null,
        positioningOffsetStepUID: '',
        description: this.step.description ?? null,
        requestedByOrgUnitUID: isEmpty(this.step.requestedByOrgUnit) ? null : this.step.requestedByOrgUnit.uid,
        requestedByUID: isEmpty(this.step.requestedBy) ? null : this.step.requestedBy.uid,
        assignedToOrgUnitUID: isEmpty(this.step.assignedToOrgUnit) ? null : this.step.assignedToOrgUnit.uid,
        assignedToUID: isEmpty(this.step.assignedTo) ? null : this.step.assignedTo.uid,
        priority: this.step.priority.uid ?? null,
        dueTime: this.step.dueTime ?? null,
      });

      this.initWorkflowModelItemList();
    });
  }


  private getFormData(): StepFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: StepFields = {
      requestUID: this.requestUID,
      workflowInstanceUID: formModel.workflowInstanceUID ?? '',
      workflowModelItemUID: formModel.workflowModelItemUID ?? '',
      description: formModel.description ?? '',
      requestedByOrgUnitUID: formModel.requestedByOrgUnitUID ?? '',
      requestedByUID: formModel.requestedByUID ?? '',
      assignedToOrgUnitUID: formModel.assignedToOrgUnitUID ?? '',
      assignedToUID: formModel.assignedToUID ?? '',
      priority: formModel.priority as Priority ?? null,
      dueTime: !formModel.dueTime ? null : formModel.dueTime,
    };

    this.validatePositioningRulesFields(data);

    return data;
  }


  private validatePositioningRulesFields(data: StepFields) {
    if (this.displayPositioningRules) {
      const formModel = this.form.getRawValue();

      data.positioningRule = formModel.positioningRule;

      if (this.displayPositioningOffsetStep) {
        data.positioningOffsetStepUID = formModel.positioningOffsetStepUID;
      }

      if (this.displayPosition) {
        data.position = +formModel.position;
      }
    }
  }

}
