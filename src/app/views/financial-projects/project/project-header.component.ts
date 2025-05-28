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

import { FinancialProjectsStateSelector } from '@app/presentation/exported.presentation.types';

import { ArrayLibrary, FormHelper, sendEvent } from '@app/shared/utils';

import { FinancialProjectsDataService } from '@app/data-services';

import { FinancialProject, FinancialProjectActions, FinancialProjectFields, EmptyFinancialProject,
         EmptyFinancialProjectActions, FinancialProjectRejectFields, FinancialProjectOrgUnitsForEdition,
         ProjectCategoryForEdition, ProjectProgramForEdition } from '@app/models';

import { ConfirmSubmitModalEventType,
         ConfirmSubmitType } from '@app/views/entity-records/confirm-submit-modal/confirm-submit-modal.component';


export enum ProjectHeaderEventType {
  CREATE = 'FinancialProjectHeaderComponent.Event.Create',
  UPDATE = 'FinancialProjectHeaderComponent.Event.Update',
  DELETE = 'FinancialProjectHeaderComponent.Event.Delete',
}

interface ProjectFormModel extends FormGroup<{
  baseOrgUnitUID: FormControl<string>;
  categoryUID: FormControl<string>;
  programUID: FormControl<string>;
  subprogramUID: FormControl<string>;
  name: FormControl<string>;
  assigneeUID: FormControl<string>;
  description: FormControl<string>;
  justification: FormControl<string>;
}> { }

@Component({
  selector: 'emp-cf-project-header',
  templateUrl: './project-header.component.html',
})
export class FinancialProjectHeaderComponent implements OnInit, OnChanges, OnDestroy {

  @Input() isSaved = false;

  @Input() project: FinancialProject = EmptyFinancialProject;

  @Input() actions: FinancialProjectActions = EmptyFinancialProjectActions;

  @Output() projectHeaderEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: ProjectFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  isLoadingAssignees = false;

  orgUnitsList: FinancialProjectOrgUnitsForEdition[] = [];

  categoriesList: Identifiable[] = [];

  programsList: Identifiable[] = [];

  subprogramsList: Identifiable[] = [];

  assigneesList: Identifiable[] = [];

  confirmModalMode: ConfirmSubmitType = null;


  constructor(private uiLayer: PresentationLayer,
              private projectsData: FinancialProjectsDataService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
    this.enableEditor(true);
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.project && this.isSaved) {
      this.enableEditor(false);
    }
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get hasActions(): boolean {
    return this.actions.canDelete || this.actions.canUpdate;
  }


  onOrgUnitChanges(orgUnit: FinancialProjectOrgUnitsForEdition) {
    this.form.controls.categoryUID.reset();
    this.form.controls.programUID.reset();
    this.form.controls.subprogramUID.reset();
    this.form.controls.assigneeUID.reset();

    this.categoriesList = orgUnit?.categories ?? [];
    this.programsList = [];
    this.subprogramsList = [];
    this.assigneesList = [];

    if (!isEmpty(orgUnit)) {
      this.getAssigneesByOrgUnit(orgUnit.uid);
    }
  }


  onCategoryChanges(category: ProjectCategoryForEdition) {
    this.form.controls.programUID.reset();
    this.form.controls.subprogramUID.reset();

    this.programsList = category.programs;
    this.subprogramsList = [];
  }


  onProgramChanges(program: ProjectProgramForEdition) {
    this.form.controls.subprogramUID.reset();
    this.subprogramsList = program.subprograms;
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
        const dataFields: FinancialProjectRejectFields = { message: event.payload.notes ?? null };
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
      const eventType = this.isSaved ? ProjectHeaderEventType.UPDATE : ProjectHeaderEventType.CREATE;
      sendEvent(this.projectHeaderEvent, eventType, { dataFields: this.getFormData() });
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

    this.helper.select<FinancialProjectOrgUnitsForEdition[]>(FinancialProjectsStateSelector.ORG_UNITS_BY_EDITION)
      .subscribe(x => {
        this.setOrganizationalUnitsList(x);
        this.isLoading = x.length === 0;
      });
  }


  private getAssigneesByOrgUnit(orgUnitUID: string, initLoad: boolean = false) {
    this.isLoadingAssignees = true;

    this.projectsData.getAssigneesByOrgUnit(orgUnitUID)
      .firstValue()
      .then(x => this.setAssigneesList(x, initLoad))
      .finally(() => this.isLoadingAssignees = false);
  }


  private setOrganizationalUnitsList(data: FinancialProjectOrgUnitsForEdition[]) {
    this.orgUnitsList = data;
    this.validateInitDataList();
    this.validateInitAssignees();
  }


  private setAssigneesList(data: Identifiable[], initLoad: boolean){
    this.assigneesList = data;
    this.validateInitAssignees();
  }


  private validateInitDataList() {
    if (!this.isSaved) {
      return;
    }

    const orgUnit = this.orgUnitsList.find(x => x.uid === this.project.baseOrgUnit.uid);
    const category = orgUnit?.categories?.find(x => x.uid === this.project.category.uid);
    const program = category?.programs?.find(x => x.uid === this.project.program.uid);

    this.categoriesList = orgUnit?.categories ?? [];
    this.programsList = category?.programs ?? [];
    this.subprogramsList = program?.subprograms ?? [];

    this.orgUnitsList = ArrayLibrary.insertIfNotExist(this.orgUnitsList ?? [], this.project.baseOrgUnit as any, 'uid');
    this.categoriesList = ArrayLibrary.insertIfNotExist(this.categoriesList ?? [], this.project.category, 'uid');
    this.programsList = ArrayLibrary.insertIfNotExist(this.programsList ?? [], this.project.program, 'uid');
    this.subprogramsList = ArrayLibrary.insertIfNotExist(this.subprogramsList ?? [], this.project.subprogram, 'uid');
  }


  private validateInitAssignees() {
    if (!this.isSaved) {
      return
    }

    if(!this.editionMode || (this.editionMode && this.project.baseOrgUnit.uid === this.form.value.baseOrgUnitUID)) {
      this.assigneesList = ArrayLibrary.insertIfNotExist(this.assigneesList ?? [], this.project.assignee, 'uid');
    }
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      name: ['', Validators.required],
      baseOrgUnitUID: ['', Validators.required],
      categoryUID: ['', Validators.required],
      programUID: ['', Validators.required],
      subprogramUID: ['', Validators.required],
      assigneeUID: ['', Validators.required],
      description: [''],
      justification: [''],
    });
  }


  private setFormData() {
    setTimeout(() => {
      this.form.reset({
        name: this.project.name ?? null,
        baseOrgUnitUID: isEmpty(this.project.baseOrgUnit) ? null : this.project.baseOrgUnit.uid,
        categoryUID: isEmpty(this.project.category) ? null : this.project.category.uid,
        programUID: isEmpty(this.project.program) ? null : this.project.program.uid,
        subprogramUID: isEmpty(this.project.subprogram) ? null : this.project.subprogram.uid,
        assigneeUID: isEmpty(this.project.assignee) ? null : this.project.assignee.uid,
        description: this.project.description,
        justification: this.project.justification,
      });
    });

    this.validateInitDataList();
    this.validateLoadInitAssignees();
  }


  private validateLoadInitAssignees() {
    if (this.isSaved && !isEmpty(this.project.baseOrgUnit)) {
      this.getAssigneesByOrgUnit(this.project.baseOrgUnit.uid, true);
    }
  }


  private getFormData(): FinancialProjectFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const data: FinancialProjectFields = {
      name: this.form.value.name ?? null,
      baseOrgUnitUID: this.form.value.baseOrgUnitUID ?? null,
      categoryUID: this.form.value.categoryUID ?? null,
      programUID: this.form.value.programUID ?? null,
      subprogramUID: this.form.value.subprogramUID ?? null,
      assigneeUID: this.form.value.assigneeUID ?? null,
      description: this.form.value.description ?? null,
      justification: this.form.value.justification ?? null,
    };

    return data;
  }


  private validateFormDisabled() {
    setTimeout(() => {
      const disable = this.isSaved && (!this.editionMode || !this.actions.canUpdate);
      this.formHelper.setDisableForm(this.form, disable);
    });
  }


  private validateActionConfirmedToEmit(dataFields: FinancialProjectRejectFields) {
    switch (this.confirmModalMode) {
      case 'Delete':
        sendEvent(this.projectHeaderEvent, ProjectHeaderEventType.DELETE, { dataFields });
        return;
      default:
        console.log(`Unhandled user interface action ${this.confirmModalMode}`);
        return;
    }
  }

}
