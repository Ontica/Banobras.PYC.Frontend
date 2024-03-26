/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, EventInfo, Identifiable } from '@app/core';

import { AccessControlDataService } from '@app/data-services';

import { EmptySubject, SecurityItemType, Subject } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { SubjectEditorEventType } from './subject-editor.component';

import { SubjectContextsEventType } from './subject-contexts.component';


export enum SubjectTabbedViewEventType {
  SUBJECT_UPDATED = 'SubjectTabbedViewComponent.Event.SubjectUpdated',
  SUBJECT_DELETED = 'SubjectTabbedViewComponent.Event.SubjectDeleted',
}

@Component({
  selector: 'emp-ng-subject-tabbed-view',
  templateUrl: './subject-tabbed-view.component.html',
})
export class SubjectTabbedViewComponent implements OnChanges {

  @Input() subject: Subject = EmptySubject;

  @Input() canEdit = true;

  @Output() subjectTabbedViewEvent = new EventEmitter<EventInfo>();

  subjectContextsList: Identifiable[] = [];

  submitted = false;

  isLoading = false;

  securityItemType = SecurityItemType;


  constructor(private accessControlData: AccessControlDataService) {

  }


  ngOnChanges() {
    this.setSubjectContextsList([]);
    this.getSubjectContexts();
  }


  get hasContexts(): boolean {
    return this.subjectContextsList.length > 0;
  }


  get isDeleted(): boolean {
    return this.subject.status.uid === 'Deleted';
  }


  get isSuspended(): boolean {
    return this.subject.status.uid === 'Suspended';
  }


  onSubjectEditorEvent(event: EventInfo) {
    switch (event.type as SubjectEditorEventType) {

      case SubjectEditorEventType.SUBJECT_UPDATED:
        sendEvent(this.subjectTabbedViewEvent, SubjectTabbedViewEventType.SUBJECT_UPDATED,
          event.payload);
        return;

      case SubjectEditorEventType.SUBJECT_DELETED:
        sendEvent(this.subjectTabbedViewEvent, SubjectTabbedViewEventType.SUBJECT_DELETED,
          event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onSubjectContextsEvent(event: EventInfo) {
    switch (event.type as SubjectContextsEventType) {
      case SubjectContextsEventType.CONTEXTS_UPDATED:
        Assertion.assertValue(event.payload.subjectContexts, 'event.payload.subjectContexts');
        this.setSubjectContextsList(event.payload.subjectContexts);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private getSubjectContexts() {
    this.isLoading = true;

    this.accessControlData.getSubjectContexts(this.subject.uid)
      .firstValue()
      .then(x => this.setSubjectContextsList(x))
      .finally(() => this.isLoading = false);
  }


  private setSubjectContextsList(contexts: Identifiable[]) {
    this.subjectContextsList = contexts ?? [];
  }

}
