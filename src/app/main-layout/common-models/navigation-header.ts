/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { LAYOUT_TYPE, PERMISSIONS } from '../config-data';

import { Layout, View, ViewAction } from './common';

import { MenuItem, createMenuItemForView } from './menu-item';


export interface NavigationHeader {
  title: string;
  hint: string;
  mainMenu: MenuItem[];
  actions: ViewAction[];
}


export const DefaultNavigationHeader: NavigationHeader = {
  title: '',
  hint: '',
  mainMenu: [],
  actions: [],
};


export function buildNavigationHeader(layout: Layout<LAYOUT_TYPE>,
                                      permissions: string[],
                                      value?: NavigationHeader | View): NavigationHeader {
  const navHeader: NavigationHeader = {
    title: value.title || layout.defaultTitle,
    hint: layout.hint,
    mainMenu: [],
    actions: value.actions,
  };

  for (const view of layout.views) {
    const menuItem = createMenuItemForView(view);

    if (view.permission === PERMISSIONS.NOT_REQUIRED || permissions.includes(view.permission)) {
      navHeader.mainMenu.push(menuItem);
    }
  }

  return navHeader;
}
