/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { BaseActions, EmptyBaseActions, EntityStatus } from './_explorer-data';

import { EmptyFinancialProject, FinancialProject } from './financial-projects';

import { Document } from './documents';

import { HistoryEntry } from './history';


export interface FinancialAccountsQuery {
  organizationUnitUID: string;
  status: EntityStatus;
  keywords: string;
  accountTypeUID: string;
  standardAccountUID: string;
  subledgerAcccountNo: string;
  currencyUID: string;
  projectTypeUID: string;
  projectUID: string;
}


export interface FinancialAccountDescriptor {
  uid: string;
  projectUID: string;
  accountNo: string;
  financialAccountTypeName: string;
  standardAccountName: string;
  organizationalUnitName: string;
  subledgerAccountNo: string;
  currencyName: string;
  projectNo: string;
  projectName: string;
  projectTypeName: string;
  description: string;
  statusName: string;
  startDate: DateString;
  endDate: DateString;
  attributes: AccountAttributes;
  financialData: FinancialData;
}


export interface FinancialAccountFields {
  organizationalUnitUID: string;
  financialAccountTypeUID: string;
  standardAccountUID: string;
  currencyUID: string;
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
  borrower: string;
  creditAccountingAccount: string;
  creditTypeId: number;
  creditStageId: number;
  externalCreditNo: string;
}


export interface CreditFinancialData extends FinancialData {
  fees: number;
  currentBalance: number;
  investmentTerm: number;
  gracePeriod: number;
  repaymentTerm: number;
  repaymentDate: DateString;
  exchangeRate: number;
  interestRate: number;
  interestRateTypeUID: string;
  interestRateFactor: number;
  interestRateFloor: number;
  interestRateCeiling: number;
}


export interface FinancialAccountHolder {
  account: FinancialAccount;
  project: FinancialProject;
  operationAccounts: FinancialAccountOperationsStructure;
  documents: Document[];
  history: HistoryEntry[];
  actions: BaseActions;
}


export interface FinancialAccount {
  uid: string;
  accountNo: string;
  financialAccountType: Identifiable;
  description: string;
  standardAccount: Identifiable;
  organizationalUnit: Identifiable;
  currency: Identifiable;
  subledgerAccountNo: string;
  project: Identifiable;
  tags: string[];
  startDate: DateString;
  endDate: DateString;
  status: Identifiable;
  attributes: AccountAttributes;
  financialData: FinancialData;
  parent: Identifiable;
}


export interface FinancialAccountOperationsStructure {
  baseAccount: FinancialAccountDescriptor;
  availableOperations: Identifiable[];
  currentOperations: FinancialAccountOperation[];
}


export interface FinancialAccountOperation {
  uid: string;
  accountNo: string;
  operationTypeName: string;
  currencyName: string;
}


export interface FinancialAccountOperationFields {
  operationAccountTypeUID: string;
  accountNo: string;
  currencyUID: string;
}


export function buildCreditAttributes(data: CreditAttributes): CreditAttributes {
  const cleanData: CreditAttributes = {
    creditAccountingAccount: data.creditAccountingAccount ?? '',
    borrower: data.borrower ?? '',
    creditTypeId: data.creditTypeId ?? null,
    creditStageId: data.creditStageId ?? null,
    externalCreditNo: data.externalCreditNo ?? '',
  };

  return cleanData;
}


export function buildCreditFinancialData(data: CreditFinancialData): CreditFinancialData {
  const cleanData: CreditFinancialData = {
    fees: data.fees ?? null,
    currentBalance: data.currentBalance ?? null,
    investmentTerm: data.investmentTerm ?? null,
    gracePeriod: data.gracePeriod ?? null,
    repaymentTerm: data.repaymentTerm ?? null,
    repaymentDate: data.repaymentDate ?? null,
    exchangeRate: data.exchangeRate ?? null,
    interestRate: data.interestRate ?? null,
    interestRateTypeUID: data.interestRateTypeUID ?? null,
    interestRateFactor: data.interestRateFactor ?? null,
    interestRateFloor: data.interestRateFloor ?? null,
    interestRateCeiling: data.interestRateCeiling ?? null,
  };

  return cleanData;
}


export const EmptyFinancialAccountsQuery: FinancialAccountsQuery = {
  organizationUnitUID: '',
  accountTypeUID: '',
  standardAccountUID: '',
  currencyUID: '',
  projectTypeUID: '',
  projectUID: '',
  keywords: '',
  subledgerAcccountNo: '',
  status: null,
}


export const EmptyFinancialAccountDescriptor: FinancialAccountDescriptor = {
  uid: '',
  accountNo: '',
  financialAccountTypeName: '',
  projectUID: '',
  projectNo: '',
  projectName: '',
  projectTypeName: '',
  standardAccountName: '',
  organizationalUnitName: '',
  subledgerAccountNo: '',
  currencyName: '',
  description: '',
  startDate: '',
  endDate: '',
  attributes: null,
  financialData: null,
  statusName: '',
}


export const EmptyFinancialAccount: FinancialAccount = {
  uid: '',
  accountNo: '',
  financialAccountType: Empty,
  description: '',
  standardAccount: Empty,
  organizationalUnit: Empty,
  subledgerAccountNo: '',
  currency: Empty,
  project: Empty,
  tags: [],
  startDate: '',
  endDate: '',
  status: Empty,
  attributes: null,
  financialData:  null,
  parent: Empty,
}


export const EmptyFinancialAccountOperationsStructure: FinancialAccountOperationsStructure = {
  baseAccount: EmptyFinancialAccountDescriptor,
  availableOperations: [],
  currentOperations: [],
};


export const EmptyFinancialAccountHolder: FinancialAccountHolder = {
  account: EmptyFinancialAccount,
  project: EmptyFinancialProject,
  operationAccounts: EmptyFinancialAccountOperationsStructure,
  documents: [],
  history: [],
  actions: EmptyBaseActions,
}


export const EmptyCreditAttributes: CreditAttributes = {
  creditAccountingAccount: '',
  borrower: '',
  creditTypeId: null,
  creditStageId: null,
  externalCreditNo: '',
};


export const EmptyCreditFinancialData: CreditFinancialData = {
  fees: null,
  currentBalance: null,
  investmentTerm: null,
  gracePeriod: null,
  repaymentTerm: null,
  repaymentDate: '',
  exchangeRate: null,
  interestRate: null,
  interestRateTypeUID: null,
  interestRateFactor: null,
  interestRateFloor: null,
  interestRateCeiling: null,
};
