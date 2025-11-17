/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { EntityStatus } from './base/explorer-data';


export const PayrollsStatusList: Identifiable<EntityStatus>[] = [
  { uid: EntityStatus.Pending, name: 'Pendiente' },
  { uid: EntityStatus.Closed,  name: 'Cerrado' },
  { uid: EntityStatus.Deleted, name: 'Eliminado' },
];


export interface PayrollsQuery {
  status: EntityStatus;
  fromDate: DateString;
  toDate: DateString;
}


export interface PayrollDescriptor {
  uid: string;
  payrollNo: string;
  payrollDate: DateString;
  description: string;
  statusName: string;
}


export const EmptyPayrollsQuery: PayrollsQuery = {
  status: null,
  fromDate: '',
  toDate: '',
};
