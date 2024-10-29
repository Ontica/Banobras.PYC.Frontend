/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { ROUTES } from '@app/main-layout';

import { DefaultComponent } from '@app/shared/components/default-component/default.component';

import {
  RequestsMainPageComponent
} from '@app/views/requests/requests-main-page/requests-main-page.component';

import {
  BudgetMainPageComponent
} from '@app/views/budgeting/budgets/budget-main-page/budget-main-page.component';

import {
  TransactionsMainPageComponent
} from '@app/views/budgeting/transactions/transactions-main-page/transactions-main-page.component';


const routes: Routes = [
  {
    data: { permission: ROUTES.presupuesto_solicitudes.permission },
    path: ROUTES.presupuesto_solicitudes.path,
    component: RequestsMainPageComponent,
  },
  {
    data: { permission: ROUTES.presupuesto_transacciones.permission },
    path: ROUTES.presupuesto_transacciones.path,
    component: TransactionsMainPageComponent,
  },
  {
    data: { permission: ROUTES.presupuesto_explorador.permission },
    path: ROUTES.presupuesto_explorador.path,
    component: BudgetMainPageComponent,
  },
  {
    data: { permission: ROUTES.presupuesto_planeacion_anual.permission },
    path: ROUTES.presupuesto_planeacion_anual.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.presupuesto_configuracion.permission },
    path: ROUTES.presupuesto_configuracion.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.presupuesto_reportes.permission },
    path: ROUTES.presupuesto_reportes.path,
    component: DefaultComponent,
  },
  {
    path: '',
    redirectTo: ROUTES.presupuesto_solicitudes.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetWorkspaceRoutingModule { }
