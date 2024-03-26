/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { View } from './common';


export class MenuItem {

  readonly action: string;

  readonly text: string;

  readonly routerLink: string;

  private disabledFlag = false;

  private selectedFlag = false;


  constructor(text: string, action = '', routerLink = '', disabled = false) {
    this.text = text;
    this.action = action;
    this.routerLink = routerLink;
    this.disabledFlag = disabled;
  }


  get disabled(): boolean {
    return this.disabledFlag;
  }


  get enabled(): boolean {
    return !this.disabledFlag;
  }


  get selected(): boolean {
    return this.selectedFlag;
  }

  enable() {
    this.disabledFlag = false;
  }

  disable() {
    this.disabledFlag = true;
  }

  select() {
    this.selectedFlag = true;
  }

  unselect() {
    this.selectedFlag = false;
  }

}


export function createMenuItemForView(view: View): MenuItem {
  return new MenuItem(view.menuTitle || view.title, undefined, view.url, view.disabled);
}
