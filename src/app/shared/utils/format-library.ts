/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { formatNumber } from '@angular/common';

export class FormatLibrary {

  static stringToNumber(value: string): number {
    if (!value) {
      return 0;
    }

    if (typeof value === 'number') {
      return value;
    }

    return Number(value.replace(/[^0-9.-]+/g, ''));
  }


  static numberWithCommas(num: number, digits = '1.0-0') {
    return formatNumber(Number(num ?? 0), 'en-US', digits);
  }


  static removeEmptyValuesFrom(obj) {
    return Object
      .entries({ ...obj })
      .filter(([key, val]) => val !== '' && val !== null && val !== undefined)
      .reduce((prev, curr) => ({ ...prev, [curr[0]]: curr[1] }), {});
  }


  static firstLetterToLowerCase = (s) => {
    if (typeof s !== 'string') {
      return '';
    }
    return s.charAt(0).toLowerCase() + s.slice(1);
  };


  static formatBytes(bytes, decimals = 2, binaryUnits = false): string {
    if (bytes === 0) {
      return '0 Bytes';
    }

    const unitMultiple = (binaryUnits) ? 1024 : 1000;

    // 1000 bytes in 1 Kilobyte (KB) or 1024 bytes for the binary version (KiB)
    const unitNames = (unitMultiple === 1024) ?
      ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'] :
      ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const unitChanges = Math.floor(Math.log(bytes) / Math.log(unitMultiple));

    return parseFloat((bytes / Math.pow(unitMultiple, unitChanges))
      .toFixed(decimals || 0)) + ' ' + unitNames[unitChanges];
  }

}
