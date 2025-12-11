
/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Pipe, PipeTransform } from '@angular/core';

import { isErrorStatus } from '@app/models';


@Pipe({
  name: 'empIsErrorStatus',
})
export class IsErrorStatusPipe implements PipeTransform {

  transform(status: string): boolean {
    if (!status) return false;
    return isErrorStatus(status);
  }

}
