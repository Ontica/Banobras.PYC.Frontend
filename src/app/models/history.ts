/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString } from '@app/core';


export interface HistoryEntry {
  uid: string;
  operation: string;
  partyName: string;
  description: string;
  time: DateString;
}
