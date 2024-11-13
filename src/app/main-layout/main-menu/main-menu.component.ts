/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { Layout } from '../common-models';

import { APP_CONFIG, APP_LAYOUTS, LAYOUT_TYPE } from '../config-data';

@Component({
  selector: 'emp-ng-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent {

  appLayoutConfig = APP_CONFIG.layout;

  layouts: Layout<LAYOUT_TYPE>[] = APP_LAYOUTS;

  constructor(private router: Router) { }


  isLayoutSelected(layout: Layout<LAYOUT_TYPE>) {
    return this.router.isActive(layout.url,
      { paths: 'subset', queryParams: 'subset', fragment: 'ignored', matrixParams: 'ignored' });
  }

}
