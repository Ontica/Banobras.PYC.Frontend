/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ROUTES } from './routes-config';

import { View } from '../common-models/common';


export const StepsViews: View[] = [
  {
    name: 'Steps.MyInbox',
    title: 'Mis tareas pendientes',
    menuTitle: 'Mis tareas pendientes',
    url: ROUTES.tareas_pendientes.fullpath,
    permission: ROUTES.tareas_pendientes.permission,
  },
  {
    name: 'Steps.ControlDesk',
    title: 'Mesa de control',
    menuTitle: 'Mesa de control',
    url: ROUTES.tareas_mesa_de_control.fullpath,
    permission: ROUTES.tareas_mesa_de_control.permission,
  },
  {
    name: 'Steps.Finished',
    title: 'Completadas',
    menuTitle: 'Completadas',
    url: ROUTES.tareas_completadas.fullpath,
    permission: ROUTES.tareas_completadas.permission,
  },
  {
    name: 'Steps.All',
    title: 'Todas',
    menuTitle: 'Todas',
    url: ROUTES.tareas_todas.fullpath,
    permission: ROUTES.tareas_todas.permission,
  },
];


export const BudgetViews: View[] = [
  {
    name: 'Budget.Requests',
    title: 'Solicitudes',
    menuTitle: 'Solicitudes',
    url: ROUTES.presupuesto_solicitudes.fullpath,
    permission: ROUTES.presupuesto_solicitudes.permission,
  },
  {
    name: 'Budget.Transactions',
    title: 'Transacciones',
    menuTitle: 'Transacciones',
    url: ROUTES.presupuesto_transacciones.fullpath,
    permission: ROUTES.presupuesto_transacciones.permission,
  },
  {
    name: 'Budget.Explorer',
    title: 'Explorador',
    menuTitle: 'Explorador',
    url: ROUTES.presupuesto_explorador.fullpath,
    permission: ROUTES.presupuesto_explorador.permission,
  },
  {
    name: 'Budget.AnnualPlanning',
    title: 'Planeación anual',
    menuTitle: 'Planeación anual',
    url: ROUTES.presupuesto_planeacion_anual.fullpath,
    permission: ROUTES.presupuesto_planeacion_anual.permission,
  },
  {
    name: 'Budget.Configuration',
    title: 'Configuración',
    menuTitle: 'Configuración',
    url: ROUTES.presupuesto_configuracion.fullpath,
    permission: ROUTES.presupuesto_configuracion.permission,
  },
  {
    name: 'Budget.Reporting',
    title: 'Reportes',
    menuTitle: 'Reportes',
    url: ROUTES.presupuesto_reportes.fullpath,
    permission: ROUTES.presupuesto_reportes.permission,
  }
];


export const CashFlowViews: View[] = [
  {
    name: 'CashFlow.Coding',
    title: 'Codificación',
    url: ROUTES.flujo_de_efectivo_codificacion.fullpath,
    permission: ROUTES.flujo_de_efectivo_codificacion.permission,
  },
  {
    name: 'CashFlow.Rules',
    title: 'Reglas',
    menuTitle: 'Reglas',
    url: ROUTES.flujo_de_efectivo_reglas.fullpath,
    permission: ROUTES.flujo_de_efectivo_reglas.permission,
  },
  {
    name: 'CashFlow.Reports',
    title: 'Reportes',
    menuTitle: 'Reportes',
    url: ROUTES.flujo_de_efectivo_reportes.fullpath,
    permission: ROUTES.flujo_de_efectivo_reportes.permission,
  },
];


export const ContractsViews: View[] = [
  {
    name: 'Contracts.Requests',
    title: 'Solicitudes',
    menuTitle: 'Solicitudes',
    url: ROUTES.contratos_solicitudes.fullpath,
    permission: ROUTES.contratos_solicitudes.permission,
  },
  {
    name: 'Contracts.Explorer',
    title: 'Explorador',
    menuTitle: 'Explorador',
    url: ROUTES.contratos_explorador.fullpath,
    permission: ROUTES.contratos_explorador.permission,
  },
  {
    name: 'Contracts.Milestones',
    title: 'Entregas',
    menuTitle: 'Entregas',
    url: ROUTES.contratos_entregas.fullpath,
    permission: ROUTES.contratos_entregas.permission,
  },
  {
    name: 'Contracts.Products',
    title: 'Productos',
    url: ROUTES.contratos_productos.fullpath,
    permission: ROUTES.contratos_productos.permission,
  },
  {
    name: 'Contracts.Suppliers',
    title: 'Proveedores',
    menuTitle: 'Proveedores',
    url: ROUTES.contratos_proveedores.fullpath,
    permission: ROUTES.contratos_proveedores.permission,
  },
  {
    name: 'Contracts.Reporting',
    title: 'Reportes',
    menuTitle: 'Reportes',
    url: ROUTES.contratos_reportes.fullpath,
    permission: ROUTES.contratos_reportes.permission,
  },
];


export const PaymentsViews: View[] = [
  {
    name: 'Payments.Requests',
    title: 'Solicitudes',
    menuTitle: 'Solicitudes',
    url: ROUTES.pagos_solicitudes.fullpath,
    permission: ROUTES.pagos_solicitudes.permission,
  },
  {
    name: 'Payments.PaymentsOrders',
    title: 'Ordenes de pago',
    url: ROUTES.pagos_ordenes_de_pago.fullpath,
    permission: ROUTES.pagos_ordenes_de_pago.permission,
  },
  {
    name: 'Payments.Payables',
    title: 'Obligaciones de pago',
    menuTitle: 'Obligaciones de pago',
    url: ROUTES.pagos_obligaciones_de_pago.fullpath,
    permission: ROUTES.pagos_obligaciones_de_pago.permission,
  },
  {
    name: 'Payments.Invoices',
    title: 'Facturas',
    menuTitle: 'Facturas',
    url: ROUTES.pagos_facturas.fullpath,
    permission: ROUTES.pagos_facturas.permission,
  },
  {
    name: 'Payments.Reporting',
    title: 'Reportes',
    menuTitle: 'Reportes',
    url: ROUTES.pagos_reportes.fullpath,
    permission: ROUTES.pagos_reportes.permission,
  },
];


export const FixedAssetsViews: View[] = [
  {
    name: 'FixedAssets.Requests',
    title: 'Solicitudes',
    menuTitle: 'Solicitudes',
    url: ROUTES.activo_fijo_solicitudes.fullpath,
    permission: ROUTES.activo_fijo_solicitudes.permission,
  },
  {
    name: 'FixedAssets.Transactions',
    title: 'Transacciones',
    menuTitle: 'Transacciones',
    url: ROUTES.activo_fijo_transacciones.fullpath,
    permission: ROUTES.activo_fijo_transacciones.permission,
  },
  {
    name: 'FixedAssets.Explorer',
    title: 'Explorador',
    menuTitle: 'Explorador',
    url: ROUTES.activo_fijo_explorador.fullpath,
    permission: ROUTES.activo_fijo_explorador.permission,
  },
  {
    name: 'FixedAssets.Valuation',
    title: 'Valuación',
    menuTitle: 'Valuación',
    url: ROUTES.activo_fijo_valuacion.fullpath,
    permission: ROUTES.activo_fijo_valuacion.permission,
  },
  {
    name: 'FixedAssets.Configuration',
    title: 'Configuración',
    menuTitle: 'Configuración',
    url: ROUTES.activo_fijo_configuracion.fullpath,
    permission: ROUTES.activo_fijo_configuracion.permission,
  },
  {
    name: 'FixedAssets.Reporting',
    title: 'Reportes',
    menuTitle: 'Reportes',
    url: ROUTES.activo_fijo_reportes.fullpath,
    permission: ROUTES.activo_fijo_reportes.permission,
  }
];


export const SystemManagementViews: View[] = [
  {
    name: 'SystemManagementViews.ControlPanel',
    title: 'Panel de control',
    url: ROUTES.administracion_panel_de_control.fullpath,
    permission: ROUTES.administracion_panel_de_control.permission,
  },
  {
    name: 'SystemManagementViews.AccessControl',
    title: 'Control de accesos',
    url: ROUTES.administracion_control_de_accesos.fullpath,
    permission: ROUTES.administracion_control_de_accesos.permission,
  },
];


export const UnauthorizedViews: View[] = [
  {
    name: 'Unauthorized',
    title: '',
    url: ROUTES.unauthorized.fullpath,
  },
];
