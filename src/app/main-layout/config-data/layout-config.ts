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
  StepsViews,
  BudgetViews,
  CashFlowViews,
  ContractsViews,
  PaymentsViews,
  FixedAssetsViews,
} from './views-config';


export type LAYOUT_TYPE = 'Management' | 'Unauthorized' |
                          'Steps' | 'Contracts' | 'Payments' | 'Budget' | 'FixedAssets' | 'CashFlow';


export const APP_VIEWS: View[] = UnauthorizedViews.concat(SystemManagementViews,
                                                          StepsViews,
                                                          BudgetViews,
                                                          CashFlowViews,
                                                          ContractsViews,
                                                          PaymentsViews,
                                                          FixedAssetsViews);


export const APP_LAYOUTS: Layout<LAYOUT_TYPE>[] = [
  {
    name: 'Steps',
    views: StepsViews,
    hint: 'Tareas',
    defaultTitle: 'Tareas',
    url: ROUTES.tareas.fullpath,
    permission: ROUTES.tareas.permission,
  },
  {
    name: 'Contracts',
    views: ContractsViews,
    hint: 'Adquisiciones',
    defaultTitle: 'Adquisiciones',
    url: ROUTES.adquisiciones.fullpath,
    permission: ROUTES.adquisiciones.permission,
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
    name: 'FixedAssets',
    views: FixedAssetsViews,
    hint: 'Inventarios',
    defaultTitle: 'Inventarios',
    url: ROUTES.inventarios.fullpath,
    permission: ROUTES.inventarios.permission,
  },
  // {
  //   name: 'CashFlow',
  //   views: CashFlowViews,
  //   hint: 'Flujo de efectivo',
  //   defaultTitle: 'Flujo de efectivo',
  //   url: ROUTES.flujo_de_efectivo.fullpath,
  //   permission: ROUTES.flujo_de_efectivo.permission,
  // },
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
