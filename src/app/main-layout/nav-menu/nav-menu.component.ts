/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';

import { MenuItem } from '../common-models';

@Component({
  selector: 'emp-ng-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavigationMenuComponent implements OnChanges {

  @Input() items: MenuItem[] = [];

  @Output() navMenuItemClick = new EventEmitter<MenuItem>();


  ngOnChanges() {
    if (!this.items) {
      return;
    }

    const selected = this.items.find(x => x.selected) || this.items[0];

    this.onClick(selected);
  }


  onClick(menuItem: MenuItem) {
    if (!menuItem) {
      return;
    }
    this.select(menuItem);

    this.navMenuItemClick.emit(menuItem);
  }


  private select(menuItem: MenuItem) {
    if (!menuItem) {
      return;
    }
    this.items.filter(x => x.selected).forEach(x => x.unselect());

    menuItem.select();
  }

}
