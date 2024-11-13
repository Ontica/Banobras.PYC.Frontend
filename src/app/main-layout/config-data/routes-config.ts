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

  flujo_de_efectivo: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: '',
    path: 'flujo-de-efectivo',
    fullpath: '/flujo-de-efectivo',
  },

  contratos: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: '',
    path: 'contratos',
    fullpath: '/contratos',
  },

  pagos: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: '',
    path: 'pagos',
    fullpath: '/pagos',
  },

  activo_fijo: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: '',
    path: 'activo-fijo',
    fullpath: '/activo-fijo',
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

  // #region steps-routing module

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

  presupuesto_transacciones: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'presupuesto',
    path: 'transacciones',
    fullpath: '/presupuesto/transacciones',
  },

  presupuesto_explorador: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'presupuesto',
    path: 'explorador',
    fullpath: '/presupuesto/explorador',
  },

  presupuesto_planeacion_anual : {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'presupuesto',
    path: 'planeacion-anual',
    fullpath: '/presupuesto/planeacion-anual',
  },

  presupuesto_configuracion: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'presupuesto',
    path: 'configuracion',
    fullpath: '/presupuesto/configuracion',
  },

  presupuesto_reportes: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'presupuesto',
    path: 'reportes',
    fullpath: '/presupuesto/reportes',
  },

  // #endregion

  // #region cashflow-routing module

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

  // #region contracts-routing module

  contratos_solicitudes: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'contratos',
    path: 'solicitudes',
    fullpath: '/contratos/solicitudes',
  },

  contratos_explorador: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'contratos',
    path: 'explorador',
    fullpath: '/contratos/explorador',
  },

  contratos_entregas: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'contratos',
    path: 'entregas',
    fullpath: '/contratos/entregas',
  },

  contratos_proveedores: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'contratos',
    path: 'proveedores',
    fullpath: '/contratos/proveedores',
  },

  contratos_productos: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'contratos',
    path: 'productos',
    fullpath: '/contratos/productos',
  },

  contratos_reportes: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'contratos',
    path: 'reportes',
    fullpath: '/contratos/reportes',
  },

  //#endregion

  // #region payments-routing module

  pagos_solicitudes: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'pagos',
    path: 'solicitudes',
    fullpath: '/pagos/solicitudes',
  },

  pagos_ordenes_de_pago: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'pagos',
    path: 'ordenes-de-pago',
    fullpath: '/pagos/ordenes-de-pago',
  },

  pagos_obligaciones_de_pago: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'pagos',
    path: 'obligaciones-de-pago',
    fullpath: '/pagos/obligaciones-de-pago',
  },

  pagos_facturas: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'pagos',
    path: 'facturas',
    fullpath: '/pagos/facturas',
  },

  pagos_reportes: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'pagos',
    path: 'reportes',
    fullpath: '/pagos/reportes',
  },

  // #endregion

  // #region fixed-assets-routing module

  activo_fijo_solicitudes: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'activo-fijo',
    path: 'solicitudes',
    fullpath: '/activo-fijo/solicitudes',
  },

  activo_fijo_transacciones: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'activo-fijo',
    path: 'transacciones',
    fullpath: '/activo-fijo/transacciones',
  },

  activo_fijo_explorador: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'activo-fijo',
    path: 'explorador',
    fullpath: '/activo-fijo/explorador',
  },

  activo_fijo_valuacion: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'activo-fijo',
    path: 'valuacion',
    fullpath: '/activo-fijo/valuacion',
  },

  activo_fijo_configuracion: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'activo-fijo',
    path: 'configuracion',
    fullpath: '/activo-fijo/configuracion',
  },

  activo_fijo_reportes: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'activo-fijo',
    path: 'reportes',
    fullpath: '/activo-fijo/reportes',
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
