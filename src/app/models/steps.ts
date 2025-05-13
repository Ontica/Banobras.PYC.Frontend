/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { PositioningRule } from './edition-command';

import { EmptyWorkflowActions, WorkflowActions } from './workflows';


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


export const PriorityList: Identifiable[] = [
  { uid: Priority.Low,    name: 'Baja' },
  { uid: Priority.Normal, name: 'Normal' },
  { uid: Priority.High,   name: 'Alta' },
  { uid: Priority.Urgent, name: 'Urgente' },
];


export interface Step {
  uid: string;
  workflowInstance: Identifiable;
  workflowModelItem: Identifiable;
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
  stepInvoker: any;
}


export interface StepFields {
  requestUID: string;
  workflowInstanceUID: string;
  workflowModelItemUID: string;
  positioningRule?: PositioningRule;
  positioningOffsetStepUID?: string
  position?: number;
  description: string;
  requestedByOrgUnitUID: string;
  requestedByUID: string;
  assignedToOrgUnitUID: string;
  assignedToUID: string;
  priority: Priority;
  dueTime: DateString;
}


export const EmptyStep: Step = {
  uid: '',
  workflowModelItem: Empty,
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
