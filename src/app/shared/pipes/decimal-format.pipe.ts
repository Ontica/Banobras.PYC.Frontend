/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DecimalPipe } from '@angular/common';

import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'empDecimal'
})
export class DecimalFormatPipe extends DecimalPipe implements PipeTransform {

  defaultDigits = 2;

  transform(value: any, args?: any): any {
    const fractionDigits = typeof args === 'number' ? args : this.defaultDigits;
    const digitsInfo = `1.${fractionDigits}-${fractionDigits}`;
    return super.transform(value, digitsInfo);
  }

}
