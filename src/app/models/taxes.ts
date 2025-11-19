/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable } from "@app/core";


export interface TaxEntry {
  uid: string;
  orderUID: string;
  taxType: Identifiable;
  total: number;
  totalEdit?: number;
}


export interface TaxEntryFields {
  orderUID: string;
  taxTypeUID: string;
  total: number;
}
