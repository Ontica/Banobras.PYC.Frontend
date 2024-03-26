/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { HttpErrorResponse } from '@angular/common/http';

import { ErrorHandler, Injectable, NgZone } from '@angular/core';

import { ErrorMessageService } from '../errors/error-message.service';


@Injectable()
export class ExceptionHandler extends ErrorHandler {

  constructor(private zone: NgZone,
              private errorService: ErrorMessageService) {
    super();
  }


  handleError(error: any): void {

    if (!(error instanceof HttpErrorResponse)) {
      return this.errorService.handleClientSideError(error);
    }

    // to implement the complete error handling here,
    // we need to resolve the issue with promises or
    // use observables instead of promises.
    // the execute() function in the presentation layer return a promise.

    // if (error instanceof HttpErrorResponse) {
    //   if (!navigator.onLine) {
    //     return this.errorService.handleOfflineError();
    //   }
    //   return this.errorService.handleServerSideError(error);
    // } else {
    //   return this.errorService.handleClientSideError(error);
    // }
  }

}
