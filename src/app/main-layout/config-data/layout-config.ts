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
  FinancialProgramViews,
  ProcurementViews,
  PaymentsViews,
  InventoryViews,
} from './views-config';


export type LAYOUT_TYPE = 'Unauthorized' | 'SystemManagement' | 'CataloguesAndRules' |
                          'Steps' | 'Procurement' | 'Payments' | 'Budget' | 'Inventory' | 'FinancialProgram';


export const APP_VIEWS: View[] = UnauthorizedViews.concat(SystemManagementViews,
                                                          CataloguesAndRulesViews,
                                                          StepsViews,
                                                          BudgetViews,
                                                          FinancialProgramViews,
                                                          ProcurementViews,
                                                          PaymentsViews,
                                                          InventoryViews);


export const APP_LAYOUTS: Layout<LAYOUT_TYPE>[] = [
  // {
  //   name: 'Steps',
  //   views: StepsViews,
  //   hint: 'Tareas',
  //   defaultTitle: 'Tareas',
  //   url: ROUTES.tareas.fullpath,
  //   permission: ROUTES.tareas.permission,
  // },
  {
    name: 'Procurement',
    views: ProcurementViews,
    hint: 'Gestión del gasto',
    defaultTitle: 'Gestión del gasto',
    url: ROUTES.gastos.fullpath,
    permission: ROUTES.gastos.permission,
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
    name: 'Budget',
    views: BudgetViews,
    hint: 'Presupuesto',
    defaultTitle: 'Presupuesto',
    url: ROUTES.presupuesto.fullpath,
    permission: ROUTES.presupuesto.permission,
  },
  {
    name: 'Inventory',
    views: InventoryViews,
    hint: 'Inventarios',
    defaultTitle: 'Inventarios',
    url: ROUTES.inventarios.fullpath,
    permission: ROUTES.inventarios.permission,
  },
  {
    name: 'FinancialProgram',
    views: FinancialProgramViews,
    hint: 'Programa financiero',
    defaultTitle: 'Programa financiero',
    url: ROUTES.programa_financiero.fullpath,
    permission: ROUTES.programa_financiero.permission,
  },
  {
    name: 'CataloguesAndRules',
    views: CataloguesAndRulesViews,
    hint: 'Administración de reglas y catálogos de cuentas',
    defaultTitle: 'Reglas y catálogos',
    url: ROUTES.reglas_y_catalogos.fullpath,
    permission: ROUTES.reglas_y_catalogos.permission,
  },
  {
    name: 'SystemManagement',
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
