/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { KeyValue } from '../data-types/key-value';


export class ApplicationSettings {

  constructor(private settingsArray: KeyValue[]) {

  }

  get applicationKey(): string {
    return this.get<string>('APPLICATION_KEY');
  }

  get httpApiBaseAddress(): string {
    return this.get<string>('HTTP_API_BASE_ADDRESS');
  }

  get<T>(key: string): T {
    const index = this.settingsArray.findIndex((x) => x.key === key);

    if (index !== -1) {
      return this.settingsArray[index].value as T;
    } else {
      throw new Error(`'${key}' value is not defined in application settings file.`);
    }
  }

}
