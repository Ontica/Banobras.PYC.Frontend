/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


import { HttpHeaders, HttpParams } from '@angular/common/http';


export enum HttpMethod {
  GET = 1,
  POST = 2,
  DELETE = 4,
  PUT = 8,
  PATCH = 16,
  HEAD = 32,
  OPTIONS = 64
}


export interface HttpClientOptions {

  body?: any;

  headers?: HttpHeaders;

  observe: 'body' | 'events' | 'response';

  params?: HttpParams;

  reportProgress?: boolean;

  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';

  withCredentials?: boolean;

  dataField?: string;

  serviceParams?: any[];
}


export function DefaultHttpClientOptions(): HttpClientOptions {
  return {
    observe: 'response',
    responseType: 'json',
  };
}


export interface Service {

  readonly uid: string;

  readonly baseAddress: string;

  readonly path: string;

  readonly parameters: string[];

  readonly method: HttpMethod;

  readonly description: string;

  readonly isProtected: boolean;

  readonly headers: string[];

  readonly payloadType: string;

  readonly payloadDataField: string;

  readonly responseDataType: string;

}
