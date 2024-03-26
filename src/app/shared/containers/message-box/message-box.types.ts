/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { MatDialogConfig } from '@angular/material/dialog';


export type ConfirmMessageBoxType = 'Accept' | 'AcceptCancel' | 'DeleteCancel';


export interface MessageBoxConfig extends MatDialogConfig {

}


export interface MessageBoxData {
  messageBoxType: 'Accept' | ConfirmMessageBoxType;
  message: string;
  title: string;
  mainButtonText: string;
}
