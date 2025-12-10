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
  //   url: ROUTES.gastos_solicitudes.fullpath,
  //   permission: ROUTES.gastos_solicitudes.permission,
  // },
  {
    name: 'Procurement.Requisitions',
    title: 'Requisiciones',
    menuTitle: 'Requisiciones',
    url: ROUTES.gastos_requisiciones.fullpath,
    permission: ROUTES.gastos_requisiciones.permission,
  },
  {
    name: 'Procurement.Contracts',
    title: 'Contratos',
    menuTitle: 'Contratos',
    url: ROUTES.gastos_contratos.fullpath,
    permission: ROUTES.gastos_contratos.permission,
  },
  {
    name: 'Procurement.ContractOrders',
    title: 'Entregas',
    menuTitle: 'Entregas',
    url: ROUTES.gastos_entregas.fullpath,
    permission: ROUTES.gastos_entregas.permission,
  },
  {
    name: 'Procurement.Purchases',
    title: 'Compras menores',
    menuTitle: 'Compras menores',
    url: ROUTES.gastos_compras_menores.fullpath,
    permission: ROUTES.gastos_compras_menores.permission,
  },
  {
    name: 'Procurement.Expenses',
    title: 'Gastos y reembolsos',
    menuTitle: 'Gastos y reembolsos',
    url: ROUTES.gastos_gastos_y_reembolsos.fullpath,
    permission: ROUTES.gastos_gastos_y_reembolsos.permission,
  },
  {
    name: 'Procurement.Payables',
    title: 'Solicitudes de pago',
    menuTitle: 'Solicitudes de pago',
    url: ROUTES.gastos_solicitudes_de_pago.fullpath,
    permission: ROUTES.gastos_solicitudes_de_pago.permission,
  },
  {
    name: 'Procurement.Provisions',
    title: 'Provisiones',
    menuTitle: 'Provisiones',
    url: ROUTES.gastos_provisiones.fullpath,
    permission: ROUTES.gastos_provisiones.permission,
  },
  {
    name: 'Procurement.BudgetTransactions',
    title: 'Solicitudes presupuestales',
    menuTitle: 'Solicitudes presupuestales',
    url: ROUTES.gastos_solicitudes_presupuestales.fullpath,
    permission: ROUTES.gastos_solicitudes_presupuestales.permission,
  },
  {
    name: 'Procurement.Reporting',
    title: 'Reportes',
    menuTitle: 'Reportes',
    url: ROUTES.gastos_reportes.fullpath,
    permission: ROUTES.gastos_reportes.permission,
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
    title: 'Solicitudes de pago',
    menuTitle: 'Solicitudes de pago',
    url: ROUTES.pagos_solicitudes_de_pago.fullpath,
    permission: ROUTES.pagos_solicitudes_de_pago.permission,
  },
  {
    name: 'Payments.PaymentsOrders',
    title: 'Instrucciones de pago',
    menuTitle: 'Instrucciones de pago',
    url: ROUTES.pagos_instrucciones_de_pago.fullpath,
    permission: ROUTES.pagos_instrucciones_de_pago.permission,
  },
  {
    name: 'Payments.Explorer',
    title: 'Explorador',
    menuTitle: 'Explorador',
    url: ROUTES.pagos_explorador.fullpath,
    permission: ROUTES.pagos_explorador.permission,
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
    name: 'Budget.ControlDesk',
    title: 'Mesa de control',
    menuTitle: 'Mesa de control',
    url: ROUTES.presupuesto_mesa_de_control.fullpath,
    permission: ROUTES.presupuesto_mesa_de_control.permission,
  },
  {
    name: 'Budget.Payables',
    title: 'Solicitudes de pago',
    menuTitle: 'Solicitudes de pago',
    url: ROUTES.presupuesto_solicitudes_de_pago.fullpath,
    permission: ROUTES.presupuesto_solicitudes_de_pago.permission,
  },
  {
    name: 'Budget.Availability',
    title: 'Suficiencias',
    menuTitle: 'Suficiencias',
    url: ROUTES.presupuesto_suficiencias.fullpath,
    permission: ROUTES.presupuesto_suficiencias.permission,
  },
  {
    name: 'Budget.Provisions',
    title: 'Provisiones',
    menuTitle: 'Provisiones',
    url: ROUTES.presupuesto_provisiones.fullpath,
    permission: ROUTES.presupuesto_provisiones.permission,
  },
  {
    name: 'Budget.Exercise',
    title: 'Ejercicio',
    menuTitle: 'Ejercicio',
    url: ROUTES.presupuesto_ejercicio.fullpath,
    permission: ROUTES.presupuesto_ejercicio.permission,
  },
  {
    name: 'Budget.Explorer',
    title: 'Explorador',
    menuTitle: 'Explorador',
    url: ROUTES.presupuesto_explorador.fullpath,
    permission: ROUTES.presupuesto_explorador.permission,
  },
  {
    name: 'Budget.Reporting',
    title: 'Reportes',
    menuTitle: 'Reportes',
    url: ROUTES.presupuesto_reportes.fullpath,
    permission: ROUTES.presupuesto_reportes.permission,
  }
];


export const FinancialProgramViews: View[] = [
  {
    name: 'FinancialProgram.Projections',
    title: 'Proyección',
    menuTitle: 'Proyección',
    url: ROUTES.programa_financiero_proyecciones.fullpath,
    permission: ROUTES.programa_financiero_proyecciones.permission,
  },
  {
    name: 'FinancialProgram.CashFlow',
    title: 'Flujo de efectivo',
    menuTitle: 'Flujo de efectivo',
    url: ROUTES.programa_financiero_explorer.fullpath,
    permission: ROUTES.programa_financiero_explorer.permission,
  },
  {
    name: 'FinancialProgram.Codify',
    title: 'Codificación',
    menuTitle: 'Codificación',
    url: ROUTES.programa_financiero_codificacion.fullpath,
    permission: ROUTES.programa_financiero_codificacion.permission,
  },
  {
    name: 'FinancialProgram.Projects',
    title: 'Proyectos',
    menuTitle: 'Proyectos',
    url: ROUTES.programa_financiero_proyectos.fullpath,
    permission: ROUTES.programa_financiero_proyectos.permission,
  },
  {
    name: 'FinancialProgram.Accounts',
    title: 'Cuentas',
    menuTitle: 'Cuentas',
    url: ROUTES.programa_financiero_cuentas.fullpath,
    permission: ROUTES.programa_financiero_cuentas.permission,
  },
  {
    name: 'FinancialProgram.Reports',
    title: 'Reportes operativos',
    menuTitle: 'Reportes operativos',
    url: ROUTES.programa_financiero_reportes.fullpath,
    permission: ROUTES.programa_financiero_reportes.permission,
  },
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
    name: 'Inventory.Assignments',
    title: 'Resguardos',
    menuTitle: 'Resguardos',
    url: ROUTES.inventarios_resguardos.fullpath,
    permission: ROUTES.inventarios_resguardos.permission,
  },
  {
    name: 'Inventory.Assets',
    title: 'Activo fijo',
    menuTitle: 'Activo fijo',
    url: ROUTES.inventarios_activo_fijo.fullpath,
    permission: ROUTES.inventarios_activo_fijo.permission,
  },
  {
    name: 'Inventory.Transactions',
    title: 'Transacciones',
    menuTitle: 'Transacciones',
    url: ROUTES.inventarios_transacciones.fullpath,
    permission: ROUTES.inventarios_transacciones.permission,
  },
  {
    name: 'Inventory.Reporting',
    title: 'Reportes',
    menuTitle: 'Reportes',
    url: ROUTES.inventarios_reportes.fullpath,
    permission: ROUTES.inventarios_reportes.permission,
  }
];


export const CataloguesAndRulesViews: View[] = [
  {
    name: 'CataloguesAndRulesViews.AccountsChart',
    title: 'Catálogos de cuentas',
    menuTitle: 'Catálogos de cuentas',
    url: ROUTES.reglas_y_catalogos_catalogos_de_cuentas.fullpath,
    permission: ROUTES.reglas_y_catalogos_catalogos_de_cuentas.permission,
  },
  {
    name: 'CataloguesAndRulesViews.AccountsGroups',
    title: 'Agrupaciones',
    menuTitle: 'Agrupaciones',
    url: ROUTES.reglas_y_catalogos_agrupaciones.fullpath,
    permission: ROUTES.reglas_y_catalogos_agrupaciones.permission,
  },
  {
    name: 'CataloguesAndRulesViews.AccountingRules',
    title: 'Reglas contables',
    menuTitle: 'Reglas contables',
    url: ROUTES.reglas_y_catalogos_reglas_contables.fullpath,
    permission: ROUTES.reglas_y_catalogos_reglas_contables.permission,
  },
  {
    name: 'Procurement.Products',
    title: 'Productos',
    menuTitle: 'Productos',
    url: ROUTES.reglas_y_catalogos_productos.fullpath,
    permission: ROUTES.reglas_y_catalogos_productos.permission,
  },
];


export const SystemManagementViews: View[] = [
  {
    name: 'SystemManagementViews.ControlPanel',
    title: 'Panel de control',
    menuTitle: 'Panel de control',
    url: ROUTES.administracion_panel_de_control.fullpath,
    permission: ROUTES.administracion_panel_de_control.permission,
  },
  {
    name: 'SystemManagementViews.OrganizationalUnits',
    title: 'Áreas',
    menuTitle: 'Áreas',
    url: ROUTES.administracion_areas.fullpath,
    permission: ROUTES.administracion_areas.permission,
  },
  {
    name: 'SystemManagementViews.AccessControl',
    title: 'Control de accesos',
    menuTitle: 'Control de accesos',
    url: ROUTES.administracion_control_de_accesos.fullpath,
    permission: ROUTES.administracion_control_de_accesos.permission,
  },
];


export const UnauthorizedViews: View[] = [
  {
    name: 'Unauthorized',
    title: '',
    menuTitle: '',
    url: ROUTES.unauthorized.fullpath,
  },
];
