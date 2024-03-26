/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MenuPositionX, MenuPositionY } from '@angular/material/menu';


export interface MenuConfig {
  modeOnlyIcon?: boolean;
  hideMenuIfOneItem?: boolean;
  textButton?: string;
  icon?: string;
  bindLabel?: string;
  bindIcon?: string;
  yPosition?: MenuPositionY;
  xPosition?: MenuPositionX;
}


const DefaultMenuConfig: MenuConfig = {
  modeOnlyIcon: true,
  hideMenuIfOneItem: false,
  textButton: 'Menu',
  icon: 'more_vert',
  bindLabel: 'name',
  bindIcon: 'icon',
  yPosition: 'below',
  xPosition: 'after'
};


@Component({
  selector: 'emp-ng-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  @Input() items: any[] = [];

  @Output() selected = new EventEmitter<any>();

  @Input()
  get config() {
    return this.menuConfig;
  }
  set config(value: MenuConfig) {
    this.menuConfig = Object.assign({}, DefaultMenuConfig, value);
  }

  menuConfig = DefaultMenuConfig;

  get getFirstIfOneItem() {
    return this.items.length === 1 ? this.items[0] : null;
  }

  get hideMenuIfOneItem() {
    return this.menuConfig.hideMenuIfOneItem && this.getFirstIfOneItem;
  }

  get showMenu() {
    return !this.menuConfig.hideMenuIfOneItem ||
      (this.menuConfig.hideMenuIfOneItem && this.items.length > 1);
  }


  onSelectItem(item) {
    this.selected.next(item);
  }

}
