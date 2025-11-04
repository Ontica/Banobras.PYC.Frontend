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

// import {
//   RequestsMainPageComponent
// } from '@app/views/requests/requests-main-page/requests-main-page.component';

import {
  ContractsMainPageComponent
} from '@app/views/contracts/contracts-main-page/contracts-main-page.component';

import { OrdersMainPageComponent } from '@app/views/orders/orders-main-page/orders-main-page.component';


const routes: Routes = [
  // {
  //   data: { permission: ROUTES.gastos_solicitudes.permission },
  //   path: ROUTES.gastos_solicitudes.path,
  //   component: RequestsMainPageComponent,
  // },
  {
    data: { permission: ROUTES.gastos_requisiciones.permission },
    path: ROUTES.gastos_requisiciones.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.gastos_contratos.permission },
    path: ROUTES.gastos_contratos.path,
    component: ContractsMainPageComponent,
  },
  {
    data: { permission: ROUTES.gastos_entregas.permission },
    path: ROUTES.gastos_entregas.path,
    component: OrdersMainPageComponent,
  },
  {
    data: { permission: ROUTES.gastos_compras_menores.permission },
    path: ROUTES.gastos_compras_menores.path,
    component: OrdersMainPageComponent,
  },
  {
    data: { permission: ROUTES.gastos_gastos_y_reembolsos.permission },
    path: ROUTES.gastos_gastos_y_reembolsos.path,
    component: OrdersMainPageComponent,
  },
  {
    data: { permission: ROUTES.gastos_solicitudes_de_pago.permission },
    path: ROUTES.gastos_solicitudes_de_pago.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.gastos_provisiones.permission },
    path: ROUTES.gastos_provisiones.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.gastos_solicitudes_presupuestales.permission },
    path: ROUTES.gastos_solicitudes_presupuestales.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.gastos_reportes.permission },
    path: ROUTES.gastos_reportes.path,
    component: DefaultComponent,
  },
  {
    path: '',
    redirectTo: ROUTES.gastos_contratos.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcurementWorkspaceRoutingModule { }
