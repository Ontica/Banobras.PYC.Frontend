/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { HttpErrorResponse, HttpEvent, HttpEventType, HttpProgressEvent,
         HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { distinctUntilChanged, scan } from 'rxjs/operators';


export function isHttpResponse<T>(event: HttpEvent<T>): event is HttpResponse<T> {
  return event.type === HttpEventType.Response;
}


export function isHttpProgressEvent(event: HttpEvent<unknown>): event is HttpProgressEvent {
  return (
    event.type === HttpEventType.DownloadProgress ||
    event.type === HttpEventType.UploadProgress
  );
}


export interface Progress {
  progress: number;
  loaded: number;
  state: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'ERROR';
  data: Blob | null;
}


export function reportHttpProgress(saver?: (b: Blob) => void):
  (source: Observable<HttpEvent<Blob>>) => Observable<Progress> {

  return (source: Observable<HttpEvent<Blob>>) =>
    source.pipe(
      scan((progress: Progress, event): Progress => {
        if (isHttpProgressEvent(event)) {
          return {
            progress: event.total ? Math.round((100 * event.loaded) / event.total) : progress.progress,
            loaded: event.loaded,
            state: 'IN_PROGRESS',
            data: null
          };
        }
        if (isHttpResponse(event)) {
          if (saver) {
            saver(event.body['data'] ?? event.body);
          }

          return {
            progress: 100,
            loaded: event.body.size,
            state: 'DONE',
            data: event.body['data'] ?? event.body
          };
        }
        return progress;
      },
        { state: 'PENDING', progress: 0, loaded: 0, data: null }
      ),
      distinctUntilChanged((a, b) => a.state === b.state
        && a.progress === b.progress
        && a.data === b.data
      ),
      // catchError(errorNormalized)
    );
}


function errorNormalized(error: HttpErrorResponse): Observable<Progress> {
  if (error.error instanceof ErrorEvent) {
    console.log(error.error.message);
  } else {
    console.log(`Error Code: ${error.status} Message: ${error.message}`);
  }

  return of({ state: 'ERROR', progress: 0, loaded: 0, data: null });
}
