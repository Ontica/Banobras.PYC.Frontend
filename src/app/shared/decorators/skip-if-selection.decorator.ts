/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

/**
 * Prevents method execution when the user is selecting text.
 * Used to avoid accidental actions during copy interactions.
 */
export function SkipIfSelection() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const selection = window.getSelection()?.toString();
      if (selection && selection.length > 0) {
        return;
      }
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
