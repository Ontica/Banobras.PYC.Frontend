/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Router, NavigationEnd } from '@angular/router';

import { filter, take } from 'rxjs/operators';


@Injectable()
export class RoutingStateService {

  private isRoutingInitialized: boolean = false;


  constructor(private router: Router) {
    this.loadRoutingState();
  }


  get isInitialized(): boolean {
    return this.isRoutingInitialized;
  }


  private loadRoutingState(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd), take(1))
      .subscribe((events: NavigationEnd) => this.isRoutingInitialized = !!events.urlAfterRedirects);
  }

}
