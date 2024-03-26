/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Subject, Subscription } from 'rxjs';

import { takeUntil } from 'rxjs/operators';

import { PresentationLayer } from './presentation-layer';

import { StateSelector } from './presentation-types';

import { EmpObservable } from '../data-types';


export class SubscriptionHelper {

  private unsubscribe: Subject<void> = new Subject();

  constructor(private uiLayer: PresentationLayer) { }


  select<U>(stateSelector: StateSelector, params?: any): EmpObservable<U> {
    return new EmpObservable(
      this.uiLayer.select<U>(stateSelector, params)
        .pipe(takeUntil(this.unsubscribe))
    );
  }


  subscribe<U>(stateSelector: StateSelector, callback?: (x: U) => void): Subscription {
    return this.uiLayer.select<U>(stateSelector)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(x => callback(x));
  }


  destroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
