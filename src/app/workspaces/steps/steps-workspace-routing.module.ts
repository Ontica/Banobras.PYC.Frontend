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
    data: { permission: ROUTES.tareas_pendientes.permission },
    path: ROUTES.tareas_pendientes.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.tareas_mesa_de_control.permission },
    path: ROUTES.tareas_mesa_de_control.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.tareas_completadas.permission },
    path: ROUTES.tareas_completadas.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.tareas_todas.permission },
    path: ROUTES.tareas_todas.path,
    component: DefaultComponent,
  },
  {
    path: '',
    redirectTo: ROUTES.tareas_pendientes.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StepsWorkspaceRoutingModule { }
