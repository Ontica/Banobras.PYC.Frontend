/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DEFAULT_LANGUAGE, Language } from './common';

import * as English from './locales/locale-english';
import * as Spanish from './locales/locale-spanish';


export class LocalizationLibrary {

  static daysNames(lang: Language = DEFAULT_LANGUAGE): string[] {
    switch (lang) {
      case 'sp':
        return Spanish.SPANISH_DAYS;

      case 'en':
        return English.ENGLISH_DAYS;

      default:
        throw this.UnsupportedLanguage('daysNames', lang);
    }
  }


  static findMonth(monthName: string): number {
    // ToDo: replace by an array look up using a for

    const month = this.getMonth(monthName, 'sp');

    if (month !== -1) {
      return month;
    }

    return this.getMonth(monthName, 'en');
  }


  static getMonth(monthName: string,
                  lang: Language = DEFAULT_LANGUAGE): number {

    switch (lang) {
      case 'sp':
        return Spanish.SPANISH_SHORT_MONTHS.findIndex(x => x.toLowerCase() === monthName.toLowerCase());

      case 'en':
        return English.ENGLISH_SHORT_MONTHS.findIndex(x => x.toLowerCase() === monthName.toLowerCase());

      default:
        throw this.UnsupportedLanguage('getMonth', lang);
    }

  }


  static monthNames(lang = DEFAULT_LANGUAGE): string[] {
    switch (lang) {
      case 'sp':
        return Spanish.SPANISH_MONTHS;

      case 'en':
        return English.ENGLISH_MONTHS;

      default:
        throw this.UnsupportedLanguage('monthNames', lang);
    }
  }


  static shortDaysNames(lang: Language = DEFAULT_LANGUAGE): string[] {
    switch (lang) {
      case 'sp':
        return Spanish.SPANISH_SHORT_DAYS;

      case 'en':
        return English.ENGLISH_SHORT_DAYS;

      default:
        throw this.UnsupportedLanguage('shortDaysNames', lang);
    }
  }


  static shortMonthName(month: number,
                        lang: Language = DEFAULT_LANGUAGE) {
    switch (lang) {
      case 'sp':
        return Spanish.SPANISH_SHORT_MONTHS[month];

      case 'en':
        return English.ENGLISH_SHORT_MONTHS[month];

      default:
        throw this.UnsupportedLanguage('shortMonthName', lang);
    }
  }


  static shortMonthNames(lang: Language = DEFAULT_LANGUAGE): string[] {
    switch (lang) {
      case 'sp':
        return Spanish.SPANISH_SHORT_MONTHS;

      case 'en':
        return English.ENGLISH_SHORT_MONTHS;

      default:
        throw this.UnsupportedLanguage('shortMonthNames', lang);
    }
  }


  /// private methods

  private static UnsupportedLanguage(fnName: string,
                                     lang: Language): Error {

    return new Error(`Localization library method '${fnName}'
                      do not support language '${lang}'.`);
  }

}
