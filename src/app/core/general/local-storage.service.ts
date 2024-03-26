/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

import { APP_CONFIG } from '@app/main-layout';

import { CORRUPT_LOCAL_STORAGE_MESSAGE } from '../errors/error-messages';

import { Cryptography } from '../security/cryptography';

export enum StorageKeys {
  sessionToken = 'key-01',
  identity     = 'key-02',
  permissions  = 'key-03',
  defaultRoute = 'key-04',
}

const ENCRYPTION_KEY = environment.security_id;

const ENCRIPT_DATA = APP_CONFIG.security.encriptLocalStorageData;

@Injectable()
export class LocalStorageService {

  set<T>(key: StorageKeys, value: T) {
    const valueString = JSON.stringify(value);

    const valueToStore = ENCRIPT_DATA ? Cryptography.encryptAES(ENCRYPTION_KEY, valueString) : valueString;

    localStorage.setItem(key, valueToStore);
  }

  get<T>(key: StorageKeys): T {
    try {
      const valueStored = localStorage.getItem(key);

      if (!valueStored) {
        return null;
      }

      const value = ENCRIPT_DATA ? Cryptography.decryptAES(ENCRYPTION_KEY, valueStored) : valueStored;

      return JSON.parse(value) as T;

    } catch (error) {
      throw new Error(`${CORRUPT_LOCAL_STORAGE_MESSAGE} (DECRYPT): ${key}`);
    }
  }

  remove(key: StorageKeys) {
    localStorage.removeItem(key);
  }

  removeAll() {
    localStorage.clear();
  }

}
