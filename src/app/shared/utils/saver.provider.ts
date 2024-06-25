/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { InjectionToken } from '@angular/core';
// import { saveAs } from 'file-saver';


export type Saver = (blob: Blob, filename?: string) => void;


export const SAVER = new InjectionToken<Saver>('saver');


export function getSaver(): Saver {
  return saveAs;
}


function saveAs(blob: Blob, filename: string) {
  const blobURL = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = blobURL;
  a.setAttribute('download', filename);

  if (typeof a.download === 'undefined') {
    a.setAttribute('target', '_blank');
  }

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  setTimeout(() => {
    window.URL.revokeObjectURL(blobURL);
  }, 100);
}
