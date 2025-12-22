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

  gastos: {
    permission: PERMISSIONS.MODULE_GASTOS,
    parent: '',
    path: 'gestion-del-gasto',
    fullpath: '/gestion-del-gasto',
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

  programa_financiero: {
    permission: PERMISSIONS.MODULE_PROGRAMA_FINANCIERO,
    parent: '',
    path: 'programa-financiero',
    fullpath: '/programa-financiero',
  },

  inventarios: {
    permission: PERMISSIONS.MODULE_INVENTARIOS,
    parent: '',
    path: 'inventarios',
    fullpath: '/inventarios',
  },

  reglas_y_catalogos: {
    permission: PERMISSIONS.MODULE_REGLAS_Y_CATALOGOS,
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

  gastos_solicitudes: {
    permission: PERMISSIONS.ROUTE_GASTOS_SOLICITUDES,
    parent: 'gestion-del-gasto',
    path: 'solicitudes',
    fullpath: '/gestion-del-gasto/solicitudes',
  },

  gastos_requisiciones: {
    permission: PERMISSIONS.ROUTE_GASTOS_REQUISICIONES,
    parent: 'gestion-del-gasto',
    path: 'requisiciones',
    fullpath: '/gestion-del-gasto/requisiciones',
  },

  gastos_contratos: {
    permission: PERMISSIONS.ROUTE_GASTOS_CONTRATOS,
    parent: 'gestion-del-gasto',
    path: 'contratos',
    fullpath: '/gestion-del-gasto/contratos',
  },

  gastos_entregas: {
    permission: PERMISSIONS.ROUTE_GASTOS_ENTREGAS,
    parent: 'gestion-del-gasto',
    path: 'entregas',
    fullpath: '/gestion-del-gasto/entregas',
  },

  gastos_compras_menores: {
    permission: PERMISSIONS.ROUTE_GASTOS_COMPRAS_MENORES,
    parent: 'gestion-del-gasto',
    path: 'compras-menores',
    fullpath: '/gestion-del-gasto/compras-menores',
  },

  gastos_gastos_y_reembolsos: {
    permission: PERMISSIONS.ROUTE_GASTOS_GASTOS_Y_REEMBOLSOS,
    parent: 'gestion-del-gasto',
    path: 'gastos-y-reembolsos',
    fullpath: '/gestion-del-gasto/gastos-y-reembolsos',
  },

  gastos_solicitudes_de_pago: {
    permission: PERMISSIONS.ROUTE_GASTOS_SOLICITUDES_DE_PAGO,
    parent: 'gestion-del-gasto',
    path: 'solicitudes-de-pago',
    fullpath: '/gestion-del-gasto/solicitudes-de-pago',
  },

  gastos_provisiones: {
    permission: PERMISSIONS.ROUTE_GASTOS_PROVISIONES,
    parent: 'gestion-del-gasto',
    path: 'provisiones',
    fullpath: '/gestion-del-gasto/provisiones',
  },

  gastos_solicitudes_presupuestales: {
    permission: PERMISSIONS.ROUTE_GASTOS_SOLICITUDES_PRESUPUESTALES,
    parent: 'gestion-del-gasto',
    path: 'solicitudes-presupuestales',
    fullpath: '/gestion-del-gasto/solicitudes-presupuestales',
  },

  gastos_reportes: {
    permission: PERMISSIONS.ROUTE_GASTOS_REPORTES,
    parent: 'gestion-del-gasto',
    path: 'reportes',
    fullpath: '/gestion-del-gasto/reportes',
  },

  //#endregion

  // #region payments-routing module

  pagos_solicitudes: {
    permission: PERMISSIONS.ROUTE_PAGOS_SOLICITUDES,
    parent: 'pagos',
    path: 'solicitudes',
    fullpath: '/pagos/solicitudes',
  },

  pagos_solicitudes_de_pago: {
    permission: PERMISSIONS.ROUTE_PAGOS_SOLICITUDES_DE_PAGO,
    parent: 'pagos',
    path: 'solicitudes-de-pago',
    fullpath: '/pagos/solicitudes-de-pago',
  },

  pagos_instrucciones_de_pago: {
    permission: PERMISSIONS.ROUTE_PAGOS_INSTRUCCIONES_DE_PAGO,
    parent: 'pagos',
    path: 'instrucciones-de-pago',
    fullpath: '/pagos/instrucciones-de-pago',
  },

  pagos_explorador: {
    permission: PERMISSIONS.ROUTE_PAGOS_EXPLORADOR,
    parent: 'pagos',
    path: 'explorador',
    fullpath: '/pagos/explorador',
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


  presupuesto_solicitudes_de_pago: {
    permission: PERMISSIONS.ROUTE_PRESUPUESTO_SOLICITUDES_DE_PAGO,
    parent: 'presupuesto',
    path: 'solicitudes-de-pago',
    fullpath: '/presupuesto/solicitudes-de-pago',
  },

  presupuesto_mesa_de_control: {
    permission: PERMISSIONS.ROUTE_PRESUPUESTO_MESA_DE_CONTROL,
    parent: 'presupuesto',
    path: 'mesa-de-control',
    fullpath: '/presupuesto/mesa-de-control',
  },

  presupuesto_transacciones: {
    permission: PERMISSIONS.ROUTE_PRESUPUESTO_TRANSACCIONES,
    parent: 'presupuesto',
    path: 'transacciones',
    fullpath: '/presupuesto/transacciones',
  },

  presupuesto_suficiencias: {
    permission: PERMISSIONS.ROUTE_PRESUPUESTO_SUFICIENCIAS,
    parent: 'presupuesto',
    path: 'suficiencias',
    fullpath: '/presupuesto/suficiencias',
  },

  presupuesto_provisiones: {
    permission: PERMISSIONS.ROUTE_PRESUPUESTO_PROVISIONES,
    parent: 'presupuesto',
    path: 'provisiones',
    fullpath: '/presupuesto/provisiones',
  },

  presupuesto_ejercicio: {
    permission: PERMISSIONS.ROUTE_PRESUPUESTO_EJERCICIO,
    parent: 'presupuesto',
    path: 'ejercicio',
    fullpath: '/presupuesto/ejercicio',
  },

  presupuesto_explorador: {
    permission: PERMISSIONS.ROUTE_PRESUPUESTO_EXPLORADOR,
    parent: 'presupuesto',
    path: 'explorador',
    fullpath: '/presupuesto/explorador',
  },

  presupuesto_reportes: {
    permission: PERMISSIONS.ROUTE_PRESUPUESTO_REPORTES,
    parent: 'presupuesto',
    path: 'reportes',
    fullpath: '/presupuesto/reportes',
  },

  // #endregion

  // #region financial-program-routing module

  programa_financiero_proyecciones: {
    permission: PERMISSIONS.ROUTE_PROGRAMA_FINANCIERO_PROYECCIONES,
    parent: 'programa-financiero',
    path: 'proyecciones',
    fullpath: '/programa-financiero/proyecciones',
  },

  programa_financiero_explorer: {
    permission: PERMISSIONS.ROUTE_PROGRAMA_FINANCIERO_EXPLORER,
    parent: 'programa-financiero',
    path: 'explorer',
    fullpath: '/programa-financiero/explorer',
  },

  programa_financiero_codificacion: {
    permission: PERMISSIONS.ROUTE_PROGRAMA_FINANCIERO_CODIFICACION,
    parent: 'programa-financiero',
    path: 'codificacion',
    fullpath: '/programa-financiero/codificacion',
  },

  programa_financiero_proyectos: {
    permission: PERMISSIONS.ROUTE_PROGRAMA_FINANCIERO_PROYECTOS,
    parent: 'programa-financiero',
    path: 'proyectos',
    fullpath: '/programa-financiero/proyectos',
  },

  programa_financiero_cuentas: {
    permission: PERMISSIONS.ROUTE_PROGRAMA_FINANCIERO_CUENTAS,
    parent: 'programa-financiero',
    path: 'cuentas',
    fullpath: '/programa-financiero/cuentas',
  },

  programa_financiero_reportes: {
    permission: PERMISSIONS.ROUTE_PROGRAMA_FINANCIERO_REPORTES,
    parent: 'programa-financiero',
    path: 'reportes',
    fullpath: '/programa-financiero/reportes',
  },

  //#endregion

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

  // #region accounting-catalogues-and-rules-routing module

  reglas_y_catalogos_catalogos_de_cuentas: {
    permission: PERMISSIONS.ROUTE_CATALOGOS_DE_CUENTAS,
    parent: 'reglas-y-catalogos',
    path: 'catalogos-de-cuentas',
    fullpath: '/reglas-y-catalogos/catalogos-de-cuentas',
  },
  reglas_y_catalogos_agrupaciones: {
    permission: PERMISSIONS.ROUTE_AGRUPACIONES,
    parent: 'reglas-y-catalogos',
    path: 'agrupaciones',
    fullpath: '/reglas-y-catalogos/agrupaciones',
  },
  reglas_y_catalogos_reglas_contables: {
    permission: PERMISSIONS.ROUTE_REGLAS_CONTABLES,
    parent: 'reglas-y-catalogos',
    path: 'reglas-contables',
    fullpath: '/reglas-y-catalogos/reglas-contables',
  },

  reglas_y_catalogos_productos: {
    permission: PERMISSIONS.ROUTE_PRODUCTOS,
    parent: 'reglas-y-catalogos',
    path: 'productos',
    fullpath: '/reglas-y-catalogos/productos',
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
