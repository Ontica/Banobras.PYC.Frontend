/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, DateStringLibrary } from '@app/core';

import { LAYOUT_TYPE } from './layout-config';


export interface AppConfig<T> {
  data: AppData<T>;
  security: AppSecurity;
  layout: AppLayout;
  versioning: AppVersioning;
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
  defaultRoute?: AppRoute;
}


export interface AppVersioning {
  enableCheck: boolean;
  checkIntervalInMinutes: number;
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


export type AppAlertType = 'VersionUpdate' | 'OutdatedVersion' | 'Info' | 'Warning';


export interface AppAlert {
  id: string;
  type: AppAlertType;
  title: string;
  message: string;
  details?: string;
  persistent?: boolean;
  refreshMandatory?: boolean;
  dateTime?: DateString;
  read?: boolean;
}


export function getVersionUpdateAlert(): AppAlert {
  return {
    id: 'version-update',
    type: 'VersionUpdate',
    title: 'Actualización disponible',
    message: 'Se detectó una nueva versión del sistema. ' +
      'Refresque la página para aplicar los cambios.',
    details: 'Se detectó una nueva versión del sistema. ' +
      'Refresque la página para aplicar los cambios. ' +
      'Si no visualiza nuevas opciones o accesos, cierre sesión e inicie sesión nuevamente.',
    dateTime: DateStringLibrary.today(),
    persistent: true,
    read: false,
  };
}


export function getOutdatedVersionAlert(): AppAlert {
  return {
    id: 'version-outdated',
    type: 'OutdatedVersion',
    title: 'Actualización requerida',
    message: 'Se detectó una actualización del sistema. Es necesario refrescar la página para continuar.',
    details: 'Se detectó una actualización del sistema. Es necesario refrescar la página para continuar.',
    dateTime: DateStringLibrary.today(),
    persistent: true,
    refreshMandatory: true,
    read: false,
  };
}
