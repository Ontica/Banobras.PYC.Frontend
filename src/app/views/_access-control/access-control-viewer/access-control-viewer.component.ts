/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Assertion, Empty, EventInfo } from '@app/core';

import { AccessControlDataService } from '@app/data-services';

import { PERMISSIONS } from '@app/main-layout';

import { ArrayLibrary, sendEvent } from '@app/shared/utils';

import { AccessControlQueryType, Feature, Role, Subject, AccessControlSelectionData,
         DefaultAccessControlQueryType, AccessControlQuery, SubjectsQuery,
         buildSubjectsQueryFromAccessControlQuery } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { AccessControlControlsEventType } from './access-control-controls.component';

import { AccessControlFilterEventType } from './access-control-filter.component';

import { SubjectsTableEventType } from '../subjects/subjects-table.component';

import { SubjectCreatorEventType } from '../subjects/subject-creator.component';


export enum AccessControlViewerEventType {
  ITEM_SELECTED = 'AccessControlViewerComponent.Event.ItemSelected',
}

@Component({
  selector: 'emp-ng-access-control-viewer',
  templateUrl: './access-control-viewer.component.html',
})
export class AccessControlViewerComponent implements OnInit {

  @Input() selectedItem: Subject | Role | Feature = Empty;

  @Output() accessControlViewerEvent = new EventEmitter<EventInfo>();

  cardHint = 'Seleccionar los filtros';

  query: AccessControlQuery = null;

  queryTypeName = '';

  queryExecuted = false;

  isLoading = false;

  subjectsList: Subject[] = [];

  rolesList: Role[] = [];

  featuresList: Feature[] = [];

  displaSubjectCreator = false;

  QueryTypes = AccessControlQueryType;

  Permissions = PERMISSIONS;


  constructor(private accessControlData: AccessControlDataService,
              private messageBox: MessageBoxService) { }


  ngOnInit() {
    this.setText();
  }


  get selectedSubject(): Subject {
    return this.selectedItem as Subject;
  }


  get selectedRole(): Role {
    return this.selectedItem as Role;
  }


  get selectedFeature(): Feature {
    return this.selectedItem as Feature;
  }


  onCreateSubjectClicked() {
    this.displaSubjectCreator = true;
  }


  onSubjectCreatorEvent(event: EventInfo) {
    switch (event.type as SubjectCreatorEventType) {
      case SubjectCreatorEventType.CLOSE_MODAL_CLICKED:
        this.displaSubjectCreator = false;
        return;
      case SubjectCreatorEventType.SUBJECT_CREATED:
        Assertion.assertValue(event.payload.subject, 'event.payload.subject');
        this.validateSubjectCreated(event.payload.subject as Subject);
        return;
      default:
        console.log(`Unhandled type interface event ${event.type}`);
        return;
    }
  }


  onAccessControlFilterEvent(event: EventInfo) {
    switch (event.type as AccessControlFilterEventType) {
      case AccessControlFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        Assertion.assertValue(event.payload.queryTypeName, 'event.payload.queryTypeName');

        this.setQuery(event.payload.query, event.payload.queryTypeName);
        this.resetData();
        this.validateQueryType();

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onAccessControlControlsEvent(event: EventInfo) {
    switch (event.type as AccessControlControlsEventType) {
      case AccessControlControlsEventType.EXPORT_BUTTON_CLICKED:
        this.messageBox.showInDevelopment('Exportar Datos', this.query);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onSubjectsTableEvent(event: EventInfo) {
    switch (event.type as SubjectsTableEventType) {
      case SubjectsTableEventType.SUBJECT_CLICKED:
        Assertion.assertValue(event.payload.item, 'event.payload.item');
        this.emitSelectedItem(event.payload.item as Subject);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  reloadData() {
    this.resetData();
    this.validateQueryType();
  }


  private setQuery(query: any, queryTypeName: string) {
    this.emitSelectedItem(Empty)
    this.query = query;
    this.queryTypeName = queryTypeName;
  }


  private emitSelectedItem(item: Subject | Role | Feature, type?: AccessControlQueryType) {
    const payload: AccessControlSelectionData = {
      type: type ?? this.query?.queryType as AccessControlQueryType,
      item,
    }
    sendEvent(this.accessControlViewerEvent, AccessControlViewerEventType.ITEM_SELECTED, payload);
  }


  private validateQueryType() {
    switch (this.query.queryType) {
      case AccessControlQueryType.Subjects:
        this.searchSubjects(buildSubjectsQueryFromAccessControlQuery(this.query));
        return;

      case AccessControlQueryType.Roles:
        this.searchRoles();
        return;

      case AccessControlQueryType.Features:
        this.searchFeatures();
        return;

      default:
        console.log(`Unhandled query type ${this.query.queryType}`);
        return;
    }
  }


  private resetData() {
    this.queryExecuted = false;
    this.subjectsList = [];
    this.setText();
  }


  private searchSubjects(query: SubjectsQuery) {
    this.isLoading = true;

    this.accessControlData.searchSubjects(query)
      .firstValue()
      .then(x => {
        this.subjectsList = x;
        this.setControlData(this.subjectsList.length);
      })
      .finally(() => this.isLoading = false);
  }


  private searchRoles() {
    this.isLoading = true;

    setTimeout(() => {
      this.messageBox.showInDevelopment('Consulta de roles', this.query);
      this.rolesList = [];
      this.setControlData(this.rolesList.length);
      this.isLoading = false;
    }, 500);
  }


  private searchFeatures() {
    this.isLoading = true;

    setTimeout(() => {
      this.messageBox.showInDevelopment('Consulta de permisos', this.query);
      this.featuresList = [];
      this.setControlData(this.featuresList.length);
      this.isLoading = false;
    }, 500);
  }


  private setControlData(resultCount: number) {
    this.queryExecuted = true;
    this.setText(resultCount);
  }


  private setText(totalResults?: number) {
    if (!this.queryExecuted) {
      this.cardHint = 'Seleccionar los filtros';
      return;
    }

    if (totalResults >= 0) {
      this.cardHint = `Consulta de ${this.queryTypeName} - ${totalResults} registros encontrados`;
      return;
    }

    this.cardHint = `Consulta de ${this.queryTypeName}`;
  }


  private validateSubjectCreated(subject: Subject) {
    if (!this.queryExecuted) {
      this.setQuery({queryType: DefaultAccessControlQueryType.uid}, DefaultAccessControlQueryType.name);
      this.insertSubjectToList(subject);
    }

    if (this.queryExecuted && this.query.queryType === AccessControlQueryType.Subjects) {
      this.insertSubjectToList(subject);
    }

    this.emitSelectedItem(subject as Subject, AccessControlQueryType.Subjects);
  }


  private insertSubjectToList(subject: Subject) {
    const newList = ArrayLibrary.insertItemTop(this.subjectsList, subject, 'uid');
    this.subjectsList = newList;
    this.setControlData(this.subjectsList.length);
  }

}
