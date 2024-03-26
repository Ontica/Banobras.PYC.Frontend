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


const routes: Routes = [
  {
    data: { permission: ROUTES.reportes_financieros.permission },
    path: ROUTES.reportes_financieros.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.reportes_regulatorios.permission },
    path: ROUTES.reportes_regulatorios.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.reportes_operativos.permission },
    path: ROUTES.reportes_operativos.path,
    component: DefaultComponent,
  },
  {
    path: '',
    redirectTo: ROUTES.reportes_financieros.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportingWorkspaceRoutingModule { }
