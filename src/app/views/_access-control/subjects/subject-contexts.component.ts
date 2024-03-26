/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { Assertion, EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccessControlStateSelector } from '@app/presentation/exported.presentation.types';

import { AccessControlDataService } from '@app/data-services';

import { sendEvent } from '@app/shared/utils';

import { SecurityItemEditionEventType } from '../security-item/security-item-edition.component';


export enum SubjectContextsEventType {
  CONTEXTS_UPDATED = 'SubjectContextsComponent.Event.ContextsUpdated',
}

@Component({
  selector: 'emp-ng-subject-contexts',
  templateUrl: './subject-contexts.component.html',
})
export class SubjectContextsComponent implements OnInit, OnDestroy {

  @Input() subjectUID: string = '';

  @Input() subjectContextsList: Identifiable[] = [];

  @Input() canEdit = true;

  @Output() subjectContextsEvent = new EventEmitter<EventInfo>();

  contextsList: Identifiable[] = [];

  submitted = false;

  isLoading = false;

  helper: SubscriptionHelper;


  constructor(private accessControlData: AccessControlDataService,
              private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.loadContexts();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onSubjectContextsEditionEvent(event: EventInfo) {
    switch (event.type as SecurityItemEditionEventType) {
      case SecurityItemEditionEventType.ASSIGN_ITEM: {
        Assertion.assertValue(event.payload.itemUID, 'event.payload.itemUID');
        const contextUID = event.payload.itemUID;
        this.assignContextToSubject(this.subjectUID, contextUID);
        return;
      }

      case SecurityItemEditionEventType.REMOVE_ITEM: {
        Assertion.assertValue(event.payload.itemUID, 'event.payload.itemUID');
        const contextUID = event.payload.itemUID;
        this.removeContextToSubject(this.subjectUID, contextUID);
        return;
      }

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private loadContexts() {
    this.isLoading = true;

    this.helper.select<Identifiable[]>(AccessControlStateSelector.CONTEXTS_LIST)
      .subscribe(x => {
        this.contextsList = x;
        this.isLoading = false;
      });
  }


  private assignContextToSubject(subjectUID: string, contextUID: string) {
    this.submitted = true;

    this.accessControlData.assignContextToSubject(subjectUID, contextUID)
      .firstValue()
      .then(x => this.emitSubjectContextsUpdated(x))
      .finally(() => this.submitted = false);
  }


  private removeContextToSubject(subjectUID: string, contextUID: string) {
    this.submitted = true;

    this.accessControlData.removeContextToSubject(subjectUID, contextUID)
      .firstValue()
      .then(x => this.emitSubjectContextsUpdated(x))
      .finally(() => this.submitted = false);
  }


  private emitSubjectContextsUpdated(subjectContexts: Identifiable[]) {
    sendEvent(this.subjectContextsEvent, SubjectContextsEventType.CONTEXTS_UPDATED, { subjectContexts });
  }

}
