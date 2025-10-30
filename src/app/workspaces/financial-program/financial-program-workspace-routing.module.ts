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
} from '@app/views/financial/projects/projects-main-page/projects-main-page.component';

import {
  FinancialAccountsMainPageComponent
} from '@app/views/financial/accounts/accounts-main-page/accounts-main-page.component';

import {
  CashFlowReportMainPageComponent
} from '@app/views/cash-management/cash-flow-reports/cash-flow-report-main-page/cash-flow-report-main-page.component';


const routes: Routes = [
  {
    data: { permission: ROUTES.programa_financiero_proyecciones.permission },
    path: ROUTES.programa_financiero_proyecciones.path,
    component: CashFlowProjectionsMainPageComponent,
  },
  {
    data: { permission: ROUTES.programa_financiero_explorer.permission },
    path: ROUTES.programa_financiero_explorer.path,
    component: CashFlowMainPageComponent,
  },
  {
    data: { permission: ROUTES.programa_financiero_codificacion.permission },
    path: ROUTES.programa_financiero_codificacion.path,
    component: CashLedgerMainPageComponent,
  },
  {
    data: { permission: ROUTES.programa_financiero_proyectos.permission },
    path: ROUTES.programa_financiero_proyectos.path,
    component: FinancialProjectsMainPageComponent,
  },
  {
    data: { permission: ROUTES.programa_financiero_cuentas.permission },
    path: ROUTES.programa_financiero_cuentas.path,
    component: FinancialAccountsMainPageComponent,
  },
  {
    data: { permission: ROUTES.programa_financiero_reportes.permission },
    path: ROUTES.programa_financiero_reportes.path,
    component: CashFlowReportMainPageComponent,
  },
  {
    path: '',
    redirectTo: ROUTES.programa_financiero_proyecciones.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancialProgramWorkspaceRoutingModule { }
