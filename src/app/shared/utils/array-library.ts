/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


export class ArrayLibrary {

  static insertIfNotExist<T, K extends keyof T>(array: T[], item: T, key: K): T[] {
    let newArray = [...array];
    if (array.filter(element => element[key] === item[key]).length === 0) {
      newArray = [...array, ...[item]];
    }
    return newArray;
  }


  static insertItemTop<T, K extends keyof T>(array: T[], item: T, key: K): T[] {
    const oldArrayFilter = array.filter(element => element[key] !== item[key]);
    const newArray = [...[item], ...oldArrayFilter];
    return newArray;
  }


  static getFirstItem<T>(array: T[]): T {
    return array.length > 0 ?
      array.find(e => typeof e !== 'undefined') :
      null;
  }


  static getUniqueItems<T, K extends keyof T>(array: T[], key?: K): T[] {
    return array.reduce((acc, item) => {
      if (key) {
        if (!acc.find(x => x[key] === item[key])) {
          acc.push(item);
        }
      } else {
        if (!acc.includes(item)) {
          acc.push(item);
        }
      }
      return acc;
    }, []);
  }


  static sortByArrayKeyLenght<T, K extends keyof T>(array: T[], key: K): T[] {
    return array.sort((a, b) => this.compareArrayValuesLenght(a[key], b[key]));
  }


  static compareArrayValuesLenght(previus: any, current: any): number {
    if (previus.length > current.length) {
      return 1;
    }
    if (previus.length < current.length) {
      return -1;
    }
    return 0;
  }

}
