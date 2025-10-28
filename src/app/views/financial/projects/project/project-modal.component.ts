/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { STANDALONE_IMPORTS } from '@app/shared/standalone-imports';

import { sendEvent } from '@app/shared/utils';

import { FinancialProjectsDataService } from '@app/data-services';

import { EmptyFinancialProject, FinancialProject } from '@app/models';

import { FinancialProjectHeaderComponent } from './project-header.component';


export enum ProjectModalEventType {
  CLOSE_MODAL_CLICKED = 'FinancialProjectModalComponent.Event.CloseModalClicked',
}

@Component({
  selector: 'emp-financial-project-modal',
  templateUrl: './project-modal.component.html',
  standalone: true,
  imports: [
    ...STANDALONE_IMPORTS,
    FinancialProjectHeaderComponent,
  ],
})
export class FinancialProjectModalComponent implements OnChanges {

  @Input() projectUID = '';

  @Output() projectModalEvent = new EventEmitter<EventInfo>();

  isLoading = false;

  project: FinancialProject = EmptyFinancialProject;


  constructor(private projectsData: FinancialProjectsDataService) { }


  ngOnChanges() {
    this.getProject(this.projectUID);
  }


  onCloseModalClicked() {
    sendEvent(this.projectModalEvent, ProjectModalEventType.CLOSE_MODAL_CLICKED);
  }


  private getProject(projectUID: string) {
    this.isLoading = true;

    this.projectsData.getProjectPlain(projectUID)
      .firstValue()
      .then(x => this.project = x)
      .catch(e => this.onCloseModalClicked())
      .finally(() => this.isLoading = false);
  }

}
