/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable } from '@app/core';


export enum EntityStatus {
  Pending      = 'Pending',
  Active       = 'Active',
  OnReview     = 'OnReview',
  Suspended    = 'Suspended',
  Discontinued = 'Discontinued',
  Deleted      = 'Deleted',
}


export const EntityStatusList: Identifiable<EntityStatus>[] = [
  { uid: EntityStatus.Pending,      name: 'Pendiente' },
  { uid: EntityStatus.Active,       name: 'Activo' },
  { uid: EntityStatus.OnReview,     name: 'En revisión' },
  { uid: EntityStatus.Suspended,    name: 'Suspendido' },
  { uid: EntityStatus.Discontinued, name: 'Descontinuado' },
  { uid: EntityStatus.Deleted,      name: 'Eliminado' },
];


export function isEntityStatusInWarning(statusName: string): boolean {
  const status = EntityStatusList.find(x => x.name === statusName)?.uid as EntityStatus;

  return [EntityStatus.Deleted,
          EntityStatus.Discontinued,
          EntityStatus.Suspended].includes(status);
}


export enum ExplorerOperationType {
  excel  = 'excel',
  print  = 'print',
  delete = 'delete',
}

export interface ExplorerOperation extends Identifiable {
  uid: string;
  name: string;
  showConfirm?: boolean;
  isConfirmWarning?: boolean;
  confirmOperationMessage?: string;
  confirmQuestionMessage?: string;
}


export interface ExplorerOperationCommand {
  operation: string;
  items: string[];
}


export interface BaseActions {
  canUpdate: boolean;
  canDelete: boolean;
  canEditDocuments: boolean;
}


export const EmptyBaseActions: BaseActions = {
  canUpdate: false,
  canDelete: false,
  canEditDocuments: false,
};
