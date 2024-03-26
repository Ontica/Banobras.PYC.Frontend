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
    data: { permission: ROUTES.reglas_y_catalogos_conceptos_presupuestales.permission },
    path: ROUTES.reglas_y_catalogos_conceptos_presupuestales.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.reglas_y_catalogos_reglas_contabilizadoras.permission },
    path: ROUTES.reglas_y_catalogos_reglas_contabilizadoras.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.reglas_y_catalogos_valores_externos.permission },
    path: ROUTES.reglas_y_catalogos_valores_externos.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.reglas_y_catalogos_proveedores.permission },
    path: ROUTES.reglas_y_catalogos_proveedores.path,
    component: DefaultComponent,
  },
  {
    path: '',
    redirectTo: ROUTES.reglas_y_catalogos_conceptos_presupuestales.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CataloguesAndRulesWorkspaceRoutingModule { }
