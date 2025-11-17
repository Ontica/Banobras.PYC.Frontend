/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';


export enum OperationsLogType {
  Successful            = 'Successful',
  Error                 = 'Error',
  PermissionsManagement = 'PermissionsManagement',
  UserManagement        = 'UserManagement',
}


export const OperationsLogTypeList: Identifiable[] = [
  { uid: OperationsLogType.Successful,            name: 'Accesos exitosos' },
  { uid: OperationsLogType.Error,                 name: 'Accesos no exitosos' },
  { uid: OperationsLogType.PermissionsManagement, name: 'Gestión de perfiles' },
  { uid: OperationsLogType.UserManagement,        name: 'Gestión de cuentas de acceso' }
];


export interface OperationsLogQuery {
  operationLogType: string;
  fromDate: DateString;
  toDate: DateString;
}
