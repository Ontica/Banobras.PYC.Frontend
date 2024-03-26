/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { Layout } from '../common-models';

import { APP_CONFIG, APP_LAYOUTS } from '../config-data';

@Component({
  selector: 'emp-ng-main-menu-left',
  templateUrl: './main-menu-left.component.html',
  styleUrls: ['./main-menu-left.component.scss'],
})
export class MainMenuLeftComponent {

  appLayoutConfig = APP_CONFIG.layout;

  layouts: Layout[] = APP_LAYOUTS;

  constructor(private router: Router) {}


  isLayoutSelected(layout: Layout) {
    return this.router.isActive(layout.url,
      {paths: 'subset', queryParams: 'subset', fragment: 'ignored', matrixParams: 'ignored'});
  }

}
