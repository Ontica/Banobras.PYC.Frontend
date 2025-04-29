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


const routes: Routes = [
  {
    data: { permission: ROUTES.flujo_de_efectivo_planeacion.permission },
    path: ROUTES.flujo_de_efectivo_planeacion.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.flujo_de_efectivo_explorer.permission },
    path: ROUTES.flujo_de_efectivo_explorer.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.flujo_de_efectivo_codificacion.permission },
    path: ROUTES.flujo_de_efectivo_codificacion.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.flujo_de_efectivo_reglas.permission },
    path: ROUTES.flujo_de_efectivo_reglas.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.flujo_de_efectivo_reportes.permission },
    path: ROUTES.flujo_de_efectivo_reportes.path,
    component: DefaultComponent,
  },
  {
    path: '',
    redirectTo: ROUTES.flujo_de_efectivo_planeacion.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashFlowWorkspaceRoutingModule { }
