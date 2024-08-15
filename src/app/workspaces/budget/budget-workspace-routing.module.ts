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

// import {
//   RequestsMainPageComponent
// } from '@app/views/requests/requests-main-page/requests-main-page.component';

// import { BudgetMainPageComponent } from '@app/views/budgeting/budget-main-page/budget-main-page.component';


const routes: Routes = [
  {
    data: { permission: ROUTES.presupuesto_solicitudes.permission },
    path: ROUTES.presupuesto_solicitudes.path,
    component: DefaultComponent, // RequestsMainPageComponent,
  },
  {
    data: { permission: ROUTES.presupuesto_control.permission },
    path: ROUTES.presupuesto_control.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.presupuesto_comprometido.permission },
    path: ROUTES.presupuesto_comprometido.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.presupuesto_ejercido.permission },
    path: ROUTES.presupuesto_ejercido.path,
    component: DefaultComponent,
  },
  {
    data: { permission: ROUTES.presupuesto_planeacion.permission },
    path: ROUTES.presupuesto_planeacion.path,
    component: DefaultComponent, // BudgetMainPageComponent,
  },
  {
    data: { permission: ROUTES.presupuesto_reportes.permission },
    path: ROUTES.presupuesto_reportes.path,
    component: DefaultComponent,
  },
  {
    path: '',
    redirectTo: ROUTES.presupuesto_solicitudes.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetWorkspaceRoutingModule { }
