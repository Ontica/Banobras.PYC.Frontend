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
    data: { permission: ROUTES.activo_fijo_solicitudes.permission },
    path: ROUTES.activo_fijo_solicitudes.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.activo_fijo_transacciones.permission },
    path: ROUTES.activo_fijo_transacciones.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.activo_fijo_explorador.permission },
    path: ROUTES.activo_fijo_explorador.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.activo_fijo_valuacion.permission },
    path: ROUTES.activo_fijo_valuacion.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.activo_fijo_configuracion.permission },
    path: ROUTES.activo_fijo_configuracion.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.activo_fijo_reportes.permission },
    path: ROUTES.activo_fijo_reportes.path,
    component: DefaultComponent,
  },
  {
    path: '',
    redirectTo: ROUTES.activo_fijo_solicitudes.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FixedAssetsWorkspaceRoutingModule { }
