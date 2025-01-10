/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


export interface AppData {
  name: string;
  nameShort: string;
  organization: string;
  organizationShort: string;
  hint: string;
  description: string;
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

export interface AppSecurity {
  fakeLogin: boolean;
  enablePermissions: boolean;
  encriptLocalStorageData: boolean;
  protectUserWork: boolean;
}


export interface AppConfig {
  data: AppData;
  security: AppSecurity;
  layout: AppLayout;
}


export interface Layout<T> {
  name: T;
  views: View[];
  hint: string;
  defaultTitle: string;
  url: string;
  permission?: string;
}


export type ViewActionType = 'None' | 'ActionFilter' | 'ActionCreate' | 'ActionExport' | 'ActionImport' |
                             'ActionChangeStatus';


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


export const DefaultView: View = {
  name: 'Default view',
  title: 'Default view',
  url: '/',
};
