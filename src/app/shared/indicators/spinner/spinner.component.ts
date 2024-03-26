/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, Input } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Assertion } from '@app/core';


export type OverlayType = 'None' | 'Container' | 'FullScreen';


@Component({
  selector: 'emp-ng-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent implements OnDestroy {

  @Input()
  set overlay(value: OverlayType) {
    this.overlayClass = SpinnerComponent.getContainerClass(value);
  }


  @Input()
  set service(service: Observable<boolean>) {
    if (!service) {
      return;
    }
    this.subscription = service.subscribe(
      x => this.visible = x
    );
  }

  @Input() visible = false;

  overlayClass = SpinnerComponent.getContainerClass('Container');

  private subscription: Subscription;


  private static getContainerClass(overlayType: OverlayType) {
    switch (overlayType) {
      case 'None':
        return 'no-overlay';
      case 'Container':
        return 'container-overlay';
      case 'FullScreen':
        return 'full-screen-overlay';
      default:
        throw Assertion.assertNoReachThisCode(`Unhandled spinner overlay ${overlayType}.`);
    }
  }


  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
