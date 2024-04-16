/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Observable, firstValueFrom } from 'rxjs';


export function resolve<U>(value?: U): Promise<U> {
  if (value) {
    return Promise.resolve<U>(value);
  } else {
    return Promise.resolve() as any as Promise<U>;
  }
}


export function toObservable<U>(value: Observable<U>): Observable<U> {
  return value as Observable<U>;
}


export function getFirstValueFrom<U>(value: Promise<U> | Observable<U> | EmpObservable<U>): Promise<U> {
  if (value instanceof Observable) {
    return firstValueFrom<U>(value);

  } else if (value instanceof Promise) {
    return value as Promise<U>;

  } else {
    return Promise.resolve<U>(value);
  }
}


export class EmpObservable<T> extends Observable<T> {

  // TODO: refactor to not use source
  constructor(source?: Observable<T>) {
    super();
    this.source = source;
  }

  firstValue<T>(this: Observable<T>): Promise<T> {
    return firstValueFrom<T>(this);
  }

}
