/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Empty, Identifiable } from '@app/core';


export interface BaseEntity {
  uid: string;
  type?: Identifiable;
  entityNo?: string;
  name: string;
}


export const EmptyBaseEntity: BaseEntity = {
  uid: '',
  type: Empty,
  entityNo: '',
  name: '',
}
