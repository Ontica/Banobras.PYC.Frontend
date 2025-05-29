/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { SkipIf } from '@app/shared/decorators';

import { FinancialProjectsDataService } from '@app/data-services';

import { FinancialProjectFields } from '@app/models';

import { ProjectHeaderEventType } from './project-header.component';


export enum ProjectCreatorEventType {
  CREATED             = 'FinancialProjectCreatorComponent.Event.Created',
  CLOSE_MODAL_CLICKED = 'FinancialProjectCreatorComponent.Event.CloseModalClicked',
}

@Component({
  selector: 'emp-cf-project-creator',
  templateUrl: './project-creator.component.html',
})
export class FinancialProjectCreatorComponent {

  @Output() projectCreatorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private projectsData: FinancialProjectsDataService) { }


  onCloseModalClicked() {
    sendEvent(this.projectCreatorEvent, ProjectCreatorEventType.CLOSE_MODAL_CLICKED);
  }


  @SkipIf('submitted')
  onProjectHeaderEvent(event: EventInfo) {
    switch (event.type as ProjectHeaderEventType) {
      case ProjectHeaderEventType.CREATE:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.createProject(event.payload.dataFields as FinancialProjectFields);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private createProject(dataFields: FinancialProjectFields) {
    this.submitted = true;

    this.projectsData.createProject(dataFields)
      .firstValue()
      .then(x => sendEvent(this.projectCreatorEvent, ProjectCreatorEventType.CREATED, { data: x }))
      .finally(() => this.submitted = false);
  }

}
