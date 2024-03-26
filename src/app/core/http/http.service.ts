/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { switchMap } from 'rxjs/operators';

import { Assertion } from '../general/assertion';

import { DirectoryService } from './directory.service';

import { HttpHandler } from './http-handler';

import { HttpClientOptions, HttpMethod } from './common-types';

import { EmpObservable } from '../data-types';


@Injectable()
export class HttpService {

  constructor(private httpHandler: HttpHandler,
              private directory: DirectoryService) { }


  get<T>(path: string, options?: HttpClientOptions): EmpObservable<T> {
    Assertion.assertValue(path, 'path');

    return new EmpObservable(
      this.directory.getService(path, HttpMethod.GET)
        .pipe(
          switchMap(service => this.httpHandler.get<T>(path, options, service))
        )
    );
  }


  post<T>(path: string, body?: any, options?: HttpClientOptions): EmpObservable<T> {
    Assertion.assertValue(path, 'path');

    return new EmpObservable(
      this.directory.getService(path, HttpMethod.POST)
        .pipe(
          switchMap(service => this.httpHandler.post<T>(path, body, options, service))
        )
    );
  }


  put<T>(path: string, body: any, options?: HttpClientOptions): EmpObservable<T> {
    Assertion.assertValue(path, 'path');

    return new EmpObservable(
      this.directory.getService(path, HttpMethod.PUT)
        .pipe(
          switchMap(service => this.httpHandler.put<T>(path, body, options, service))
        )
    );
  }


  patch<T>(path: string, body: any, options?: HttpClientOptions): EmpObservable<T> {
    Assertion.assertValue(path, 'path');

    return new EmpObservable(
      this.directory.getService(path, HttpMethod.PATCH)
        .pipe(
          switchMap(service => this.httpHandler.patch<T>(path, body, options, service))
        )
    );
  }


  delete<T>(path: string, body?: any, options?: HttpClientOptions): EmpObservable<T> {
    Assertion.assertValue(path, 'path');

    return new EmpObservable(
      this.directory.getService(path, HttpMethod.DELETE)
        .pipe(
          switchMap(service =>
            this.httpHandler.delete<T>(path, body, options, service))
        )
    );
  }

}
