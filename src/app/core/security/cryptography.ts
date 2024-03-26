/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


import * as CryptoJS from 'crypto-js';
import { Assertion } from '../general/assertion';


export class Cryptography {

  static createHash(value: string): string {
    return CryptoJS.SHA256(value).toString();
  }


  static encryptAES(key: string, value: string): string {
    return CryptoJS.AES.encrypt(value, key).toString();
  }


  static encryptAES2(plainText: string, secret: string) {
    Assertion.assertValue(plainText, 'plainText');
    Assertion.assertValue(secret, 'secret');
    Assertion.assert(secret.length >= 32, 'secret must be at least 32 in length.');

    const key = CryptoJS.enc.Utf8.parse(secret.substring(secret.length - 32));
    const iv = CryptoJS.enc.Utf8.parse(secret.substring(0, 16));

    return CryptoJS.AES.encrypt(plainText, key, { keySize: 128 / 8, iv: iv }).toString();
  }


  static decryptAES(key: string, value: string): string {
    return CryptoJS.AES.decrypt(value, key).toString(CryptoJS.enc.Utf8);
  }

}
