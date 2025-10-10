/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { ROUTES } from '@app/main-layout';

import { DefaultComponent } from '@app/shared/components';

import {
  ChartOfAccountsMainPageComponent
} from '@app/views/chart-of-accounts/chart-of-accounts-main-page/chart-of-accounts-main-page.component';

import {
  FinancialConceptsMainPageComponent
} from '@app/views/financial-concepts/financial-concepts-main-page/financial-concepts-main-page.component';


const routes: Routes = [
  {
    data: { permission: ROUTES.reglas_y_catalogos_catalogos_de_cuentas.permission },
    path: ROUTES.reglas_y_catalogos_catalogos_de_cuentas.path,
    component: ChartOfAccountsMainPageComponent,
  },
  {
    data: { permission: ROUTES.reglas_y_catalogos_agrupaciones.permission },
    path: ROUTES.reglas_y_catalogos_agrupaciones.path,
    component: FinancialConceptsMainPageComponent,
  },
  {
    data: { permission: ROUTES.reglas_y_catalogos_reglas_contables.permission },
    path: ROUTES.reglas_y_catalogos_reglas_contables.path,
    component: DefaultComponent,
  },
  {
    path: '',
    redirectTo: ROUTES.reglas_y_catalogos_catalogos_de_cuentas.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CataloguesAndRulesWorkspaceRoutingModule { }
