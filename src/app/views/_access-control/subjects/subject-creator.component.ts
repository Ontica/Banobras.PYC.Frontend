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

import { AccessControlDataService } from '@app/data-services';

import { Subject, SubjectFields } from '@app/models';

import { SubjectHeaderEventType } from './subject-header.component';


export enum SubjectCreatorEventType {
  CLOSE_MODAL_CLICKED = 'SubjectCreatorComponent.Event.CloseModalClicked',
  SUBJECT_CREATED = 'SubjectCreatorComponent.Event.SubjectCreated',
}

@Component({
  selector: 'emp-ng-subject-creator',
  templateUrl: './subject-creator.component.html',
})
export class SubjectCreatorComponent {

  @Output() subjectCreatorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private accessControlData: AccessControlDataService) { }


  onCloseClicked() {
    sendEvent(this.subjectCreatorEvent, SubjectCreatorEventType.CLOSE_MODAL_CLICKED);
  }


  @SkipIf('submitted')
  onSubjectHeaderEvent(event: EventInfo) {
    switch (event.type as SubjectHeaderEventType) {
      case SubjectHeaderEventType.CREATE_SUBJECT:
        Assertion.assertValue(event.payload.subject, 'event.payload.subject');
        this.createSubject(event.payload.subject as SubjectFields);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private createSubject(subjectFields: SubjectFields) {
    this.submitted = true;

    this.accessControlData.createSubject(subjectFields)
      .firstValue()
      .then(x => this.resolveCreateSubject(x))
      .finally(() => this.submitted = false);
  }


  private resolveCreateSubject(subject: Subject) {
    sendEvent(this.subjectCreatorEvent, SubjectCreatorEventType.SUBJECT_CREATED, { subject });
    this.onCloseClicked();
  }

}
