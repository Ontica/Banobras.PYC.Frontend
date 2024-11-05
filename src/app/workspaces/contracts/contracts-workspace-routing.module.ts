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
  ContractsMainPageComponent
} from '@app/views/contracts/contracts-main-page/contracts-main-page.component';

import { ProductsMainPageComponent } from './products-main-page/products-main-page.component';

import {
  RequestsMainPageComponent
} from '@app/views/requests/requests-main-page/requests-main-page.component';





const routes: Routes = [
  {
    data: { permission: ROUTES.contratos_solicitudes.permission },
    path: ROUTES.contratos_solicitudes.path,
    component: RequestsMainPageComponent,
  },
  {
    data: { permission: ROUTES.contratos_explorador.permission },
    path: ROUTES.contratos_explorador.path,
    component: ContractsMainPageComponent,
  },
  {
    data: { permission: ROUTES.contratos_entregas.permission },
    path: ROUTES.contratos_entregas.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.contratos_productos.permission },
    path: ROUTES.contratos_productos.path,
    component: ProductsMainPageComponent,
  },
  {
    data: { permission: ROUTES.contratos_proveedores.permission },
    path: ROUTES.contratos_proveedores.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.contratos_reportes.permission },
    path: ROUTES.contratos_reportes.path,
    component: DefaultComponent,
  },
  {
    path: '',
    redirectTo: ROUTES.contratos_solicitudes.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractsWorkspaceRoutingModule { }
