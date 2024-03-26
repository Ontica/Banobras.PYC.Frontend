/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateFormat, LocalizationLibrary, DEFAULT_LANGUAGE, Language } from '../localization';

import { Assertion } from '../general/assertion';

import * as moment from 'moment';


export type DateString = Date | string;

export const MINUTES_IN_HOUR = 60;

export const MINUTES_IN_DAY = 1440;

export class DateStringLibrary {

  static validateDateValue(obj: any): Date {
    if (!obj) {
      return null;
    }

    let date: Date;
    if (moment.isMoment(obj)) {
      date = this.toDate(obj.toDate());
    } else {
      date = this.toDate(obj);
    }

    if (date) {
      return date;
    } else {
      return null;
    }
  }


  static compareDates(value1: DateString, value2: DateString): number {
    const date1 = this.datePart(value1);
    const date2 = this.datePart(value2);

    if (date1 && date2) {
      return date1.localeCompare(date2);
    } else if (date1 && !date2) {
      return -1;
    } else if (!date1 && date2) {
      return 1;
    } else if (!date1 && !date2) {
      return 0;
    } else {
      throw Assertion.assertNoReachThisCode('DateStringLibrary.compareDates() programming error.');
    }
  }


  static daysBetween(value1: DateString, value2: DateString): number {
    const date1 = moment(value1);
    const date2 = moment(value2);

    return date2.diff(date1, 'days');
  }


  static shortMonthName(value: number, lang: Language = DEFAULT_LANGUAGE) {
    return LocalizationLibrary.shortMonthName(value, lang);
  }


  static today(): DateString {
    return this.mapDateStringFromMoment(moment());
  }


  static getFirstDayOfMonthFromDateString(value: DateString): DateString {
    if (!this.isDate(value)) {
      return '';
    }

    const date = this.toDate(value);
    const firstDate = moment().date(1).month(date.getMonth()).year(date.getFullYear());
    return this.mapDateStringFromMoment(firstDate);
  }


  static todayAddDays(days: number): DateString {
    const date = moment().add(days, 'days');
    return this.mapDateStringFromMoment(date);
  }


  static mapDateStringFromMoment(date: moment.Moment): DateString {
    return date.format('YYYY-MM-DD');
  }


  static datePart(value: DateString): string {
    const date = this.toDate(value);

    if (!date) {
      return '';
    }

    return `${date.getFullYear()}-` +
           `${this.padZeros(date.getMonth() + 1)}-` +
           `${this.padZeros(date.getDate())}`;
  }


  static dateTimePart(value: DateString): string {
    const date = this.toDate(value);

    if (!date) {
      return '';
    }

    return this.datePart(value) +
           `T:${this.padZeros(date.getHours())}:` +
           `${this.padZeros(date.getMinutes())}:${this.padZeros(date.getSeconds())}` +
           `:00Z`;
  }


  static isDate(dateString: DateString): boolean {
    return (!!this.toDate(dateString));
  }


  static isLeapYear(year: number): boolean {
    const divisibleBy4 = ((year % 4) === 0);
    const divisibleBy100 = ((year % 100) === 0);
    const divisibleBy400 = ((year % 400) === 0);

    if (divisibleBy4 && (!divisibleBy100 || divisibleBy400)) {
      return true;
    }
    return false;
  }


  static format(value: DateString, returnedFormat: DateFormat = 'DMY'): string {
    const date = this.toDate(value);

    if (!date) {
      return null;
    }

    const day = this.padZeros(date.getDate());
    const month = LocalizationLibrary.shortMonthName(date.getMonth());
    const year = date.getFullYear();

    switch (returnedFormat) {
      case 'DM':
        return `${day}/${month}`;

      case 'DM HH:mm':
        return `${day}/${month} ${this.militaryTimeFormat(value)}`;

      case 'DMY':
        return `${day}/${month}/${year}`;

      case 'DMY HH:mm':
        return `${day}/${month}/${year} ${this.militaryTimeFormat(value)}`;

      case 'YMD':
        return `${year}/${month}/${day}`;

      case 'MDY':
        return `${month}/${day}/${year}`;

      default:
        Assertion.assertNoReachThisCode(`Unrecognized format ${returnedFormat}.`);
    }
  }


  static toDate(value: DateString): Date {
    if (!value) {
      return null;
    }

    if (value instanceof Date) {
      return this.tryParse(value.toISOString());
    }

    if (typeof value === 'string') {
      return this.tryParse(value as string);
    }

    return null;
  }


  static yearMonth(dateString: DateString): string {
    const date = this.toDate(dateString);

    return date.getFullYear() + '-' + this.padZeros(date.getMonth() + 1);
  }


  static militaryTimeFormat(value: DateString) {
    if (value instanceof Date || typeof value === 'string' && value.includes('T')) {
      const time = typeof value === 'string' ? new Date(value) : value;

      const hour = this.padZeros(time.getHours());
      const minute = this.padZeros(time.getMinutes());

      return `${hour}:${minute}`;
    }

    return '00:00';
  }


  static addTimes(time0, time1) {
    const min0 = this.timeSpanToMins(time0 ?? '00:00:00:00');
    const min1 = this.timeSpanToMins(time1 ?? '00:00:00:00');

    return this.timeFromMins(min0 + min1);
  }


  // private methods


  private static timeSpanToMins(time: string) { // format 01:12:30:00 = 1 day 12 hours 30 minutes 00 seconds
    const b = time.split(':');

    const min = parseInt(b[0]) * MINUTES_IN_DAY + parseInt(b[1]) * MINUTES_IN_HOUR + parseInt(b[2]);

    return min;
  }


  private static timeFromMins(minutes: number) {
    const day = Math.floor(minutes / MINUTES_IN_DAY) || 0;
    const hour = Math.floor((minutes % MINUTES_IN_DAY) / MINUTES_IN_HOUR) || 0;
    const min = Math.floor(minutes % MINUTES_IN_HOUR);
    const seg = 0;

    return `${this.padZeros(day)}:${this.padZeros(hour)}:${this.padZeros(min)}:${this.padZeros(seg)}`;
  }


  private static getYearAsString(year: number): string {
    if (0 <= year && year <= 40) {
      return (year + 2000).toString();

    } else if (40 < year && year <= 100) {
      return (year + 1900).toString();

    } else if (1900 <= year && year <= 2078) {
      return year.toString();

    } else {
      return null;
    }
  }


  private static isValidDate(year: number, month: number, dayOfMonth: number): boolean {
    const monthsWith30Days = [3, 5, 8, 10];
    const monthsWith31Days = [0, 2, 4, 6, 7, 9, 11];

    if (!(1900 <= year && year <= 2078)) {
      return false;
    }

    if (!(0 <= month && month <= 11)) {
      return false;
    }

    if (monthsWith30Days.includes(month)) {
      return (1 <= dayOfMonth && dayOfMonth <= 30);
    }

    if (monthsWith31Days.includes(month)) {
      return (1 <= dayOfMonth && dayOfMonth <= 31);
    }

    if (this.isLeapYear(year)) {
      return (1 <= dayOfMonth && dayOfMonth <= 29);
    } else {
      return (1 <= dayOfMonth && dayOfMonth <= 28);
    }
  }


  private static isNumericValue(value: string): boolean {
    if (isNaN(Number(value))) {
      return false;
    }
    return true;
  }


  private static padZeros(value: number): string {
    const temp = String(value);

    return temp.padStart(2, '0');
  }


  private static tryParse(value: string): Date {
    const dateParts: string[] = this.tryToConvertToDatePartsArray(value);

    if (!dateParts) {
      return null;
    }

    let monthIndex = dateParts.findIndex(x => LocalizationLibrary.findMonth(x) !== -1);
    if (monthIndex !== -1) {
      dateParts[monthIndex] = LocalizationLibrary.findMonth(dateParts[monthIndex]).toString();
    } else {
      monthIndex = this.tryToDeterminateMonthIndex(dateParts);
      if (monthIndex === -1) {
        return null;
      }
      dateParts[monthIndex] = (+dateParts[monthIndex] - 1).toString();
    }

    const yearIndex = this.getArrayIndexWithYear(dateParts);
    dateParts[yearIndex] = this.getYearAsString(+dateParts[yearIndex]);


    let dayIndex = dateParts.findIndex(x => x && x.includes('T'));
    if (dayIndex !== -1) {
      dateParts[dayIndex] = dateParts[dayIndex].substr(0, 2);
    } else {
      dayIndex = this.tryToDeterminateDayIndex(yearIndex, monthIndex);
      if (dayIndex === -1) {
        return null;
      }
    }

    if (!this.isValidDate(+dateParts[yearIndex], +dateParts[monthIndex], +dateParts[dayIndex])) {
      return null;
    }

    return this.tryToGetParsedDate(dateParts, yearIndex, monthIndex, dayIndex);
  }


  private static getArrayIndexWithYear(dateParts: string[]): number {
    let yearIndex = dateParts.findIndex(x => this.isNumericValue(x) &&
      (1900 <= +x && +x <= 2078) || x.length === 4);
    if (yearIndex === -1) {
      yearIndex = 2;
    }
    return yearIndex;
  }


  private static isNumericMonth(value: string): boolean {
    return this.isNumericValue(value) && (1 <= +value && +value <= 12);
  }


  private static tryToConvertToDatePartsArray(value: string): string[] {
    if (!value) {
      return null;
    }

    const dateParts = value.replace(new RegExp('-', 'g'), '/').split('/');

    if (dateParts.length === 3) {
      return dateParts;
    } else {
      return null;
    }
  }


  private static tryToDeterminateDayIndex(yearIndex: number, monthIndex: number): number {
    if (yearIndex === 2 && monthIndex === 1) {
      return 0;
    } else if (yearIndex === 2 && monthIndex === 0) {
      return 1;
    } else if (yearIndex === 0 && monthIndex === 1) {
      return 2;
    } else {
      return -1;
    }
  }


  private static tryToDeterminateMonthIndex(dateParts: string[]): number {
    if (this.isNumericMonth(dateParts[1])) {
      return 1;
    } else if (this.isNumericMonth(dateParts[0])) {
      return 0;
    } else {
      return -1;
    }
  }


  private static tryToGetParsedDate(dateParts: string[], yearIndex: number,
                                    monthIndex: number, dayIndex: number): Date {
    const parsedDate = moment(`${+dateParts[yearIndex]}-` +
      `${this.padZeros(+dateParts[monthIndex] + 1)}-` +
      `${this.padZeros(+dateParts[dayIndex])}`).toDate();

    if (parsedDate && !isNaN(parsedDate.getFullYear())) {
      return parsedDate;
    } else {
      return null;
    }
  }

}
