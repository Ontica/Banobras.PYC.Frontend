/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ROUTES } from '../config-data';

import { View, Layout } from '../common-models/common';

import {
  UnauthorizedViews,
  SystemManagementViews,
  CataloguesAndRulesViews,
  StepsViews,
  BudgetViews,
  CashFlowViews,
  PaymentsViews,
} from './views-config';


export const APP_VIEWS: View[] = UnauthorizedViews.concat(SystemManagementViews,
                                                          CataloguesAndRulesViews,
                                                          StepsViews,
                                                          BudgetViews,
                                                          CashFlowViews,
                                                          PaymentsViews);


export const APP_LAYOUTS: Layout[] = [
  {
    name: 'Steps',
    views: StepsViews,
    hint: 'Tareas',
    defaultTitle: 'Tareas',
    url: ROUTES.tareas.fullpath,
    permission: ROUTES.tareas.permission,
  },
  {
    name: 'Budget',
    views: BudgetViews,
    hint: 'Presupuesto',
    defaultTitle: 'Presupuesto',
    url: ROUTES.presupuesto.fullpath,
    permission: ROUTES.presupuesto.permission,
  },
  {
    name: 'CashFlow',
    views: CashFlowViews,
    hint: 'Flujo de efectivo',
    defaultTitle: 'Flujo de efectivo',
    url: ROUTES.flujo_de_efectivo.fullpath,
    permission: ROUTES.flujo_de_efectivo.permission,
  },
  {
    name: 'Payments',
    views: PaymentsViews,
    hint: 'Pagos',
    defaultTitle: 'Pagos',
    url: ROUTES.pagos.fullpath,
    permission: ROUTES.pagos.permission,

  },
  {
    name: 'CataloguesAndRules',
    views: CataloguesAndRulesViews,
    hint: 'Reglas y catálogos',
    defaultTitle: 'Reglas y catálogos',
    url: ROUTES.reglas_y_catalogos.fullpath,
    permission: ROUTES.reglas_y_catalogos.permission,
  },
  {
    name: 'Management',
    views: SystemManagementViews,
    hint: 'Herramientas de administración del sistema',
    defaultTitle: 'Administración',
    url: ROUTES.administracion.fullpath,
    permission: ROUTES.administracion.permission,
  },
  {
    name: 'Unauthorized',
    views: UnauthorizedViews,
    hint: '',
    defaultTitle: '401: Unauthorized',
    url: ROUTES.unauthorized.fullpath,
  },
];
