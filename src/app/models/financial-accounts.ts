/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';


export interface FinancialAccountDescriptor {
  uid: string;
  accountNo: string;
  projectUID: string;
  projectNo: string;
  projectName: string;
  financialAccountTypeName: string;
  standardAccountName: string;
  organizationalUnitName: string;
  currencyName: string;
  description: string;
  startDate: DateString;
  endDate: DateString;
  statusName: string;
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


export interface FinancialAccount {
  uid: string;
  financialAccountType: Identifiable;
  standardAccount: Identifiable;
  organizationalUnit: Identifiable;
  currency: Identifiable;
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


export interface FinancialAccountOperationsTypes {
  account: FinancialAccountDescriptor;
  availableOperations: Identifiable[];
  currentOperations: FinancialAccountOperationType[];
}


export interface FinancialAccountOperationType extends Identifiable { // TODO: quitar este extends
  uid: string;
  operation: string;
  operationNo: string;
  currencyName: string;
}


export interface FinancialAccountOperationTypeFields {
  operationUID: string;
  operationNo: string;
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


export const EmptyFinancialAccountDescriptor: FinancialAccountDescriptor = {
  uid: '',
  accountNo: '',
  projectUID: '',
  projectNo: '',
  projectName: '',
  financialAccountTypeName: '',
  standardAccountName: '',
  organizationalUnitName: '',
  currencyName: '',
  description: '',
  startDate: '',
  endDate: '',
  statusName: '',
}


export const EmptyFinancialAccount: FinancialAccount = {
  uid: '',
  accountNo: '',
  financialAccountType: Empty,
  standardAccount: Empty,
  organizationalUnit: Empty,
  currency: Empty,
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


export const EmptyFinancialAccountOperationsTypes: FinancialAccountOperationsTypes = {
  account: EmptyFinancialAccountDescriptor,
  availableOperations: [],
  currentOperations: [],
};


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
