/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


export enum PERMISSIONS {

  //
  // DEFAULT
  //

  NOT_REQUIRED = 'permission-not-required',

  //
  // TAREAS
  //
  MODULE_TAREAS = 'module-tareas',

  ROUTE_TAREAS_PENDIENTES = 'route-tareas-pendientes',
  ROUTE_TAREAS_MESA_DE_CONTROL = 'route-tareas-mesa-de-control',
  ROUTE_TAREAS_COMPLETADAS = 'route-tareas-completadas',
  ROUTE_TAREAS_TODAS = 'route-tareas-todas',

  //
  // GASTOS
  //
  MODULE_GASTOS = 'module-gastos',

  ROUTE_GASTOS_SOLICITUDES = 'route-gastos-solicitudes',
  ROUTE_GASTOS_CONTRATOS = 'route-gastos-contratos',
  ROUTE_GASTOS_ENTREGAS = 'route-gastos-entregas',
  ROUTE_GASTOS_COMPRAS_MENORES = 'route-gastos-compras-menores',
  ROUTE_GASTOS_GASTOS_Y_REEMBOLSOS = 'route-gastos-gastos-y-reembolsos',
  ROUTE_GASTOS_SOLICITUDES_DE_PAGO = 'route-gastos-solicitudes-de-pago',
  ROUTE_GASTOS_PROVISIONES = 'route-gastos-provisiones',
  ROUTE_GASTOS_SOLICITUDES_PRESUPUESTALES = 'route-gastos-solicitudes-presupuestales',
  ROUTE_GASTOS_REPORTES = 'route-gastos-reportes',

  //
  // PAGOS
  //
  MODULE_PAGOS = 'module-pagos',

  ROUTE_PAGOS_SOLICITUDES = 'route-pagos-solicitudes',
  ROUTE_PAGOS_SOLICITUDES_DE_PAGO = 'route-pagos-solicitudes-de-pago',
  ROUTE_PAGOS_ORDENES_DE_PAGO = 'route-pagos-ordenes-de-pago',
  ROUTE_PAGOS_EXPLORADOR = 'route-pagos-explorador',
  ROUTE_PAGOS_FACTURAS = 'route-pagos-facturas',
  ROUTE_PAGOS_PROVEEDORES = 'route-pagos-proveedores',
  ROUTE_PAGOS_REPORTES = 'route-pagos-reportes',

  //
  // PRESUPUESTO
  //
  MODULE_PRESUPUESTO = 'module-presupuesto',

  ROUTE_PRESUPUESTO_SOLICITUDES = 'route-presupuesto-solicitudes',
  ROUTE_PRESUPUESTO_SUFICIENCIAS = 'route-presupuesto-suficiencias',
  ROUTE_PRESUPUESTO_SOLICITUDES_DE_PAGO = 'route-presupuesto-solicitudes-de-pago',
  ROUTE_PRESUPUESTO_PROVISIONES = 'route-presupuesto-provisiones',
  ROUTE_PRESUPUESTO_EJERCICIO = 'route-presupuesto-ejercicio',
  ROUTE_PRESUPUESTO_TRANSACCIONES = 'route-presupuesto-transacciones',
  ROUTE_PRESUPUESTO_EXPLORADOR = 'route-presupuesto-explorador',
  ROUTE_PRESUPUESTO_REPORTES = 'route-presupuesto-reportes',

  FEATURE_EDICION_TRANSACCIONES_PRESUPUESTALES = 'feature-edicion-transacciones-presupuestales',
  FEATURE_IMPORTACION_TRANSACCIONES_PRESUPUESTALES = 'feature-importacion-transacciones-presupuestales',

  //
  // PROGRAMA FINANCIERO
  //
  MODULE_PROGRAMA_FINANCIERO = 'module-programa-financiero',

  ROUTE_PROGRAMA_FINANCIERO_PROYECCIONES = 'route-programa-financiero-proyecciones',
  ROUTE_PROGRAMA_FINANCIERO_EXPLORER = 'route-programa-financiero-explorer',
  ROUTE_PROGRAMA_FINANCIERO_CODIFICACION = 'route-programa-financiero-codificacion',
  ROUTE_PROGRAMA_FINANCIERO_PROYECTOS = 'route-programa-financiero-proyectos',
  ROUTE_PROGRAMA_FINANCIERO_CUENTAS = 'route-programa-financiero-cuentas',
  ROUTE_PROGRAMA_FINANCIERO_REPORTES = 'route-programa-financiero-reportes',

  //
  // INVENTARIOS
  //
  MODULE_INVENTARIOS = 'module-inventarios',

  ROUTE_INVENTARIOS_SOLICITUDES = 'route-inventarios-solicitudes',
  ROUTE_INVENTARIOS_RESGUARDOS = 'route-inventarios-resguardos',
  ROUTE_INVENTARIOS_ACTIVO_FIJO = 'route-inventarios-activo-fijo',
  ROUTE_INVENTARIOS_TRANSACCIONES = 'route-inventarios-transacciones',
  ROUTE_INVENTARIOS_REPORTES = 'route-inventarios-reportes',

  //
  // REGLAS Y CATALOGOS
  //
  MODULE_REGLAS_Y_CATALOGOS = 'module-reglas-y-catalogos',

  ROUTE_CATALOGOS_DE_CUENTAS = 'route-catalogos-de-cuentas',
  ROUTE_AGRUPACIONES = 'route-agrupaciones',
  ROUTE_REGLAS_CONTABLES = 'route-reglas-contables',
  ROUTE_PRODUCTOS = 'route-productos',

  //
  // ADMINISTRACION
  //
  MODULE_ADMINISTRACION_DE_SISTEMA = 'module-administracion-de-sistema',

  // PANEL DE CONTROL
  ROUTE_PANEL_CONTROL = 'route-panel-control',
  FEATURE_CAMBIAR_PASSWORD = 'feature-modificar-password',
  FEATURE_BITACORAS_OPERACION = 'feature-bitacoras-operacion',
  FEATURE_PERIODOS_DE_PLANEACION_PRESUPUESTAL = 'feature-periodos-de-planeacion-presupuestal',
  FEATURE_NOMINAS_INTEGRACION_SIAL = 'feature-nominas-integracion-sial',

  // CONTROL DE ACCESOS
  ROUTE_CONTROL_DE_ACCESOS = 'route-control-de-accesos',
  FEATURE_EDICION_CONTROL_DE_ACCESOS = 'feature-edicion-control-de-accesos',

  // AREAS
  ROUTE_AREAS = 'route-areas',
}


export const PERMISSION_NOT_REQUIRED = PERMISSIONS.NOT_REQUIRED;


export function getAllPermissions() {
  return Object.keys(PERMISSIONS)
               .map(key => PERMISSIONS[key]);
}
