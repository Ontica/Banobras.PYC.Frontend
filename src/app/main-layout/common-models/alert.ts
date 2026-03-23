/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString } from '@app/core';


export type AppAlertType = 'VersionUpdate' | 'Info' | 'Warning';


export interface AppAlert {
  id: string;
  type: AppAlertType;
  title: string;
  message: string;
  details?: string;
  persistent?: boolean;
  dateTime?: DateString;
  read?: boolean;
}
