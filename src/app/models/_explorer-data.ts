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


export interface DataActions {
  canUpdate: boolean;
  canDelete: boolean;
  canEditDocuments: boolean;
}
