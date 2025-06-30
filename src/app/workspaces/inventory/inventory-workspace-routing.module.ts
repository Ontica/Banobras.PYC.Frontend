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

import { AssetsAssignmentsMainPageComponent } from '@app/views/assets-assignments/assignments-main-page/assignments-main-page.component';

// import {
//   RequestsMainPageComponent
// } from '@app/views/requests/requests-main-page/requests-main-page.component';

import {
  AssetTransactionsMainPageComponent
} from '@app/views/assets-transactions/transactions-main-page/transactions-main-page.component';

import {
  AssetsMainPageComponent
} from '@app/views/assets/assets-main-page/assets-main-page.component';


const routes: Routes = [
  // {
  //   data: { permission: ROUTES.inventarios_solicitudes.permission },
  //   path: ROUTES.inventarios_solicitudes.path,
  //   component: RequestsMainPageComponent,
  // },
  {
    data: { permission: ROUTES.inventarios_resguardos.permission },
    path: ROUTES.inventarios_resguardos.path,
    component: AssetsAssignmentsMainPageComponent,
  },
  {
    data: { permission: ROUTES.inventarios_activo_fijo.permission },
    path: ROUTES.inventarios_activo_fijo.path,
    component: AssetsMainPageComponent,
  },
  {
    data: { permission: ROUTES.inventarios_transacciones.permission },
    path: ROUTES.inventarios_transacciones.path,
    component: AssetTransactionsMainPageComponent,
  },
  {
    data: { permission: ROUTES.inventarios_reportes.permission },
    path: ROUTES.inventarios_reportes.path,
    component: DefaultComponent,
  },
  {
    path: '',
    redirectTo: ROUTES.inventarios_resguardos.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryWorkspaceRoutingModule { }
