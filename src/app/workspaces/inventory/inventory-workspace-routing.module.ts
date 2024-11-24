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
  FixedAssetTransactionsMainPageComponent
} from '@app/views/fixed-assets-transactions/transactions-main-page/transactions-main-page.component';

import {
  FixedAssetsMainPageComponent
} from '@app/views/fixed-assets/fixed-assets-main-page/fixed-assets-main-page.component';

import {
  RequestsMainPageComponent
} from '@app/views/requests/requests-main-page/requests-main-page.component';


const routes: Routes = [
  {
    data: { permission: ROUTES.inventarios_solicitudes.permission },
    path: ROUTES.inventarios_solicitudes.path,
    component: RequestsMainPageComponent,
  },
  {
    data: { permission: ROUTES.inventarios_transacciones.permission },
    path: ROUTES.inventarios_transacciones.path,
    component: FixedAssetTransactionsMainPageComponent,
  },
  {
    data: { permission: ROUTES.inventarios_existencias.permission },
    path: ROUTES.inventarios_existencias.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.inventarios_activo_fijo.permission },
    path: ROUTES.inventarios_activo_fijo.path,
    component: FixedAssetsMainPageComponent,
  },
  {
    data: { permission: ROUTES.inventarios_valuacion.permission },
    path: ROUTES.inventarios_valuacion.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.inventarios_configuracion.permission },
    path: ROUTES.inventarios_configuracion.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.inventarios_reportes.permission },
    path: ROUTES.inventarios_reportes.path,
    component: DefaultComponent,
  },
  {
    path: '',
    redirectTo: ROUTES.inventarios_solicitudes.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryWorkspaceRoutingModule { }
