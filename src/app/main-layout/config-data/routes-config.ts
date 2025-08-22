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
    permission: PERMISSIONS.MODULE_TAREAS,
    parent: '',
    path: 'tareas',
    fullpath: '/tareas',
  },

  adquisiciones: {
    permission: PERMISSIONS.MODULE_ADQUISICIONES,
    parent: '',
    path: 'adquisiciones',
    fullpath: '/adquisiciones',
  },

  pagos: {
    permission: PERMISSIONS.MODULE_PAGOS,
    parent: '',
    path: 'pagos',
    fullpath: '/pagos',
  },

  presupuesto: {
    permission: PERMISSIONS.MODULE_PRESUPUESTO,
    parent: '',
    path: 'presupuesto',
    fullpath: '/presupuesto',
  },

  inventarios: {
    permission: PERMISSIONS.MODULE_INVENTARIOS,
    parent: '',
    path: 'inventarios',
    fullpath: '/inventarios',
  },

  flujo_de_efectivo: {
    permission: PERMISSIONS.MODULE_FLUJO_DE_EFECTIVO,
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
    permission: PERMISSIONS.ROUTE_TAREAS_PENDIENTES,
    parent: 'tareas',
    path: 'pendientes',
    fullpath: '/tareas/pendientes',
  },
  tareas_mesa_de_control: {
    permission: PERMISSIONS.ROUTE_TAREAS_MESA_DE_CONTROL,
    parent: 'tareas',
    path: 'mesa-de-control',
    fullpath: '/tareas/mesa-de-control',
  },
  tareas_completadas: {
    permission: PERMISSIONS.ROUTE_TAREAS_COMPLETADAS,
    parent: 'tareas',
    path: 'completadas',
    fullpath: '/tareas/completadas',
  },
  tareas_todas: {
    permission: PERMISSIONS.ROUTE_TAREAS_TODAS,
    parent: 'tareas',
    path: 'todas',
    fullpath: '/tareas/todas',
  },

  // #endregion

  // #region procurement-routing module

  adquisiciones_solicitudes: {
    permission: PERMISSIONS.ROUTE_ADQUISICIONES_SOLICITUDES,
    parent: 'adquisiciones',
    path: 'solicitudes',
    fullpath: '/adquisiciones/solicitudes',
  },

  adquisiciones_contratos: {
    permission: PERMISSIONS.ROUTE_ADQUISICIONES_CONTRATOS,
    parent: 'adquisiciones',
    path: 'contratos',
    fullpath: '/adquisiciones/contratos',
  },

  adquisiciones_compras_menores: {
    permission: PERMISSIONS.ROUTE_ADQUISICIONES_COMPRAS_MENORES,
    parent: 'adquisiciones',
    path: 'compras-menores',
    fullpath: '/adquisiciones/compras-menores',
  },

  adquisiciones_entregas: {
    permission: PERMISSIONS.ROUTE_ADQUISICIONES_ENTREGAS,
    parent: 'adquisiciones',
    path: 'entregas',
    fullpath: '/adquisiciones/entregas',
  },

  adquisiciones_productos: {
    permission: PERMISSIONS.ROUTE_ADQUISICIONES_PRODUCTOS,
    parent: 'adquisiciones',
    path: 'productos',
    fullpath: '/adquisiciones/productos',
  },

  adquisiciones_reportes: {
    permission: PERMISSIONS.ROUTE_ADQUISICIONES_REPORTES,
    parent: 'adquisiciones',
    path: 'reportes',
    fullpath: '/adquisiciones/reportes',
  },

  //#endregion

  // #region payments-routing module

  pagos_solicitudes: {
    permission: PERMISSIONS.ROUTE_PAGOS_SOLICITUDES,
    parent: 'pagos',
    path: 'solicitudes',
    fullpath: '/pagos/solicitudes',
  },

  pagos_obligaciones_de_pago: {
    permission: PERMISSIONS.ROUTE_PAGOS_OBLIGACIONES_DE_PAGO,
    parent: 'pagos',
    path: 'obligaciones-de-pago',
    fullpath: '/pagos/obligaciones-de-pago',
  },

  pagos_ordenes_de_pago: {
    permission: PERMISSIONS.ROUTE_PAGOS_ORDENES_DE_PAGO,
    parent: 'pagos',
    path: 'ordenes-de-pago',
    fullpath: '/pagos/ordenes-de-pago',
  },

  pagos_gastos_y_reembolsos: {
    permission: PERMISSIONS.ROUTE_PAGOS_GASTOS_Y_REEMBOLSOS,
    parent: 'pagos',
    path: 'gastos-y-reembolsos',
    fullpath: '/pagos/gastos-y-reembolsos',
  },

  pagos_facturas: {
    permission: PERMISSIONS.ROUTE_PAGOS_FACTURAS,
    parent: 'pagos',
    path: 'facturas',
    fullpath: '/pagos/facturas',
  },

  pagos_proveedores: {
    permission: PERMISSIONS.ROUTE_PAGOS_PROVEEDORES,
    parent: 'pagos',
    path: 'proveedores',
    fullpath: '/pagos/proveedores',
  },

  pagos_reportes: {
    permission: PERMISSIONS.ROUTE_PAGOS_REPORTES,
    parent: 'pagos',
    path: 'reportes',
    fullpath: '/pagos/reportes',
  },

  // #endregion

  // #region budget-routing module

  presupuesto_solicitudes: {
    permission: PERMISSIONS.ROUTE_PRESUPUESTO_SOLICITUDES,
    parent: 'presupuesto',
    path: 'solicitudes',
    fullpath: '/presupuesto/solicitudes',
  },

  presupuesto_transacciones: {
    permission: PERMISSIONS.ROUTE_PRESUPUESTO_TRANSACCIONES,
    parent: 'presupuesto',
    path: 'transacciones',
    fullpath: '/presupuesto/transacciones',
  },

  presupuesto_explorador: {
    permission: PERMISSIONS.ROUTE_PRESUPUESTO_EXPLORADOR,
    parent: 'presupuesto',
    path: 'explorador',
    fullpath: '/presupuesto/explorador',
  },

  presupuesto_configuracion: {
    permission: PERMISSIONS.ROUTE_PRESUPUESTO_CONFIGURACION,
    parent: 'presupuesto',
    path: 'configuracion',
    fullpath: '/presupuesto/configuracion',
  },

  presupuesto_reportes: {
    permission: PERMISSIONS.ROUTE_PRESUPUESTO_REPORTES,
    parent: 'presupuesto',
    path: 'reportes',
    fullpath: '/presupuesto/reportes',
  },

  // #endregion

  // #region inventory-routing module

  inventarios_solicitudes: {
    permission: PERMISSIONS.ROUTE_INVENTARIOS_SOLICITUDES,
    parent: 'inventarios',
    path: 'solicitudes',
    fullpath: '/inventarios/solicitudes',
  },

  inventarios_resguardos: {
    permission: PERMISSIONS.ROUTE_INVENTARIOS_RESGUARDOS,
    parent: 'inventarios',
    path: 'resguardos',
    fullpath: '/inventarios/resguardos',
  },

  inventarios_activo_fijo: {
    permission: PERMISSIONS.ROUTE_INVENTARIOS_ACTIVO_FIJO,
    parent: 'inventarios',
    path: 'activo-fijo',
    fullpath: '/inventarios/activo-fijo',
  },

  inventarios_transacciones: {
    permission: PERMISSIONS.ROUTE_INVENTARIOS_TRANSACCIONES,
    parent: 'inventarios',
    path: 'transacciones',
    fullpath: '/inventarios/transacciones',
  },

  inventarios_reportes: {
    permission: PERMISSIONS.ROUTE_INVENTARIOS_REPORTES,
    parent: 'inventarios',
    path: 'reportes',
    fullpath: '/inventarios/reportes',
  },

  // #endregion

  // #region cashflow-routing module

  flujo_de_efectivo_proyecciones: {
    permission: PERMISSIONS.ROUTE_FLUJO_DE_EFECTIVO_PROYECCIONES,
    parent: 'flujo-de-efectivo',
    path: 'proyecciones',
    fullpath: '/flujo-de-efectivo/proyecciones',
  },

  flujo_de_efectivo_explorer: {
    permission: PERMISSIONS.ROUTE_FLUJO_DE_EXPLORER,
    parent: 'flujo-de-efectivo',
    path: 'explorer',
    fullpath: '/flujo-de-efectivo/explorer',
  },

  flujo_de_efectivo_codificacion: {
    permission: PERMISSIONS.ROUTE_FLUJO_DE_EFECTIVO_CODIFICACION,
    parent: 'flujo-de-efectivo',
    path: 'codificacion',
    fullpath: '/flujo-de-efectivo/codificacion',
  },

  flujo_de_efectivo_proyectos: {
    permission: PERMISSIONS.ROUTE_FLUJO_DE_EFECTIVO_PROYECTOS,
    parent: 'flujo-de-efectivo',
    path: 'proyectos',
    fullpath: '/flujo-de-efectivo/proyectos',
  },

  flujo_de_efectivo_cuentas_estandar: {
    permission: PERMISSIONS.ROUTE_FLUJO_DE_EFECTIVO_CUENTAS_ESTANDAR,
    parent: 'flujo-de-efectivo',
    path: 'cuentas-estandar',
    fullpath: '/flujo-de-efectivo/cuentas-estandar',
  },

  flujo_de_efectivo_cuentas: {
    permission: PERMISSIONS.ROUTE_FLUJO_DE_EFECTIVO_CUENTAS,
    parent: 'flujo-de-efectivo',
    path: 'cuentas',
    fullpath: '/flujo-de-efectivo/cuentas',
  },

  flujo_de_efectivo_reportes: {
    permission: PERMISSIONS.ROUTE_FLUJO_DE_EFECTIVO_REPORTES,
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

  administracion_areas: {
    permission: PERMISSIONS.ROUTE_AREAS,
    parent: 'administracion',
    path: 'areas',
    fullpath: '/administracion/areas',
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
