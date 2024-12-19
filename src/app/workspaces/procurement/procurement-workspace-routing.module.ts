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

import { OrdersMainPageComponent } from '@app/views/orders/orders-main-page/orders-main-page.component';

import {
  ProductsMainPageComponent
} from '@app/views/products/products-main-page/products-main-page.component';

import {
  RequestsMainPageComponent
} from '@app/views/requests/requests-main-page/requests-main-page.component';


const routes: Routes = [
  {
    data: { permission: ROUTES.adquisiciones_solicitudes.permission },
    path: ROUTES.adquisiciones_solicitudes.path,
    component: RequestsMainPageComponent,
  },
  {
    data: { permission: ROUTES.adquisiciones_contratos.permission },
    path: ROUTES.adquisiciones_contratos.path,
    component: ContractsMainPageComponent,
  },
  {
    data: { permission: ROUTES.adquisiciones_compras_menores.permission },
    path: ROUTES.adquisiciones_compras_menores.path,
    component: OrdersMainPageComponent,
  },
  {
    data: { permission: ROUTES.adquisiciones_entregas.permission },
    path: ROUTES.adquisiciones_entregas.path,
    component: OrdersMainPageComponent,
  },
  {
    data: { permission: ROUTES.adquisiciones_productos.permission },
    path: ROUTES.adquisiciones_productos.path,
    component: ProductsMainPageComponent,
  },
  {
    data: { permission: ROUTES.adquisiciones_proveedores.permission },
    path: ROUTES.adquisiciones_proveedores.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.adquisiciones_reportes.permission },
    path: ROUTES.adquisiciones_reportes.path,
    component: DefaultComponent,
  },
  {
    path: '',
    redirectTo: ROUTES.adquisiciones_solicitudes.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcurementWorkspaceRoutingModule { }
