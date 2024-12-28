/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { PERMISSIONS } from './permissions-config';


export const ROUTES = {

  // #region app-routing module

  tareas: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: '',
    path: 'tareas',
    fullpath: '/tareas',
  },

  adquisiciones: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: '',
    path: 'adquisiciones',
    fullpath: '/adquisiciones',
  },

  pagos: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: '',
    path: 'pagos',
    fullpath: '/pagos',
  },

  presupuesto: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: '',
    path: 'presupuesto',
    fullpath: '/presupuesto',
  },

  inventarios: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: '',
    path: 'inventarios',
    fullpath: '/inventarios',
  },

  flujo_de_efectivo: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: '',
    path: 'flujo-de-efectivo',
    fullpath: '/flujo-de-efectivo',
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

  // #region procurement-routing module

  adquisiciones_solicitudes: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'adquisiciones',
    path: 'solicitudes',
    fullpath: '/adquisiciones/solicitudes',
  },

  adquisiciones_contratos: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'adquisiciones',
    path: 'contratos',
    fullpath: '/adquisiciones/contratos',
  },

  adquisiciones_compras_menores: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'adquisiciones',
    path: 'compras-menores',
    fullpath: '/adquisiciones/compras-menores',
  },

  adquisiciones_entregas: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'adquisiciones',
    path: 'entregas',
    fullpath: '/adquisiciones/entregas',
  },

  adquisiciones_productos: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'adquisiciones',
    path: 'productos',
    fullpath: '/adquisiciones/productos',
  },

  adquisiciones_reportes: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'adquisiciones',
    path: 'reportes',
    fullpath: '/adquisiciones/reportes',
  },

  //#endregion

  // #region payments-routing module

  pagos_solicitudes: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'pagos',
    path: 'solicitudes',
    fullpath: '/pagos/solicitudes',
  },

  pagos_obligaciones_de_pago: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'pagos',
    path: 'obligaciones-de-pago',
    fullpath: '/pagos/obligaciones-de-pago',
  },

  pagos_ordenes_de_pago: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'pagos',
    path: 'ordenes-de-pago',
    fullpath: '/pagos/ordenes-de-pago',
  },

  pagos_gastos_y_reembolsos: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'pagos',
    path: 'gastos-y-reembolsos',
    fullpath: '/pagos/gastos-y-reembolsos',
  },

  pagos_facturas: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'pagos',
    path: 'facturas',
    fullpath: '/pagos/facturas',
  },

  pagos_proveedores: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'pagos',
    path: 'proveedores',
    fullpath: '/pagos/proveedores',
  },

  pagos_reportes: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'pagos',
    path: 'reportes',
    fullpath: '/pagos/reportes',
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

  presupuesto_planeacion_anual: {
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

  // #region inventory-routing module

  inventarios_solicitudes: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'inventarios',
    path: 'solicitudes',
    fullpath: '/inventarios/solicitudes',
  },

  inventarios_transacciones: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'inventarios',
    path: 'transacciones',
    fullpath: '/inventarios/transacciones',
  },

  inventarios_existencias: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'inventarios',
    path: 'existencias',
    fullpath: '/inventarios/existencias',
  },

  inventarios_activo_fijo: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'inventarios',
    path: 'activo-fijo',
    fullpath: '/inventarios/activo-fijo',
  },

  inventarios_valuacion: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'inventarios',
    path: 'valuacion',
    fullpath: '/inventarios/valuacion',
  },

  inventarios_configuracion: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'inventarios',
    path: 'configuracion',
    fullpath: '/inventarios/configuracion',
  },

  inventarios_reportes: {
    permission: PERMISSIONS.NOT_REQUIRED,
    parent: 'inventarios',
    path: 'reportes',
    fullpath: '/inventarios/reportes',
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
