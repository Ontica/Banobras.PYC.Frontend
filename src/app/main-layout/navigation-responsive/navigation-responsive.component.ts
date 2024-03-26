/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'emp-ng-navigation-responsive',
  templateUrl: './navigation-responsive.component.html',
  styleUrls: ['./navigation-responsive.component.scss']
})
export class NavigationResponsiveComponent {

  @Output() openMenuEvent = new EventEmitter<void>();

  isMenuOpen = false;

  onOpenMenuClick() {
    this.openMenuEvent.next();
  }

}
