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
  BudgetMainPageComponent
} from '@app/views/budgeting/budgets/budget-main-page/budget-main-page.component';

import {
  BudgetTransactionsMainPageComponent
} from '@app/views/budgeting/budgets-transactions/transactions-main-page/transactions-main-page.component';

import { ReportBuilderComponent } from '@app/views/reporting/report-builder/report-builder.component';

// import {
//   RequestsMainPageComponent
// } from '@app/views/requests/requests-main-page/requests-main-page.component';


const routes: Routes = [
  // {
  //   data: { permission: ROUTES.presupuesto_solicitudes.permission },
  //   path: ROUTES.presupuesto_solicitudes.path,
  //   component: RequestsMainPageComponent,
  // },
  {
    data: { permission: ROUTES.presupuesto_mesa_de_control.permission },
    path: ROUTES.presupuesto_mesa_de_control.path,
    component: BudgetTransactionsMainPageComponent,
  },
  {
    data: { permission: ROUTES.presupuesto_transacciones.permission },
    path: ROUTES.presupuesto_transacciones.path,
    component: BudgetTransactionsMainPageComponent,
  },
  {
    data: { permission: ROUTES.presupuesto_comprobacion_de_gastos.permission },
    path: ROUTES.presupuesto_comprobacion_de_gastos.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.presupuesto_suficiencias.permission },
    path: ROUTES.presupuesto_suficiencias.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.presupuesto_solicitudes_de_pago.permission },
    path: ROUTES.presupuesto_solicitudes_de_pago.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.presupuesto_provisiones.permission },
    path: ROUTES.presupuesto_provisiones.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.presupuesto_ejercicio.permission },
    path: ROUTES.presupuesto_ejercicio.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.presupuesto_explorador.permission },
    path: ROUTES.presupuesto_explorador.path,
    component: BudgetMainPageComponent,
  },
  {
    data: { permission: ROUTES.presupuesto_reportes.permission },
    path: ROUTES.presupuesto_reportes.path,
    component: ReportBuilderComponent,
  },
  {
    path: '',
    redirectTo: ROUTES.presupuesto_mesa_de_control.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetWorkspaceRoutingModule { }
