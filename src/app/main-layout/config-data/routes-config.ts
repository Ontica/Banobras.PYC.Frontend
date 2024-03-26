/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { PERMISSIONS } from "./permissions-config";


export const ROUTES = {

  // #region app-routing module

  administracion: {
    permission: PERMISSIONS.ALL,
    parent: '',
    path: 'administracion',
    fullpath: '/administracion',
  },
  security: {
    parent: '',
    path: 'seguridad',
    fullpath: '/seguridad',
  },

  unauthorized: {
    parent: '',
    path: 'no-autorizado',
    fullpath: '/no-autorizado',
  },

  // #endregion

  // #region system-management-routing module

  administracion_panel_de_control: {
    permission: PERMISSIONS.ALL,
    parent: 'administracion',
    path: 'panel-de-control',
    fullpath: '/administracion/panel-de-control',
  },

  administracion_control_de_accesos: {
    permission: PERMISSIONS.ALL,
    parent: 'administracion',
    path: 'control-de-accesos',
    fullpath: '/administracion/control-de-accesos',
  },

  // #endregion

  // #region security-routing module

  security_login: {
    parent: 'seguridad',
    path: 'login',
    fullpath: '/seguridad/login'
  },

  // #endregion

};


export const DEFAULT_ROUTE = ROUTES.administracion_panel_de_control;


export const DEFAULT_PATH = DEFAULT_ROUTE.fullpath;


export const LOGIN_PATH = ROUTES.security_login.fullpath;


export const UNAUTHORIZED_PATH = ROUTES.unauthorized.path;


export const ROUTES_LIST = Object.keys(ROUTES)
                                 .map(key => ROUTES[key])
                                 .filter(x => x.parent && x.permission);
