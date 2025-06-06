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
  projectNo: string;
  name: string;
  projectType: Identifiable;
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

export interface FinancialAccount {
  uid: string;
  name: string;
}


export interface FinancialProjectAccountDescriptor {
  uid: string;
  accountNo: string;
  projectName: string;
  financialAccountTypeName: string;
  standardAccountName: string;
  organizationalUnitName: string;
  description: string;
  startDate: DateString;
  endDate: DateString;
  statusName: string;
}


export interface FinancialProjectAccountFields {
  organizationalUnitUID: string;
  financialAccountTypeUID: string;
  standardAccountUID: string;
  accountNo: string;
  tags: string[];
  description: string;
  attributes: AccountAttributes;
  financialData: FinancialData;
}


export interface AccountAttributes {

}


export interface FinancialData {

}


export interface CreditAttributes extends AccountAttributes {
  noCredito: string;
  acreditado: string;
  tipoCredito: string;
  etapaCredito: number;
}


export interface CreditFinancialData extends FinancialData {
  interes: number;
  comision: number;
  saldo: number;
  plazoInversion: number;
  periodoGracia: number;
  plazoAmortizacion: number;
  fechaAmortizacion: DateString;
  tipoCambio: number;
  tasa: number;
  factorTasa: number;
  tasaPiso: number;
  tasaTecho: number;
}


export interface FinancialProjectAccount {
  uid: string;
  financialAccountType: Identifiable;
  standardAccount: Identifiable;
  organizationalUnit: Identifiable;
  accountNo: string;
  tags: string[];
  description: string;
  startDate: DateString;
  endDate: DateString;
  status: Identifiable;
  attributes: AccountAttributes;
  financialData: FinancialData;
  parent: Identifiable;
  project: Identifiable;
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


export interface FinancialAccountOperations {
  account: FinancialProjectAccountDescriptor;
  availableOperations: Identifiable[];
  currentOperations: Identifiable[];
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


export function buildCreditAttributes(data: CreditAttributes): CreditAttributes {
  const cleanData: CreditAttributes = {
    noCredito: data.noCredito ?? '',
    acreditado: data.acreditado ?? '',
    tipoCredito: data.tipoCredito ?? '',
    etapaCredito: data.etapaCredito ?? null,
  };

  return cleanData;
}


export function buildCreditFinancialData(data: CreditFinancialData): CreditFinancialData {
  const cleanData: CreditFinancialData = {
    interes: data.interes ?? null,
    comision: data.comision ?? null,
    saldo: data.saldo ?? null,
    plazoInversion: data.plazoInversion ?? null,
    periodoGracia: data.periodoGracia ?? null,
    plazoAmortizacion: data.plazoAmortizacion ?? null,
    fechaAmortizacion: data.fechaAmortizacion ?? null,
    tipoCambio: data.tipoCambio ?? null,
    tasa: data.tasa ?? null,
    factorTasa: data.factorTasa ?? null,
    tasaPiso: data.tasaPiso ?? null,
    tasaTecho: data.tasaTecho ?? null,
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
  description: '',
  justification: '',
  startDate: '',
  endDate: '',
  status: Empty,
}


export const EmptyFinancialProjectAccountDescriptor: FinancialProjectAccountDescriptor = {
  uid: '',
  accountNo: '',
  financialAccountTypeName: '',
  standardAccountName: '',
  organizationalUnitName: '',
  description: '',
  startDate: '',
  endDate: '',
  statusName: '',
  projectName: '',
}


export const EmptyFinancialProjectAccount: FinancialProjectAccount = {
  uid: '',
  accountNo: '',
  financialAccountType: Empty,
  standardAccount: Empty,
  organizationalUnit: Empty,
  tags: [],
  description: '',
  startDate: '',
  endDate: '',
  status: Empty,
  attributes: null,
  financialData:  null,
  parent: Empty,
  project: Empty,
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


export const EmptyFinancialAccountOperations: FinancialAccountOperations = {
  account: EmptyFinancialProjectAccountDescriptor,
  availableOperations: [],
  currentOperations: [],
};


export const EmptyCreditAttributes: CreditAttributes = {
  noCredito: '',
  acreditado: '',
  tipoCredito: '',
  etapaCredito: null,
};


export const EmptyCreditFinancialData: CreditFinancialData = {
  interes: null,
  comision: null,
  saldo: null,
  plazoInversion: null,
  periodoGracia: null,
  plazoAmortizacion: null,
  fechaAmortizacion: '',
  tipoCambio: null,
  tasa: null,
  factorTasa: null,
  tasaPiso: null,
  tasaTecho: null,
};
