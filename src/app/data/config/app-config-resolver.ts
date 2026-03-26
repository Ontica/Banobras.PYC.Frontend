/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { AppRoute, Layout, View } from './common';

import { APP_CONFIG } from './app-config';

import { BASE_APP_LAYOUTS, LAYOUT_TYPE } from './layout-config';

import { BUDGET_PERMISSIONS, PAYMENTS_PERMISSIONS,
         assertPermissionsCoverage } from './permissions-by-profile-config';

import { PERMISSIONS } from './permissions-config';

import { BASE_DEFAULT_ROUTE, BASE_ROUTES_LIST } from './routes-config';


const fullLayouts: boolean = !APP_CONFIG.productProfile.enabledLayouts?.length;


const enabledLayouts: LAYOUT_TYPE[] = APP_CONFIG.productProfile.enabledLayouts;


export const APP_LAYOUTS: Layout<LAYOUT_TYPE>[] =
  fullLayouts ?
    BASE_APP_LAYOUTS :
    BASE_APP_LAYOUTS.filter(layout => enabledLayouts.includes(layout.name));


export const APP_VIEWS: View[] =
  APP_LAYOUTS.reduce((views, layout) => views.concat(layout.views), [] as View[]);


const fullRouteParents: boolean = !APP_CONFIG.productProfile.enabledRouteParents?.length;


const enabledRouteParents: string[] = APP_CONFIG.productProfile.enabledRouteParents;


export const ROUTES_LIST: AppRoute[] =
  fullRouteParents ?
    BASE_ROUTES_LIST :
    BASE_ROUTES_LIST.filter(route => enabledRouteParents.includes(route.parent));


export const DEFAULT_ROUTE: AppRoute = APP_CONFIG.productProfile.defaultRoute ?? BASE_DEFAULT_ROUTE;


export const DEFAULT_PATH: string = DEFAULT_ROUTE.fullpath;


export function resolvePermissionsByProfile(permissions: string[]): string[] {
  switch (APP_CONFIG.productProfile.key) {
    case 'Budget':
      return permissions.filter(x => BUDGET_PERMISSIONS.includes(x as PERMISSIONS));
    case 'Payments':
      return permissions.filter(x => PAYMENTS_PERMISSIONS.includes(x as PERMISSIONS));
    default:
      return permissions;
  }
}


assertPermissionsCoverage();
