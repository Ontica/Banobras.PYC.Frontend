/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import cloneDeep from 'lodash/cloneDeep';


export function clone<T>(source: T): T {
  return cloneDeep(source);
}
