/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { PERMISSIONS } from "./permissions-config";


export const ROUTES = {

  // #region app-routing module

  tareas: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: '',
    path: 'tareas',
    fullpath: '/tareas',
  },

  presupuesto: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: '',
    path: 'presupuesto',
    fullpath: '/presupuesto',
  },

  pagos: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: '',
    path: 'pagos',
    fullpath: '/pagos',
  },

  flujo_de_efectivo: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: '',
    path: 'flujo-de-efectivo',
    fullpath: '/flujo-de-efectivo',
  },

  reglas_y_catalogos: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: '',
    path: 'reglas-y-catalogos',
    fullpath: '/reglas-y-catalogos',
  },

  administracion: {
    permission: PERMISSIONS.MODULE_ADMINISTRACION_DE_SISTEMA,
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

  // #region tasks-routing module

  tareas_pendientes: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'tareas',
    path: 'pendientes',
    fullpath: '/tareas/pendientes',
  },
  tareas_mesa_de_control: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'tareas',
    path: 'mesa-de-control',
    fullpath: '/tareas/mesa-de-control',
  },
  tareas_completadas: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'tareas',
    path: 'completadas',
    fullpath: '/tareas/completadas',
  },
  tareas_todas: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'tareas',
    path: 'todas',
    fullpath: '/tareas/todas',
  },

  // #endregion

  // #region budget-routing module

  presupuesto_solicitudes: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'presupuesto',
    path: 'solicitudes',
    fullpath: '/presupuesto/solicitudes',
  },

  presupuesto_planeacion: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'presupuesto',
    path: 'planeacion',
    fullpath: '/presupuesto/planeacion',
  },

  presupuesto_control: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'presupuesto',
    path: 'control',
    fullpath: '/presupuesto/control',
  },

  presupuesto_comprometido: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'presupuesto',
    path: 'comprometido',
    fullpath: '/presupuesto/comprometido',
  },

  presupuesto_ejercido: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'presupuesto',
    path: 'ejercido',
    fullpath: '/presupuesto/ejercido',
  },

  presupuesto_reportes: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'presupuesto',
    path: 'reportes',
    fullpath: '/presupuesto/reportes',
  },

  // #endregion

  // #region payments-routing module

  pagos_solicitudes: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'pagos',
    path: 'solicitudes',
    fullpath: '/pagos/solicitudes',
  },

  pagos_comprometidos: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'pagos',
    path: 'comprometidos',
    fullpath: '/pagos/comprometidos',
  },

  pagos_programados: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'pagos',
    path: 'programados',
    fullpath: '/pagos/programados',
  },

  pagos_realizados: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'pagos',
    path: 'realizados',
    fullpath: '/pagos/realizados',
  },

  pagos_contratos: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'pagos',
    path: 'contratos',
    fullpath: '/pagos/contratos',
  },

  pagos_reportes: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'pagos',
    path: 'reportes',
    fullpath: '/pagos/reportes',
  },

  // #endregion

  // #region reporting-routing module

  flujo_de_efectivo_codificacion: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'flujo-de-efectivo',
    path: 'codificacion',
    fullpath: '/flujo-de-efectivo/codificacion',
  },

  flujo_de_efectivo_reglas: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'flujo-de-efectivo',
    path: 'reglas',
    fullpath: '/flujo-de-efectivo/reglas',
  },

  flujo_de_efectivo_reportes: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'flujo-de-efectivo',
    path: 'reportes',
    fullpath: '/flujo-de-efectivo/reportes',
  },

  //#endregion

  // #region catalogues-and-rules-routing module

  reglas_y_catalogos_conceptos_presupuestales: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'reglas-y-catalogos',
    path: 'conceptos-presupuestales',
    fullpath: '/reglas-y-catalogos/conceptos-presupuestales',
  },

  reglas_y_catalogos_reglas_contabilizadoras: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'reglas-y-catalogos',
    path: 'reglas-contabilizadoras',
    fullpath: '/reglas-y-catalogos/reglas-contabilizadoras',
  },

  reglas_y_catalogos_valores_externos: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'reglas-y-catalogos',
    path: 'valores-externos',
    fullpath: '/reglas-y-catalogos/valores-externos',
  },

  reglas_y_catalogos_proveedores: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'reglas-y-catalogos',
    path: 'proveedores',
    fullpath: '/reglas-y-catalogos/proveedores',
  },

  // #endregion

  // #region system-management-routing module

  administracion_panel_de_control: {
    permission: PERMISSIONS.ROUTE_PANEL_CONTROL,
    parent: 'administracion',
    path: 'panel-de-control',
    fullpath: '/administracion/panel-de-control',
  },

  administracion_control_de_accesos: {
    permission: PERMISSIONS.ROUTE_CONTROL_DE_ACCESOS,
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
