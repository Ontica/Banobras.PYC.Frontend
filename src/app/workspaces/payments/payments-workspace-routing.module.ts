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


const routes: Routes = [
  {
    data: { permission: ROUTES.pagos_solicitudes.permission },
    path: ROUTES.pagos_solicitudes.path,
    component: RequestsMainPageComponent,
  },
  {
    data: { permission: ROUTES.pagos_comprometidos.permission },
    path: ROUTES.pagos_comprometidos.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.pagos_programados.permission },
    path: ROUTES.pagos_programados.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.pagos_realizados.permission },
    path: ROUTES.pagos_realizados.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.pagos_contratos.permission },
    path: ROUTES.pagos_contratos.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.pagos_reportes.permission },
    path: ROUTES.pagos_reportes.path,
    component: DefaultComponent,
  },
  {
    path: '',
    redirectTo: ROUTES.pagos_solicitudes.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsWorkspaceRoutingModule { }
