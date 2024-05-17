/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ROUTES } from '../config-data';

import { View, Layout } from '../common-models/common';

import {
  BudgetViews,
  CataloguesAndRulesViews,
  PaymentsViews,
  CashFlowViews,
  SystemManagementViews,
  UnauthorizedViews,
} from './views-config';


export const APP_VIEWS: View[] = UnauthorizedViews.concat(SystemManagementViews,
                                                          BudgetViews,
                                                          CataloguesAndRulesViews,
                                                          PaymentsViews,
                                                          CashFlowViews);


export const APP_LAYOUTS: Layout[] = [
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
