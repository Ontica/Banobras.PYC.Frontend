/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo, Identifiable } from '@app/core';

import { AccessControlDataService } from '@app/data-services';

import { SecurityItemEditionEventType } from '../security-item/security-item-edition.component';

@Component({
  selector: 'emp-ng-subject-roles',
  templateUrl: './subject-roles.component.html',
})
export class SubjectRolesComponent implements OnChanges {

  @Input() subjectUID: string = '';

  @Input() subjectContextsList: Identifiable[] = [];

  @Input() canEdit = true;

  rolesList: Identifiable[] = [];

  subjectRolesList: Identifiable[] = [];

  submitted = false;

  isLoading = false;

  isExcecuted = false;


  constructor(private accessControlData: AccessControlDataService) {

  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.subjectUID) {
      this.resetData();
    }
  }


  onSubjectRolesEditionEvent(event: EventInfo) {
    switch (event.type as SecurityItemEditionEventType) {
      case SecurityItemEditionEventType.SELECTOR_CHANGED:
        this.validateLoadSubjectRolesByContext(event.payload.selectorUID ?? '');
        return;

      case SecurityItemEditionEventType.ASSIGN_ITEM: {
        Assertion.assertValue(event.payload.selectorUID, 'event.payload.selectorUID');
        Assertion.assertValue(event.payload.itemUID, 'event.payload.itemUID');

        const contextUID = event.payload.selectorUID;
        const roleUID = event.payload.itemUID;

        this.assignRoleToSubject(this.subjectUID, contextUID, roleUID);
        return;
      }

      case SecurityItemEditionEventType.REMOVE_ITEM: {
        Assertion.assertValue(event.payload.selectorUID, 'event.payload.selectorUID');
        Assertion.assertValue(event.payload.itemUID, 'event.payload.itemUID');

        const contextUID = event.payload.selectorUID;
        const roleUID = event.payload.itemUID;

        this.removeRoleToSubject(this.subjectUID, contextUID, roleUID);
        return;
      }

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private resetData() {
    this.subjectRolesList = [];
    this.isExcecuted = false;
  }


  private validateLoadSubjectRolesByContext(contextUID: string) {
    this.subjectRolesList = [];
    this.rolesList = [];

    if (!contextUID) {
      this.isExcecuted = false;
      return;
    }

    this.getRolesByContext(contextUID);
    this.getSubjectRolesByContext(contextUID);
  }


  private getRolesByContext(contextUID: string) {
    this.accessControlData.getRolesByContext(contextUID)
      .firstValue()
      .then(x => this.rolesList = x);
  }


  private getSubjectRolesByContext(contextUID: string) {
    this.isLoading = true;

    this.accessControlData.getSubjectRolesByContext(this.subjectUID, contextUID)
      .firstValue()
      .then(x => this.subjectRolesList = x)
      .finally(() => {
        this.isLoading = false;
        this.isExcecuted = true;
      });
  }


  private assignRoleToSubject(subjectUID: string, contextUID: string, roleUID: string) {
    this.submitted = true;

    this.accessControlData.assignRoleToSubject(subjectUID, contextUID, roleUID)
      .firstValue()
      .then(x => this.subjectRolesList = x)
      .finally(() => this.submitted = false);
  }


  private removeRoleToSubject(subjectUID: string, contextUID: string, roleUID: string) {
    this.submitted = true;

    this.accessControlData.removeRoleToSubject(subjectUID, contextUID, roleUID)
      .firstValue()
      .then(x => this.subjectRolesList = x)
      .finally(() => this.submitted = false);
  }

}
