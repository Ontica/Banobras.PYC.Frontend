/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Pipe, PipeTransform } from '@angular/core';

import { DatePipe } from '@angular/common';

import { DateFormat, DateStringLibrary } from '@app/core';

@Pipe({
  name: 'dateTimeFormat'
})
export class DateTimeFormatPipe extends DatePipe implements PipeTransform {

  transform(value: any, format: DateFormat = 'DMY'): any {
    if (value) {
      return DateStringLibrary.format(value, format);
    }
    return '';

  }

}
