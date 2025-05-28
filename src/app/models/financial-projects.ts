/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { BaseActions, EntityStatus, ExplorerOperation, ExplorerOperationType } from './_explorer-data';

import { Document } from './documents';

import { HistoryEntry } from './history';


export const FinancialProjectsOperationsList: ExplorerOperation[] = [
  {
    uid: ExplorerOperationType.excel,
    name: 'Exportar'
  },
];


export interface FinancialProjectsQuery {
  keywords: string;
  status: EntityStatus;
  baseOrgUnitUID: string;
  categoryUID: string;
  programUID: string;
  subprogramUID: string;
}


export interface FinancialProjectDescriptor {
  uid: string;
  projectNo: string;
  name: string;
  baseOrgUnitName: string;
  categoryName: string;
  programName: string;
  subprogramName: string;
  assigneeName: string;
  startDate: DateString;
  endDate: DateString;
  statusName: string;
}


export interface FinancialProjectFields {
  name: string;
  baseOrgUnitUID: string;
  categoryUID: string;
  programUID: string;
  subprogramUID: string;
  assigneeUID: string;
  description: string;
  justification: string;
}


export interface FinancialProjectOrgUnitsForEdition {
  uid: string;
  name: string;
  categories: ProjectCategoryForEdition[];
}


export interface ProjectCategoryForEdition {
  uid: string;
  name: string;
  programs: ProjectProgramForEdition[];
}


export interface ProjectProgramForEdition {
  uid: string;
  name: string;
  subprograms: Identifiable[];
}


export interface FinancialProjectRejectFields {
  message: string;
}


export interface FinancialProject {
  uid: string;
  projectNo: string;
  name: string;
  category: Identifiable;
  program: Identifiable;
  subprogram: Identifiable;
  baseOrgUnit: Identifiable;
  assignee: Identifiable;
  parentProject: Identifiable;
  description: string;
  justification: string;
  startDate: DateString;
  endDate: DateString;
  status: Identifiable<EntityStatus>;
}


export interface FinancialProjectAccountDescriptor {
  uid: string;
  projectName: string;
  standardAccountName: string;
  organizationalUnitName: string;
  accountNo: string;
  description: string;
  startDate: DateString;
  endDate: DateString;
  statusName: string;
}


export interface FinancialProjectActions extends BaseActions {

}


export interface FinancialProjectHolder {
  project: FinancialProject,
  accounts: FinancialProjectAccountDescriptor[];
  documents: Document[];
  history: HistoryEntry[];
  actions: FinancialProjectActions;
}


export function mapFinancialProjectDescriptorFromProject(data: FinancialProject): FinancialProjectDescriptor {
  return {
    uid: data.uid,
    projectNo: data.projectNo,
    name: data.name,
    programName: data.program.name,
    categoryName: data.category.name,
    subprogramName: data.subprogram.name,
    baseOrgUnitName: data.baseOrgUnit.name,
    assigneeName: data.assignee.name,
    startDate: data.startDate,
    endDate: data.endDate,
    statusName: data.status.name,
  };
}


export const EmptyFinancialProjectsQuery: FinancialProjectsQuery = {
  keywords: null,
  status: null,
  baseOrgUnitUID: '',
  categoryUID: '',
  programUID: '',
  subprogramUID: '',
};


export const EmptyFinancialProject: FinancialProject = {
  uid: '',
  projectNo: '',
  name: '',
  category: Empty,
  program: Empty,
  subprogram: Empty,
  baseOrgUnit: Empty,
  parentProject: Empty,
  assignee: Empty,
  description: '',
  justification: '',
  startDate: '',
  endDate: '',
  status: Empty,
}


export const EmptyFinancialProjectActions: FinancialProjectActions = {
  canUpdate: false,
  canDelete: false,
  canEditDocuments: false,
}


export const EmptyFinancialProjectHolder: FinancialProjectHolder = {
  project: EmptyFinancialProject,
  accounts: [],
  documents: [],
  history: [],
  actions: EmptyFinancialProjectActions,
};
