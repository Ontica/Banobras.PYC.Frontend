/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable } from '@app/core';


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
