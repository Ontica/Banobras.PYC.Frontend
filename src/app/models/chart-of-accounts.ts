/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable } from '@app/core';

import { EntityStatus } from './_explorer-data';


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
  level: number;
  isLastLevel: boolean;
  startDate: Date | string;
  endDate: Date | string;
  obsolete: boolean;
  statusName: string;
}


export interface StandardAccount {
  account: {uid: string}
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
  account: {uid: ''}
};


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
