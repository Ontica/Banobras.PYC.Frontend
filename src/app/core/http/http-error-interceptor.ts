/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  HttpEvent, HttpInterceptor,
  HttpErrorResponse,
  HttpRequest, HttpHandler
} from '@angular/common/http';

import { HttpException } from '../general/exception';
import { ErrorMessageService } from '../errors/error-message.service';


@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private errorService: ErrorMessageService) { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        catchError((err) => throwError(this.getNormalizedHttpErrorResponse(err, req)))
      );
  }


  private getNormalizedHttpErrorResponse(sourceErr: any,
                                         request: HttpRequest<any>): HttpErrorResponse {
    if (!(sourceErr instanceof HttpErrorResponse)) {
      return this.getUnknownHttpError(sourceErr, request);
    }

    if (this.isEmpiriaServerError(sourceErr)) {
      const normalizedErrorResponse = this.getNormalizedErrorResponse(sourceErr, request);
      this.errorService.handleServerSideError(normalizedErrorResponse);
      return normalizedErrorResponse;
    }

    if (sourceErr.status === 0 && this.isInternetDisconnected()) {
      this.errorService.handleOfflineError();
      return this.getInternetDisconnectedError(sourceErr, request);
    }

    return this.getUnknownHttpError(sourceErr, request);
  }


  // HttpErrorResponse normalization methods


  private getInternetDisconnectedError(sourceErr: HttpErrorResponse,
                                       request: HttpRequest<any>): HttpErrorResponse {
    const exception = new HttpException(`[ERR_INTERNET_DISCONNECTED] No hay conexión a Internet.`,
      sourceErr,
      { request, response: sourceErr.error });

    const errorResponseData = this.getDefaultHttpErrorResponseData(sourceErr, request, exception);

    return new HttpErrorResponse(errorResponseData);
  }


  private getNormalizedErrorResponse(sourceErr: any,
                                     request: HttpRequest<any>): HttpErrorResponse {
    const exception = new HttpException(
      `[${sourceErr.error.data.errorCode}] ${sourceErr.error.data.errorMessage}`,
      sourceErr,
      { request, response: sourceErr.error }
    );

    const errorResponseData = this.getDefaultHttpErrorResponseData(sourceErr, request, exception);
    errorResponseData.statusText = sourceErr.error.data.statusCode;

    return new HttpErrorResponse(errorResponseData);
  }


  private getUnknownHttpError(sourceErr: any,
                              request: HttpRequest<any>): HttpErrorResponse {
    const exception = new HttpException(
      `[ERR_CONNECTION_REFUSED] Error desconocido de conexión al servidor.`,
      sourceErr,
      { request, response: sourceErr.error }
    );

    const errorResponseData = this.getDefaultHttpErrorResponseData(sourceErr, request, exception);

    return new HttpErrorResponse(errorResponseData);
  }


  // Utility methods


  private getDefaultHttpErrorResponseData(sourceErr: any,
                                          request: HttpRequest<any>,
                                          exception: HttpException) {
    return {
      error: exception,
      headers: sourceErr.headers,
      status: sourceErr.status,
      statusText: exception.message,
      url: request.urlWithParams
    };
  }

  private isEmpiriaServerError(err: HttpErrorResponse): boolean {
    if (err.status === 0) {
      return false;
    }
    if ('payloadType' in err.error && err.error.payloadType === 'ExceptionModel') {
      return true;
    }
    return false;
  }


  private isInternetDisconnected(): boolean {
    return (!navigator.onLine);
  }

}
