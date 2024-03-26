/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const timeParts = this.tryToConvertToTimePartsArray(value);

    if (timeParts) {
      return this.timeFormat(timeParts);
    }
    return '';
  }


  tryToConvertToTimePartsArray(value: string): string[] {
    if (!value) {
      return null;
    }

    const timeParts = value.split(':');

    if (timeParts.length === 4) {
      return timeParts;
    } else {
      return null;
    }
  }


  timeFormat(timeParts) {
    let time = '';

    time += +timeParts[0] > 0 ? +timeParts[0] + ' días ' : '';
    time += timeParts[1] + ':';
    time += timeParts[2] + ' hrs ';

    return time;
  }

}
