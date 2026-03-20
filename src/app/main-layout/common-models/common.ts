/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { LAYOUT_TYPE } from '../config-data';


export interface AppConfig<T> {
  data: AppData<T>;
  security: AppSecurity;
  layout: AppLayout;
  productProfile?: AppProductProfile<T>;
}


export interface AppData<T> {
  name: string;
  nameShort: string;
  organization: string;
  organizationShort: string;
  hint: string;
  description: string;
}


export interface AppSecurity {
  fakeLogin: boolean;
  enablePermissions: boolean;
  encriptLocalStorageData: boolean;
  protectUserWork: boolean;
}


export interface AppLayout {
  displayLoginRight: boolean;
  displayLogo: boolean;
  displayNavbarHeader: boolean;
  displayNavbarHint: boolean;
  displayMenuUser: boolean;
  displayChangeLanguage: boolean;
  displayChangePassword: boolean;
  displaySubMenu: boolean;
  displayHeader: boolean;
  displayFooter: boolean;
}


export interface AppProductProfile<T> {
  key: T;
  name?: string;
  nameShort?: string;
  hint?: string,
  organization?: string,
  organizationShort?: string,
  description?: string;
  enabledLayouts?: LAYOUT_TYPE[];
  enabledRouteParents?: string[];
  defaultRoute?: any;
}


export interface Layout<T> {
  name: T;
  views: View[];
  hint: string;
  defaultTitle: string;
  url: string;
  permission?: string;
}


export interface View {
  name: string;
  title: string;
  url: string;
  menuTitle?: string;
  disabled?: boolean;
  hidden?: boolean;
  permission?: string;
  actions?: ViewAction[];
}


export interface ViewAction {
  action: ViewActionType;
  name: string;
  icon?: string;
  permission?: string;
}


export interface AppRoute {
  parent: string;
  path: string;
  fullpath: string;
  permission?: string;
}


export type ViewActionType = 'None' | 'ActionFilter' | 'ActionCreate' | 'ActionExport' | 'ActionImport' |
                             'ActionChangeStatus';


export const DefaultView: View = {
  name: 'Default view',
  title: 'Default view',
  url: '/',
};
