/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { SkipIf } from '@app/shared/decorators';

import { STANDALONE_IMPORTS } from '@app/shared/standalone-imports';

import { FinancialProjectsDataService } from '@app/data-services';

import { EmptyFinancialProject, EmptyFinancialProjectActions, FinancialProject, FinancialProjectActions,
         FinancialProjectHolder, FinancialProjectFields } from '@app/models';

import { FinancialProjectHeaderComponent, ProjectHeaderEventType } from './project-header.component';


export enum ProjectEditorEventType {
  UPDATED = 'FinancialProjectEditorComponent.Event.Updated',
  DELETED = 'FinancialProjectEditorComponent.Event.Deleted',
}

@Component({
  selector: 'emp-financial-project-editor',
  templateUrl: './project-editor.component.html',
  standalone: true,
  imports: [
    ...STANDALONE_IMPORTS,
    FinancialProjectHeaderComponent,
  ],
})
export class FinancialProjectEditorComponent {

  @Input() project: FinancialProject = EmptyFinancialProject;

  @Input() actions: FinancialProjectActions = EmptyFinancialProjectActions;

  @Output() projectEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private projectsData: FinancialProjectsDataService) { }


  get isSaved(): boolean {
    return !isEmpty(this.project);
  }


  @SkipIf('submitted')
  onProjectHeaderEvent(event: EventInfo) {
    switch (event.type as ProjectHeaderEventType) {
      case ProjectHeaderEventType.UPDATE:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.updateProject(this.project.uid, event.payload.dataFields as FinancialProjectFields);
        return;
      case ProjectHeaderEventType.DELETE:
        this.deleteProject(this.project.uid);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private updateProject(projectUID: string, dataFields: FinancialProjectFields) {
    this.submitted = true;

    this.projectsData.updateProject(projectUID, dataFields)
      .firstValue()
      .then(x => this.resolveProjectUpdated(x))
      .finally(() => this.submitted = false);
  }


  private deleteProject(projectUID: string) {
    this.submitted = true;

    this.projectsData.deleteProject(projectUID)
      .firstValue()
      .then(() => this.resolveProjectDeleted(projectUID))
      .finally(() => this.submitted = false);
  }


  private resolveProjectUpdated(data: FinancialProjectHolder) {
    sendEvent(this.projectEditorEvent, ProjectEditorEventType.UPDATED, { data });
  }


  private resolveProjectDeleted(dataUID: string) {
    sendEvent(this.projectEditorEvent, ProjectEditorEventType.DELETED, { dataUID });
  }

}
