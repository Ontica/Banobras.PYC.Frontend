/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, FlexibleIdentifiable, Identifiable } from '@app/core';

import { EntityStatus } from './base/explorer-data';

import { FinancialAccountDescriptor } from './financial-accounts';


export enum AccountRoleType {
  Sumaria = 'Sumaria',
  Detalle = 'Detalle',
}


export enum DebtorCreditorType {
  Deudora   = 'Deudora',
  Acreedora = 'Acreedora'
}


export const AccountRoleTypesList: AccountRoleType[] = [
  AccountRoleType.Sumaria,
  AccountRoleType.Detalle,
];


export const DebtorCreditorTypesList: DebtorCreditorType[] = [
  DebtorCreditorType.Deudora,
  DebtorCreditorType.Acreedora,
];


export interface ChartOfAccountsQuery {
  chartOfAccountsUID: string;
  status: EntityStatus;
  keywords: string;
  roleType: AccountRoleType;
  debtorCreditorType: DebtorCreditorType;
  fromAccount: string;
  toAccount: string;
  level: number;
}


export interface ChartOfAccounts {
  uid: string;
  name: string;
  accounts: StandardAccountDescriptor[];
}


export interface StandardAccountDescriptor {
  uid: string;
  number: string;
  name: string;
  fullName: string;
  typeName: string;
  roleType: AccountRoleType;
  debtorCreditorType: DebtorCreditorType;
  classificationName: string;
  level: number;
  isLastLevel: boolean;
  startDate: DateString;
  endDate: DateString;
  obsolete: boolean;
  statusName: string;
}


export interface StandardAccountHolder {
  standardAccount: StandardAccount;
  accounts: FinancialAccountDescriptor[];
  actions: StandardAccountActions;
}


export interface StandardAccount {
  uid: string;
  number: string;
  description: string;
  fullName: string;
  type: Identifiable;
  roleType: Identifiable;
  debtorCreditorType: Identifiable;
  relatedAccount: Identifiable;
  classification: FlexibleIdentifiable;
  level: number;
  isLastLevel: boolean;
  status: Identifiable;
  startDate: DateString;
  endDate: DateString;
}


export interface StandardAccountActions {
  canActivate: boolean;
  canSuspend: boolean;
  canUpdate: boolean;
}


export const EmptyChartOfAccountsQuery: ChartOfAccountsQuery = {
  chartOfAccountsUID: '',
  status: null,
  roleType: null,
  debtorCreditorType: null,
  fromAccount: '',
  toAccount: '',
  level: null,
  keywords: '',
};


export const EmptyChartOfAccounts: ChartOfAccounts = {
  uid: '',
  name: '',
  accounts: [],
};


export const EmptyStandardAccount: StandardAccount = {
  uid: '',
  number: '',
  description: '',
  fullName: '',
  type: Empty,
  roleType: Empty,
  debtorCreditorType: Empty,
  relatedAccount: Empty,
  classification: Empty,
  level: null,
  isLastLevel: false,
  status: Empty,
  startDate: '',
  endDate: '',
};


export const EmptyStandardAccountActions: StandardAccountActions = {
  canActivate: false,
  canSuspend: false,
  canUpdate: false,
}


export const EmptyStandardAccountHolder: StandardAccountHolder = {
  standardAccount: EmptyStandardAccount,
  accounts: [],
  actions: EmptyStandardAccountActions,
}


export function getDefaultLevelsList(): Identifiable[] {
  const accountsPattern = '0.00.00.00.00.00.00';
  const accountNumberSeparator = '.';
  const maxAccountLevel = 7;

  return getLevelsListFromPattern(accountsPattern, accountNumberSeparator, maxAccountLevel);
}


export function getLevelsListFromPattern(accountsPattern: string,
                                         accountNumberSeparator: string,
                                         maxAccountLevel: number): Identifiable[] {
  if (!accountsPattern || !accountNumberSeparator || !maxAccountLevel) {
    return [];
  }

  return Array.from({ length: maxAccountLevel }, (value, key) => key + 1)
    .map<Identifiable>(level => ({
      uid: level.toString(),
      name: `Nivel ${level}: ${getAccountPatternFromLevel(accountsPattern,
        accountNumberSeparator,
        level)}`,
    }));
}


function getAccountPatternFromLevel(accountsPattern: string,
                                    accountNumberSeparator: string,
                                    level: number) {
  return accountsPattern.split(accountNumberSeparator, level).join(accountNumberSeparator);
}
