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
  // ADQUISICIONES
  //
  MODULE_ADQUISICIONES = 'module-adquisiciones',

  ROUTE_ADQUISICIONES_SOLICITUDES = 'route-adquisiciones-solicitudes',
  ROUTE_ADQUISICIONES_CONTRATOS = 'route-adquisiciones-contratos',
  ROUTE_ADQUISICIONES_COMPRAS_MENORES = 'route-adquisiciones-compras-menores',
  ROUTE_ADQUISICIONES_ENTREGAS = 'route-adquisiciones-entregas',
  ROUTE_ADQUISICIONES_PRODUCTOS = 'route-adquisiciones-productos',
  ROUTE_ADQUISICIONES_REPORTES = 'route-adquisiciones-reportes',

  //
  // PAGOS
  //
  MODULE_PAGOS = 'module-pagos',

  ROUTE_PAGOS_SOLICITUDES = 'route-pagos-solicitudes',
  ROUTE_PAGOS_OBLIGACIONES_DE_PAGO = 'route-pagos-obligaciones-de-pago',
  ROUTE_PAGOS_ORDENES_DE_PAGO = 'route-pagos-ordenes-de-pago',
  ROUTE_PAGOS_GASTOS_Y_REEMBOLSOS = 'route-pagos-gastos-y-reembolsos',
  ROUTE_PAGOS_FACTURAS = 'route-pagos-facturas',
  ROUTE_PAGOS_PROVEEDORES = 'route-pagos-proveedores',
  ROUTE_PAGOS_REPORTES = 'route-pagos-reportes',

  //
  // PRESUPUESTO
  //
  MODULE_PRESUPUESTO = 'module-presupuesto',

  ROUTE_PRESUPUESTO_SOLICITUDES = 'route-presupuesto-solicitudes',
  ROUTE_PRESUPUESTO_TRANSACCIONES = 'route-presupuesto-transacciones',
  ROUTE_PRESUPUESTO_EXPLORADOR = 'route-presupuesto-explorador',
  ROUTE_PRESUPUESTO_CONFIGURACION = 'route-presupuesto-configuracion',
  ROUTE_PRESUPUESTO_REPORTES = 'route-presupuesto-reportes',

  FEATURE_EDICION_TRANSACCIONES_PRESUPUESTALES = 'feature-edicion-transacciones-presupuestales',
  FEATURE_IMPORTACION_TRANSACCIONES_PRESUPUESTALES = 'feature-importacion-transacciones-presupuestales',

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
  // FLUJO DE EFECTIVO
  //
  MODULE_FLUJO_DE_EFECTIVO = 'module-flujo-de-efectivo',

  ROUTE_FLUJO_DE_EFECTIVO_PROYECCIONES = 'route-flujo-de-efectivo-proyecciones',
  ROUTE_FLUJO_DE_EXPLORER = 'route-flujo-de-efectivo-explorer',
  ROUTE_FLUJO_DE_EFECTIVO_CODIFICACION = 'route-flujo-de-efectivo-codificacion',
  ROUTE_FLUJO_DE_EFECTIVO_PROYECTOS = 'route-flujo-de-efectivo-proyectos',
  ROUTE_FLUJO_DE_EFECTIVO_CUENTAS = 'route-flujo-de-efectivo-cuentas',
  ROUTE_FLUJO_DE_EFECTIVO_REPORTES = 'route-flujo-de-efectivo-reportes',

  //
  // REGLAS Y CATALOGOS
  //
  MODULE_REGLAS_Y_CATALOGOS = 'module-reglas-y-catalogos',

  ROUTE_CATALOGOS_DE_CUENTAS = 'route-catalogos-de-cuentas',
  ROUTE_AGRUPACIONES = 'route-agrupaciones',
  ROUTE_REGLAS_CONTABLES = 'route-reglas-contables',

  //
  // ADMINISTRACION
  //
  MODULE_ADMINISTRACION_DE_SISTEMA = 'module-administracion-de-sistema',

  // PANEL DE CONTROL
  ROUTE_PANEL_CONTROL = 'route-panel-control',
  FEATURE_CAMBIAR_PASSWORD = 'feature-modificar-password',
  FEATURE_BITACORAS_OPERACION = 'feature-bitacoras-operacion',
  FEATURE_PERIODOS_DE_PLANEACION_PRESUPUESTAL = 'feature-periodos-de-planeacion-presupuestal',

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
