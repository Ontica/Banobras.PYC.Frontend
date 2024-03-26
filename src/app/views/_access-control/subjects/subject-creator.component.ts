/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { AccessControlDataService } from '@app/data-services';

import { SubjectFields } from '@app/models';

import { sendEvent } from '@app/shared/utils';

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

  constructor(private accessControlData: AccessControlDataService) {

  }


  onClose() {
    sendEvent(this.subjectCreatorEvent, SubjectCreatorEventType.CLOSE_MODAL_CLICKED);
  }


  onSubjectHeaderEvent(event: EventInfo): void {
    if (this.submitted) {
      return;
    }

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
      .then(x => {
        sendEvent(this.subjectCreatorEvent, SubjectCreatorEventType.SUBJECT_CREATED, {subject: x});
        this.onClose();
      })
      .finally(() => this.submitted = false);
  }

}
