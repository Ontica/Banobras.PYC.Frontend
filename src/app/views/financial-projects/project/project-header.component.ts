/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';;

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { STANDALONE_IMPORTS } from '@app/shared/standalone-imports';

import { ArrayLibrary, FormHelper, sendEvent } from '@app/shared/utils';

import { FinancialProjectsDataService } from '@app/data-services';

import { EmptyFinancialProject, EmptyFinancialProjectActions, FinancialProject, FinancialProjectActions,
         FinancialProjectFields, FinancialProjectGoals, FinancialProjectProgramForEdition, FinancialProjectRejectFields,
         FinancialProjectSubprogramForEdition, RequestsList } from '@app/models';

import { ConfirmSubmitModalEventType,
         ConfirmSubmitType } from '@app/views/entity-records/confirm-submit-modal/confirm-submit-modal.component';

import { EntityRecordsModule } from '@app/views/entity-records/entity-records.module';

import { FinancialProjectGoalsComponent } from './project-goals.component';


export enum ProjectHeaderEventType {
  CREATE = 'FinancialProjectHeaderComponent.Event.Create',
  UPDATE = 'FinancialProjectHeaderComponent.Event.Update',
  DELETE = 'FinancialProjectHeaderComponent.Event.Delete',
}

interface ProjectFormModel extends FormGroup<{
  baseOrgUnitUID: FormControl<string>;
  programUID: FormControl<string>;
  subprogramUID: FormControl<string>;
  projectTypeUID: FormControl<string>;
  assigneeUID: FormControl<string>;
  name: FormControl<string>;
  description: FormControl<string>;
  justification: FormControl<string>;
  projectGoals: FormControl<FinancialProjectGoals>;
}> { }

@Component({
  selector: 'emp-cf-project-header',
  templateUrl: './project-header.component.html',
  standalone: true,
  imports: [
    ...STANDALONE_IMPORTS,
    EntityRecordsModule,
    FinancialProjectGoalsComponent,
  ],
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

  isLoadingStructureForEdit = false;

  isLoadingAssignees = false;

  orgUnitsList: Identifiable[] = [];

  programsList: FinancialProjectProgramForEdition[] = [];

  subprogramsList: Identifiable[] = [];

  projectTypesList: Identifiable[] = [];

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


  onOrgUnitChanges(orgUnit: Identifiable) {
    this.form.controls.programUID.reset();
    this.form.controls.subprogramUID.reset();
    this.form.controls.projectTypeUID.reset();
    this.form.controls.assigneeUID.reset();

    this.programsList = [];
    this.subprogramsList = [];
    this.projectTypesList = [];
    this.assigneesList = [];

    if (!isEmpty(orgUnit)) {
      this.getStructureForEditProjects(orgUnit.uid);
      this.getAssigneesByOrgUnit(orgUnit.uid);
    }
  }


  onProgramChanges(program: FinancialProjectProgramForEdition) {
    this.form.controls.subprogramUID.reset();
    this.form.controls.projectTypeUID.reset();
    this.subprogramsList = program.subprograms ?? [];
    this.projectTypesList = [];
  }


  onSubprogramChanges(subprogram: FinancialProjectSubprogramForEdition) {
    this.form.controls.projectTypeUID.reset();
    this.projectTypesList = subprogram.projectTypes ?? [];
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

    this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS, { requestsList: RequestsList.cashflow })
      .subscribe(x => {
        this.setOrganizationalUnitsList(x);
        this.isLoading = x.length === 0;
      });
  }


  private getStructureForEditProjects(orgUnitUID: string, initLoad: boolean = false) {
    this.isLoadingStructureForEdit = true;

    this.projectsData.getStructureForEditProjects(orgUnitUID)
      .firstValue()
      .then(x => this.setProgramsList(x.programs, initLoad))
      .finally(() => this.isLoadingStructureForEdit = false);
  }


  private getAssigneesByOrgUnit(orgUnitUID: string, initLoad: boolean = false) {
    this.isLoadingAssignees = true;

    this.projectsData.getAssigneesByOrgUnit(orgUnitUID)
      .firstValue()
      .then(x => this.setAssigneesList(x, initLoad))
      .finally(() => this.isLoadingAssignees = false);
  }


  private setOrganizationalUnitsList(data: Identifiable[]) {
    this.orgUnitsList = data;
    this.validateInitAssignees();
  }


  private setProgramsList(data: FinancialProjectProgramForEdition[], initLoad: boolean) {
    this.programsList = data;

    if (initLoad) {
      this.validateInitDataList();
    }
  }


  private setAssigneesList(data: Identifiable[], initLoad: boolean){
    this.assigneesList = data;

    if (initLoad) {
      this.validateInitAssignees();
    }
  }


  private validateInitDataList() {
    if (!this.isSaved) {
      return;
    }

    const program = this.programsList.find(x => x.uid === this.project.program.uid);
    const subprogram = program?.subprograms?.find(x => x.uid === this.project.subprogram.uid);

    this.subprogramsList = program?.subprograms ?? [];
    this.projectTypesList = subprogram?.projectTypes ?? [];

    this.orgUnitsList = ArrayLibrary.insertIfNotExist(this.orgUnitsList ?? [], this.project.baseOrgUnit, 'uid');
    this.programsList = ArrayLibrary.insertIfNotExist(this.programsList ?? [], this.project.program as any, 'uid');
    this.subprogramsList = ArrayLibrary.insertIfNotExist(this.subprogramsList ?? [], this.project.subprogram, 'uid');
    this.projectTypesList = ArrayLibrary.insertIfNotExist(this.projectTypesList ?? [], this.project.projectType, 'uid');
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
      baseOrgUnitUID: ['', Validators.required],
      programUID: ['', Validators.required],
      subprogramUID: ['', Validators.required],
      projectTypeUID: ['', Validators.required],
      assigneeUID: [''],
      name: ['', Validators.required],
      description: [''],
      justification: [''],
      projectGoals: [null],
    });
  }


  private setFormData() {
    setTimeout(() => {
      this.form.reset({
        baseOrgUnitUID: isEmpty(this.project.baseOrgUnit) ? null : this.project.baseOrgUnit.uid,
        programUID: isEmpty(this.project.program) ? null : this.project.program.uid,
        subprogramUID: isEmpty(this.project.subprogram) ? null : this.project.subprogram.uid,
        projectTypeUID: isEmpty(this.project.projectType) ? null : this.project.projectType.uid,
        assigneeUID: isEmpty(this.project.assignee) ? null : this.project.assignee.uid,
        name: this.project.name ?? null,
        description: this.project.description,
        justification: this.project.justification,
        projectGoals: this.project.projectGoals ?? null,
      });
    });

    this.validateInitDataList();
    this.validateLoadInitData();
  }


  private validateLoadInitData() {
    if (!this.isSaved) {
      return;
    }

    if (!isEmpty(this.project.baseOrgUnit)) {
      this.getAssigneesByOrgUnit(this.project.baseOrgUnit.uid, true);
      this.getStructureForEditProjects(this.project.baseOrgUnit.uid, true);
    }
  }


  private getFormData(): FinancialProjectFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const data: FinancialProjectFields = {
      baseOrgUnitUID: this.form.value.baseOrgUnitUID ?? null,
      programUID: this.form.value.programUID ?? null,
      subprogramUID: this.form.value.subprogramUID ?? null,
      projectTypeUID: this.form.value.projectTypeUID ?? null,
      assigneeUID: this.form.value.assigneeUID ?? null,
      name: this.form.value.name ?? null,
      description: this.form.value.description ?? null,
      justification: this.form.value.justification ?? null,
      projectGoals: this.form.value.projectGoals ?? null,
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
