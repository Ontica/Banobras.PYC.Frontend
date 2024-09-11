/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ROUTES } from './routes-config';

import { View } from '../common-models/common';


export const TasksViews: View[] = [
  {
    name: 'Tasks.MyInbox',
    title: 'Mis tareas pendientes',
    menuTitle: 'Mis tareas pendientes',
    url: ROUTES.tareas_pendientes.fullpath,
    permission: ROUTES.tareas_pendientes.permission,
  },
  {
    name: 'Tasks.ControlDesk',
    title: 'Mesa de control',
    menuTitle: 'Mesa de control',
    url: ROUTES.tareas_mesa_de_control.fullpath,
    permission: ROUTES.tareas_mesa_de_control.permission,
  },
  {
    name: 'Tasks.Finished',
    title: 'Completadas',
    menuTitle: 'Completadas',
    url: ROUTES.tareas_completadas.fullpath,
    permission: ROUTES.tareas_completadas.permission,
  },
  {
    name: 'Tasks.All',
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
    name: 'Budget.Control',
    title: 'Control',
    menuTitle: 'Control',
    url: ROUTES.presupuesto_control.fullpath,
    permission: ROUTES.presupuesto_control.permission,
  },
  {
    name: 'Budget.Committed',
    title: 'Comprometido',
    menuTitle: 'Comprometido',
    url: ROUTES.presupuesto_comprometido.fullpath,
    permission: ROUTES.presupuesto_comprometido.permission,
  },
  {
    name: 'Budget.Executed',
    title: 'Ejercido',
    menuTitle: 'Ejercido',
    url: ROUTES.presupuesto_ejercido.fullpath,
    permission: ROUTES.presupuesto_ejercido.permission,
  },
  {
    name: 'Budget.Planning',
    title: 'Planeación',
    url: ROUTES.presupuesto_planeacion.fullpath,
    permission: ROUTES.presupuesto_planeacion.permission,
  },
  {
    name: 'Budget.Reporting',
    title: 'Reportes',
    menuTitle: 'Reportes',
    url: ROUTES.presupuesto_reportes.fullpath,
    permission: ROUTES.presupuesto_reportes.permission,
  }
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
    name: 'Payments.Contracts',
    title: 'Contratos',
    menuTitle: 'Contratos',
    url: ROUTES.pagos_contratos.fullpath,
    permission: ROUTES.pagos_contratos.permission,
  },
  {
    name: 'Payments.Reporting',
    title: 'Reportes',
    menuTitle: 'Reportes',
    url: ROUTES.pagos_reportes.fullpath,
    permission: ROUTES.pagos_reportes.permission,
  },
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


export const CataloguesAndRulesViews: View[] = [
  {
    name: 'CataloguesAndRules.BudgetConcepts',
    title: 'Conceptos presupuestales',
    url: ROUTES.reglas_y_catalogos_conceptos_presupuestales.fullpath,
    permission: ROUTES.reglas_y_catalogos_conceptos_presupuestales.permission,
  },
  {
    name: 'CataloguesAndRules.AccountingRules',
    title: 'Reglas contabilizadoras',
    url: ROUTES.reglas_y_catalogos_reglas_contabilizadoras.fullpath,
    permission: ROUTES.reglas_y_catalogos_reglas_contabilizadoras.permission,
  },
  {
    name: 'CataloguesAndRules.ExternalVariables',
    title: 'Valores externos',
    url: ROUTES.reglas_y_catalogos_valores_externos.fullpath,
    permission: ROUTES.reglas_y_catalogos_valores_externos.permission,
  },
  {
    name: 'CataloguesAndRules.Suppliers',
    title: 'Proveedores',
    url: ROUTES.reglas_y_catalogos_proveedores.fullpath,
    permission: ROUTES.reglas_y_catalogos_proveedores.permission,
  },
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
