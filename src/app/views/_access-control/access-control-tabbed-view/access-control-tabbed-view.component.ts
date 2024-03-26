/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { EventInfo, SessionService } from '@app/core';

import { PERMISSIONS } from '@app/main-layout';

import { AccessControlQueryType, AccessControlSelectionData, EmptyAccessControlSelectionData, EmptyFeature,
         EmptyRole, EmptySubject, Feature, Role, Subject } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { SubjectTabbedViewEventType } from '../subjects/subject-tabbed-view.component';

export enum AccessControlTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'AccessControlTabbedViewComponent.Event.CloseButtonClicked',
  UPDATED              = 'AccessControlTabbedViewComponent.Event.Updated',
  DELETED              = 'AccessControlTabbedViewComponent.Event.Deleted',
}

@Component({
  selector: 'emp-ng-access-control-tabbed-view',
  templateUrl: './access-control-tabbed-view.component.html',
})
export class AccessControlTabbedViewComponent implements OnInit, OnChanges {

  @Input() accessControlItem: AccessControlSelectionData = EmptyAccessControlSelectionData;

  @Output() accessControlTabbedViewEvent = new EventEmitter<EventInfo>();

  canEdit = true;

  AccessControlType = AccessControlQueryType;

  subject: Subject = EmptySubject;

  role: Role = EmptyRole;

  feature: Feature = EmptyFeature;

  constructor(private session: SessionService) {

  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.accessControlItem) {
      this.resetSelectedItems();
      this.setSelectedItem();
    }
  }


  ngOnInit() {
    this.setPermission();
  }


  get typeName(): string {
    switch (this.accessControlItem.type) {
      case AccessControlQueryType.Subjects: return 'Cuenta de acceso';
      case AccessControlQueryType.Roles: return 'Rol';
      case AccessControlQueryType.Features: return 'Permiso';
      default: return this.accessControlItem.type;
    }
  }


  get titleText(): string {
    switch (this.accessControlItem.type) {
      case AccessControlQueryType.Subjects:
        return `(${this.subject.userID}) ${this.subject.fullName}` +
                (!!this.subject.employeeNo ? ` - ${this.subject.employeeNo}` : '');

      case AccessControlQueryType.Roles: return this.role.name;
      case AccessControlQueryType.Features: return this.feature.name;
      default: return '';
    }
  }


  get hintText(): string {
    switch (this.accessControlItem.type) {
      case AccessControlQueryType.Subjects:
        return `<span class="tag tag-small" style="margin-left: 0">${this.subject.status.name}</span>` +
               `<strong>${this.subject.workarea.name}</strong> &nbsp; &nbsp; | &nbsp; &nbsp;` +
               `${this.subject.jobPosition}`;

      case AccessControlQueryType.Roles:
      case AccessControlQueryType.Features:
        return `Información del ${this.typeName} seleccionado.`;

      default: return '';
    }
  }


  onClose() {
    sendEvent(this.accessControlTabbedViewEvent, AccessControlTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onSubjectTabbedViewEvent(event: EventInfo) {
    switch (event.type as SubjectTabbedViewEventType) {

      case SubjectTabbedViewEventType.SUBJECT_UPDATED:
        sendEvent(this.accessControlTabbedViewEvent, AccessControlTabbedViewEventType.UPDATED,
          event.payload);
        return;

      case SubjectTabbedViewEventType.SUBJECT_DELETED:
        sendEvent(this.accessControlTabbedViewEvent, AccessControlTabbedViewEventType.DELETED,
          event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setPermission() {
    this.canEdit = this.session.hasPermission(PERMISSIONS.FEATURE_EDICION_CONTROL_DE_ACCESOS);
  }


  private setSelectedItem() {
    switch (this.accessControlItem.type) {
      case AccessControlQueryType.Subjects:
        this.subject = this.accessControlItem.item as Subject;
        return;
      case AccessControlQueryType.Roles:
        this.role = this.accessControlItem.item as Role;
        return;
      case AccessControlQueryType.Features:
        this.feature = this.accessControlItem.item as Feature;
        return;
      default:
        return;
    }
  }


  private resetSelectedItems() {
    this.subject = EmptySubject;
    this.role = EmptyRole;
    this.feature = EmptyFeature;
  }

}
