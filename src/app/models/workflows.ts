/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable } from "@app/core";


export interface WorkflowInstance {
  uid: string;
  name: string;
}


export interface WorkflowHistory {
  uid: string;
}


export interface WorkflowActions {
  canUpdate: boolean;
  canStart: boolean;
  canCancel: boolean;
  canSuspend: boolean;
  canActivate: boolean;
  canComplete: boolean;
  canDelete: boolean;
  canInsertWorkItems: boolean;
}


export enum WorkflowGroups {
  deadline = 'deadline',
  process  = 'process',
  all      = 'all',
}


export const WorkflowGroupsList: Identifiable[] = [
  { uid: WorkflowGroups.all,      name: 'Todas' },
  { uid: WorkflowGroups.deadline, name: 'Fecha límite' },
  { uid: WorkflowGroups.process,  name: 'Proceso' },
];
