/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { BaseActions, EntityStatus, ExplorerOperation, ExplorerOperationType } from './base/explorer-data';

import { Document } from './documents';

import { HistoryEntry } from './history';

import { FinancialAccountDescriptor } from './financial-accounts';


export const FinancialProjectsOperationsList: ExplorerOperation[] = [
  {
    uid: ExplorerOperationType.export,
    name: 'Exportar'
  },
];


export interface FinancialProjectsQuery {
  keywords: string;
  status: EntityStatus;
  baseOrgUnitUID: string;
  projectTypeUID: string;
  programUID: string;
  subprogramUID: string;
}


export interface FinancialProjectDescriptor {
  uid: string;
  projectNo: string;
  name: string;
  baseOrgUnitName: string;
  projectTypeName: string;
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
  projectTypeUID: string;
  programUID: string;
  subprogramUID: string;
  assigneeUID: string;
  projectGoals: FinancialProjectGoals;
  description: string;
  justification: string;
}


export interface FinancialProjectStructureForEdit {
  uid: string;
  name: string;
  programs: FinancialProjectProgramForEdition[];
}


export interface FinancialProjectProgramForEdition {
  uid: string;
  name: string;
  subprograms: FinancialProjectSubprogramForEdition[];
}


export interface FinancialProjectSubprogramForEdition {
  uid: string;
  name: string;
  projectTypes: Identifiable[];
}


export interface FinancialProjectRejectFields {
  message: string;
}


export interface FinancialProject {
  uid: string;
  projectType: Identifiable;
  projectNo: string;
  name: string;
  program: Identifiable;
  subprogram: Identifiable;
  baseOrgUnit: Identifiable;
  projectGoals: FinancialProjectGoals;
  assignee: Identifiable;
  parentProject: Identifiable;
  description: string;
  justification: string;
  startDate: DateString;
  endDate: DateString;
  status: Identifiable<EntityStatus>;
}


export interface FinancialProjectGoals {
  beneficiario: string;
  localizacion: string;
  poblacionBeneficiada: number;
  empleosDirectos: number;
  empleosIndirectos: number;
  costo: number;
}


export interface FinancialProjectActions extends BaseActions {

}


export interface FinancialProjectHolder {
  project: FinancialProject,
  accounts: FinancialAccountDescriptor[];
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
    projectTypeName: data.projectType.name,
    subprogramName: data.subprogram.name,
    baseOrgUnitName: data.baseOrgUnit.name,
    assigneeName: data.assignee.name,
    startDate: data.startDate,
    endDate: data.endDate,
    statusName: data.status.name,
  };
}


export function buildFinancialProjectGoals(data: FinancialProjectGoals): FinancialProjectGoals {
  const cleanData: FinancialProjectGoals = {
    beneficiario: data.beneficiario ?? '',
    localizacion: data.localizacion ?? '',
    poblacionBeneficiada: data.poblacionBeneficiada ?? null,
    empleosDirectos: data.empleosDirectos ?? null,
    empleosIndirectos: data.empleosIndirectos ?? null,
    costo: data.costo ?? null,
  };

  return cleanData;
}


export const EmptyFinancialProjectsQuery: FinancialProjectsQuery = {
  keywords: null,
  status: null,
  baseOrgUnitUID: '',
  projectTypeUID: '',
  programUID: '',
  subprogramUID: '',
};


export const EmptyFinancialProjectGoals: FinancialProjectGoals = {
  beneficiario: '',
  localizacion: '',
  poblacionBeneficiada: null,
  empleosDirectos: null,
  empleosIndirectos: null,
  costo: null,
}


export const EmptyFinancialProject: FinancialProject = {
  uid: '',
  projectNo: '',
  name: '',
  projectType: Empty,
  program: Empty,
  subprogram: Empty,
  baseOrgUnit: Empty,
  parentProject: Empty,
  assignee: Empty,
  projectGoals: EmptyFinancialProjectGoals,
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
