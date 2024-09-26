/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { WorkflowActions } from './workflows';

import { EmptyWorkflowActions } from './requests';


export interface Step {
  uid: string;
  stepNo: string;
  name: string;
  description: string;
  requestedByOrgUnit: Identifiable;
  requestedBy: Identifiable;
  assignedToOrgUnit: Identifiable;
  assignedTo: Identifiable;
  priority: Identifiable;
  status: Identifiable;
  dueTime: DateString;
  startTime: DateString;
  endTime: DateString;
  actions: WorkflowActions;
  workflowInstance: Identifiable;
  stepInvoker: any;
}


export enum StepStatus {
  Waiting = 'Waiting',
  Pending = 'Pending',
}


export enum Priority {
  Low    = 'Low',
  Normal = 'Normal',
  High   = 'High',
  Urgent = 'Urgent',
}


export const EmptyStep: Step = {
  uid: '',
  stepNo: '',
  name: '',
  description: '',
  requestedByOrgUnit: Empty,
  requestedBy: Empty,
  assignedToOrgUnit: Empty,
  assignedTo: Empty,
  priority: Empty,
  status: Empty,
  dueTime: '',
  startTime: '',
  endTime: '',
  actions: EmptyWorkflowActions,
  workflowInstance: Empty,
  stepInvoker: '',
}
