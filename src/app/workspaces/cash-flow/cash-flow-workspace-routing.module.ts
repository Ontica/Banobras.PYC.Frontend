/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { ROUTES } from '@app/main-layout';

import {
  CashFlowProjectionsMainPageComponent
} from '@app/views/cash-management/cash-flow-projections/projections-main-page/projections-main-page.component';

import {
  CashFlowMainPageComponent
} from '@app/views/cash-management/cash-flow/cash-flow-main-page/cash-flow-main-page.component';

import {
  CashLedgerMainPageComponent
} from '@app/views/cash-management/cash-ledger/cash-ledger-main-page/cash-ledger-main-page.component';

import {
  FinancialProjectsMainPageComponent
} from '@app/views/financial-projects/projects-main-page/projects-main-page.component';

import {
  FinancialAccountsMainPageComponent
} from '@app/views/financial-accounts/accounts-main-page/accounts-main-page.component';

import {
  CashFlowReportMainPageComponent
} from '@app/views/cash-management/cash-flow-reports/cash-flow-report-main-page/cash-flow-report-main-page.component';


const routes: Routes = [
  {
    data: { permission: ROUTES.flujo_de_efectivo_proyecciones.permission },
    path: ROUTES.flujo_de_efectivo_proyecciones.path,
    component: CashFlowProjectionsMainPageComponent,
  },
  {
    data: { permission: ROUTES.flujo_de_efectivo_explorer.permission },
    path: ROUTES.flujo_de_efectivo_explorer.path,
    component: CashFlowMainPageComponent,
  },
  {
    data: { permission: ROUTES.flujo_de_efectivo_codificacion.permission },
    path: ROUTES.flujo_de_efectivo_codificacion.path,
    component: CashLedgerMainPageComponent,
  },
  {
    data: { permission: ROUTES.flujo_de_efectivo_proyectos.permission },
    path: ROUTES.flujo_de_efectivo_proyectos.path,
    component: FinancialProjectsMainPageComponent,
  },
  {
    data: { permission: ROUTES.flujo_de_efectivo_cuentas.permission },
    path: ROUTES.flujo_de_efectivo_cuentas.path,
    component: FinancialAccountsMainPageComponent,
  },
  {
    data: { permission: ROUTES.flujo_de_efectivo_reportes.permission },
    path: ROUTES.flujo_de_efectivo_reportes.path,
    component: CashFlowReportMainPageComponent,
  },
  {
    path: '',
    redirectTo: ROUTES.flujo_de_efectivo_proyecciones.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashFlowWorkspaceRoutingModule { }
