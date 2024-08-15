/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';


export enum AccessControlQueryType {
  Subjects = 'Subjects',
  Roles    = 'Roles',
  Features = 'Feature',
}


export const AccessControlQueryTypeList: Identifiable[] = [
  { uid: AccessControlQueryType.Subjects, name: 'Cuentas de acceso' },
  // {uid: AccessControlQueryType.Roles,    name: 'Roles'},
  // {uid: AccessControlQueryType.Features, name: 'Permisos'},
];


export const DefaultAccessControlQueryType = AccessControlQueryTypeList[0];


export interface AccessControlQuery {
  queryType: string;
  contextUID: string;
  workareaUID: string;
  keywords: string;
}


export interface SubjectsQuery {
  contextUID: string;
  workareaUID: string;
  keywords: string;
}


export function buildSubjectsQueryFromAccessControlQuery(query: AccessControlQuery): SubjectsQuery {
  return {
    contextUID: query.contextUID ?? '',
    workareaUID: query.workareaUID ?? '',
    keywords: query.keywords ?? '',
  };
}


export interface AccessControlSelectionData {
  type: AccessControlQueryType;
  item: Subject | Role | Feature;
}


export const EmptyAccessControlSelectionData: AccessControlSelectionData = {
  type: AccessControlQueryType.Subjects,
  item: Empty,
};


export enum SecurityItemType {
  Context = 'Context',
  Role    = 'Role',
  Feature = 'Feature',
}


export interface SecurityItem extends Identifiable {
  uid: string;
  name: string;
  description?: string;
  group?: string;
}


export interface Subject {
  uid: string;
  fullName: string;
  userID: string;
  eMail: string;
  employeeNo: string;
  jobPosition: string;
  workarea: Identifiable;
  credentialsLastUpdate: DateString;
  lastAccess: DateString;
  status: Identifiable;
}


export interface Role extends SecurityItem {

}


export interface Feature extends SecurityItem {

}


export interface SubjectFields {
  fullName: string;
  userID: string;
  eMail: string;
  employeeNo: string;
  jobPosition: string;
  workareaUID: string;
}


export const EmptySubject: Subject = {
  uid: '',
  fullName: '',
  userID: '',
  eMail: '',
  employeeNo: '',
  jobPosition: '',
  workarea: Empty,
  credentialsLastUpdate: '',
  lastAccess: '',
  status: Empty,
};


export const EmptyRole: Role = {
  uid: '',
  name: '',
};


export const EmptyFeature: Feature = {
  uid: '',
  name: '',
};
