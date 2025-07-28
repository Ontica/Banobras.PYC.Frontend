/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

export interface SkipFlags {
  submitted?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  ready?: boolean;
}


export function SkipIf<K extends keyof SkipFlags>(flag: K) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      if ((this as SkipFlags)[flag]) {
        return;
      }
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
