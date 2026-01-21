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

import { BillsMainPageComponent } from '@app/views/billing/bills-main-page/bills-main-page.component';

import { PartiesMainPageComponent } from '@app/views/parties/parties-main-page/parties-main-page.component';

import {
  PaymentOrdersMainPageComponent
} from '@app/views/payments/payment-orders/payment-orders-main-page/payment-orders-main-page.component';

import {
  PaymentInstructionsMainPageComponent
} from '@app/views/payments/payment-instructions/payment-instructions-main-page/payment-instructions-main-page.component';

// import {
//   RequestsMainPageComponent
// } from '@app/views/requests/requests-main-page/requests-main-page.component';


const routes: Routes = [
  // {
  //   data: { permission: ROUTES.pagos_solicitudes.permission },
  //   path: ROUTES.pagos_solicitudes.path,
  //   component: RequestsMainPageComponent,
  // },
  {
    data: { permission: ROUTES.pagos_solicitudes_de_pago.permission },
    path: ROUTES.pagos_solicitudes_de_pago.path,
    component: PaymentOrdersMainPageComponent,
  },
  {
    data: { permission: ROUTES.pagos_instrucciones_de_pago.permission },
    path: ROUTES.pagos_instrucciones_de_pago.path,
    component: PaymentInstructionsMainPageComponent,
  },
  {
    data: { permission: ROUTES.pagos_explorador.permission },
    path: ROUTES.pagos_explorador.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.pagos_facturas.permission },
    path: ROUTES.pagos_facturas.path,
    component: BillsMainPageComponent,
  },
  {
    data: { permission: ROUTES.pagos_beneficiarios.permission },
    path: ROUTES.pagos_beneficiarios.path,
    component: PartiesMainPageComponent,
  },
  {
    data: { permission: ROUTES.pagos_reportes.permission },
    path: ROUTES.pagos_reportes.path,
    component: DefaultComponent,
  },
  {
    path: '',
    redirectTo: ROUTES.pagos_solicitudes_de_pago.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsWorkspaceRoutingModule { }
