/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


export class StringLibrary {


  static includesAll(source: string, keywords: string): boolean {
    if (!source || StringLibrary.trimAll(source).length === 0) {
      return false;
    }
    if (!keywords || StringLibrary.trimAll(keywords).length === 0) {
      return true;
    }

    const array = StringLibrary.trimAll(keywords).split(' ');

    for (const keyword of array) {
      if (!source.includes(keyword)) {
        return false;
      }
    }
    return true;
  }


  static prepareForFiltering(source: string): string {
    if (!source) {
      return '';
    }
    let temp = StringLibrary.removePunctuation(source);

    temp = StringLibrary.removeAccents(temp);

    return temp;
  }


  static trimAll(source: string): string {
    if (!source) {
      return '';
    }
    let temp = source.trim();

    while (temp.includes('  ')) {
      temp = temp.replace('  ', ' ');
    }

    return temp.trim();
  }


  // private methods


  private static removeAccents(source: string): string {
    if (!source) {
      return '';
    }

    let temp = source.toLowerCase();

    const replaceable: string[] = ['á', 'à', 'é', 'è', 'í', 'ó', 'ú', 'ü', 'ù', 'ñ'];
    const replaceBy: string[] = ['a', 'a', 'e', 'e', 'i', 'o', 'u', 'u', 'ù', 'n'];

    for (let i = 0; i < replaceable.length; i++) {
      temp = temp.replace(replaceable[i], replaceBy[i]);
    }

    return temp;
  }


  private static removePunctuation(source: string): string {
    if (!source) {
      return '';
    }

    let temp = source;

    const chars: string[] = ['.', ',', ';', ':', '"', '\'', '/', '\\', '>', '<', '=', '-', '_',
                             '?', '*', '$', '&', '+', '(', ')', '{', '}', '[', ']', '^', '¬',
                             '°', '%', '#', '¿', '!', '¡', '`', '~', '|'];

    for (const char of chars) {
      temp = temp.replace(char, ' ');
    }

    return StringLibrary.trimAll(temp);
  }


  static isValidHttpUrl(urlString) {
    let url;

    try {
      url = new URL(urlString);
    } catch (e) {
      return false;
    }

    return url.protocol === 'http:' || url.protocol === 'https:';
  }

}
