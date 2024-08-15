/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


import * as pako from 'pako';


export class Compression {


  static compress(data: string): string {
    const binaryString = new TextEncoder().encode(data);
    const compressed = pako.gzip(binaryString, { level: 8 });
    return btoa(String.fromCharCode(...compressed));
  }


  static decompress(compressedData: string): string {
    const compressed = new Uint8Array(atob(compressedData).split('').map(c => c.charCodeAt(0)));
    const decompressed = pako.ungzip(compressed, { to: 'string' });
    return decompressed;
  }

}
