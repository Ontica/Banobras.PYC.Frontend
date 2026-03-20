/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { AppProductProfile } from '../common-models';

import { LAYOUT_TYPE } from './layout-config';

import { ROUTES } from './routes-config';


export type PRODUCT_PROFILE = 'Full' | 'Budget' | 'Payments';


const SHARED_LAYOUTS: LAYOUT_TYPE[] = ['CataloguesAndRules', 'SystemManagement', 'Unauthorized'];


const SHARED_ROUTE_PARENTS: string[] = [
  ROUTES.reglas_y_catalogos.path,
  ROUTES.administracion.path,
  ROUTES.unauthorized.path,
];


export const PRODUCT_PROFILES: Record<PRODUCT_PROFILE, AppProductProfile<PRODUCT_PROFILE>> = {
  Full: {
    key: 'Full',
    name: 'Planeación y Control',
    nameShort: 'PYC',
    description: '',
  },
  Budget: {
    key: 'Budget',
    name: 'Planeación y Control',
    nameShort: 'PYC',
    description: '',
    enabledLayouts: [
      'Budget',
      'FinancialProgram',
      ...SHARED_LAYOUTS,
    ],
    enabledRouteParents: [
      ROUTES.presupuesto.path,
      ROUTES.programa_financiero.path,
      ...SHARED_ROUTE_PARENTS,
    ],
    defaultRoute: ROUTES.administracion_panel_de_control,
  },
  Payments: {
    key: 'Payments',
    name: 'Adquisiciones e inventarios',
    nameShort: 'Adquisiciones',
    description: '',
    enabledLayouts: [
      'Procurement',
      'Payments',
      'Inventory',
      ...SHARED_LAYOUTS,
    ],
    enabledRouteParents: [
      ROUTES.gastos.path,
      ROUTES.pagos.path,
      ROUTES.inventarios.path,
      ...SHARED_ROUTE_PARENTS,
    ],
    defaultRoute: ROUTES.administracion_panel_de_control,
  },
};
