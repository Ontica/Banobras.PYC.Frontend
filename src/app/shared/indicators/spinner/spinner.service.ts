/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { Displayable } from '../../common-models';


@Injectable()
export class SpinnerService implements Displayable {

  private spinnerSubject = new BehaviorSubject<boolean>(false);

  get state(): Observable<boolean> {
    return this.spinnerSubject.asObservable();
  }


  get value(): boolean {
    return this.spinnerSubject.value;
  }


  show() {
    this.spinnerSubject.next(true);
  }


  hide() {
    this.spinnerSubject.next(false);
  }

}
