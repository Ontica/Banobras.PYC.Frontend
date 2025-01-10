/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ROUTES } from './routes-config';

import { View } from '../common-models/common';


export const StepsViews: View[] = [
  // {
  //   name: 'Steps.MyInbox',
  //   title: 'Mis tareas pendientes',
  //   menuTitle: 'Mis tareas pendientes',
  //   url: ROUTES.tareas_pendientes.fullpath,
  //   permission: ROUTES.tareas_pendientes.permission,
  // },
  // {
  //   name: 'Steps.ControlDesk',
  //   title: 'Mesa de control',
  //   menuTitle: 'Mesa de control',
  //   url: ROUTES.tareas_mesa_de_control.fullpath,
  //   permission: ROUTES.tareas_mesa_de_control.permission,
  // },
  // {
  //   name: 'Steps.Finished',
  //   title: 'Completadas',
  //   menuTitle: 'Completadas',
  //   url: ROUTES.tareas_completadas.fullpath,
  //   permission: ROUTES.tareas_completadas.permission,
  // },
  // {
  //   name: 'Steps.All',
  //   title: 'Todas',
  //   menuTitle: 'Todas',
  //   url: ROUTES.tareas_todas.fullpath,
  //   permission: ROUTES.tareas_todas.permission,
  // },
];


export const ProcurementViews: View[] = [
  // {
  //   name: 'Procurement.Requests',
  //   title: 'Solicitudes',
  //   menuTitle: 'Solicitudes',
  //   url: ROUTES.adquisiciones_solicitudes.fullpath,
  //   permission: ROUTES.adquisiciones_solicitudes.permission,
  // },
  {
    name: 'Procurement.Explorer',
    title: 'Contratos',
    menuTitle: 'Contratos',
    url: ROUTES.adquisiciones_contratos.fullpath,
    permission: ROUTES.adquisiciones_contratos.permission,
  },
  {
    name: 'Procurement.MinorPurchases',
    title: 'Compras menores',
    menuTitle: 'Compras menores',
    url: ROUTES.adquisiciones_compras_menores.fullpath,
    permission: ROUTES.adquisiciones_compras_menores.permission,
  },
  {
    name: 'Procurement.ContractOrders',
    title: 'Entregas',
    menuTitle: 'Entregas',
    url: ROUTES.adquisiciones_entregas.fullpath,
    permission: ROUTES.adquisiciones_entregas.permission,
  },
  {
    name: 'Procurement.Products',
    title: 'Productos',
    url: ROUTES.adquisiciones_productos.fullpath,
    permission: ROUTES.adquisiciones_productos.permission,
  },
  {
    name: 'Procurement.Reporting',
    title: 'Reportes',
    menuTitle: 'Reportes',
    url: ROUTES.adquisiciones_reportes.fullpath,
    permission: ROUTES.adquisiciones_reportes.permission,
  },
];


export const PaymentsViews: View[] = [
  // {
  //   name: 'Payments.Requests',
  //   title: 'Solicitudes',
  //   menuTitle: 'Solicitudes',
  //   url: ROUTES.pagos_solicitudes.fullpath,
  //   permission: ROUTES.pagos_solicitudes.permission,
  // },
  {
    name: 'Payments.Payables',
    title: 'Obligaciones de pago',
    menuTitle: 'Obligaciones de pago',
    url: ROUTES.pagos_obligaciones_de_pago.fullpath,
    permission: ROUTES.pagos_obligaciones_de_pago.permission,
  },
  {
    name: 'Payments.PaymentsOrders',
    title: 'Ordenes de pago',
    url: ROUTES.pagos_ordenes_de_pago.fullpath,
    permission: ROUTES.pagos_ordenes_de_pago.permission,
  },
  {
    name: 'Payments.ExpensesAndReimbursement',
    title: 'Gastos y reembolsos ',
    url: ROUTES.pagos_gastos_y_reembolsos.fullpath,
    permission: ROUTES.pagos_gastos_y_reembolsos.permission,
  },
  {
    name: 'Payments.Invoices',
    title: 'Facturas',
    menuTitle: 'Facturas',
    url: ROUTES.pagos_facturas.fullpath,
    permission: ROUTES.pagos_facturas.permission,
  },
  {
    name: 'Payments.Suppliers',
    title: 'Proveedores',
    menuTitle: 'Proveedores',
    url: ROUTES.pagos_proveedores.fullpath,
    permission: ROUTES.pagos_proveedores.permission,
  },
  {
    name: 'Payments.Reporting',
    title: 'Reportes',
    menuTitle: 'Reportes',
    url: ROUTES.pagos_reportes.fullpath,
    permission: ROUTES.pagos_reportes.permission,
  },
];


export const BudgetViews: View[] = [
  // {
  //   name: 'Budget.Requests',
  //   title: 'Solicitudes',
  //   menuTitle: 'Solicitudes',
  //   url: ROUTES.presupuesto_solicitudes.fullpath,
  //   permission: ROUTES.presupuesto_solicitudes.permission,
  // },
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


export const InventoryViews: View[] = [
  // {
  //   name: 'Inventory.Requests',
  //   title: 'Solicitudes',
  //   menuTitle: 'Solicitudes',
  //   url: ROUTES.inventarios_solicitudes.fullpath,
  //   permission: ROUTES.inventarios_solicitudes.permission,
  // },
  {
    name: 'Inventory.Transactions',
    title: 'Transacciones',
    menuTitle: 'Transacciones',
    url: ROUTES.inventarios_transacciones.fullpath,
    permission: ROUTES.inventarios_transacciones.permission,
  },
  {
    name: 'Inventory.Stock',
    title: 'Existencias',
    menuTitle: 'Existencias',
    url: ROUTES.inventarios_existencias.fullpath,
    permission: ROUTES.inventarios_existencias.permission,
  },
  {
    name: 'Inventory.Explorer',
    title: 'Activo fijo',
    menuTitle: 'Activo fijo',
    url: ROUTES.inventarios_activo_fijo.fullpath,
    permission: ROUTES.inventarios_activo_fijo.permission,
  },
  {
    name: 'Inventory.Valuation',
    title: 'Valuación',
    menuTitle: 'Valuación',
    url: ROUTES.inventarios_valuacion.fullpath,
    permission: ROUTES.inventarios_valuacion.permission,
  },
  {
    name: 'Inventory.Configuration',
    title: 'Configuración',
    menuTitle: 'Configuración',
    url: ROUTES.inventarios_configuracion.fullpath,
    permission: ROUTES.inventarios_configuracion.permission,
  },
  {
    name: 'Inventory.Reporting',
    title: 'Reportes',
    menuTitle: 'Reportes',
    url: ROUTES.inventarios_reportes.fullpath,
    permission: ROUTES.inventarios_reportes.permission,
  }
];


export const CashFlowViews: View[] = [
  // {
  //   name: 'CashFlow.Coding',
  //   title: 'Codificación',
  //   url: ROUTES.flujo_de_efectivo_codificacion.fullpath,
  //   permission: ROUTES.flujo_de_efectivo_codificacion.permission,
  // },
  // {
  //   name: 'CashFlow.Rules',
  //   title: 'Reglas',
  //   menuTitle: 'Reglas',
  //   url: ROUTES.flujo_de_efectivo_reglas.fullpath,
  //   permission: ROUTES.flujo_de_efectivo_reglas.permission,
  // },
  // {
  //   name: 'CashFlow.Reports',
  //   title: 'Reportes',
  //   menuTitle: 'Reportes',
  //   url: ROUTES.flujo_de_efectivo_reportes.fullpath,
  //   permission: ROUTES.flujo_de_efectivo_reportes.permission,
  // },
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
