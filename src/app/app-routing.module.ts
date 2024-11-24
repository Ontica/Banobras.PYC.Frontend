/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

import { ChildRouteGuard, ParentRouteGuard } from './core';

import { DEFAULT_PATH, MainLayoutComponent, NoContentComponent, ROUTES } from '@app/main-layout';

const routes: Routes = [
  {
    data: { permission: ROUTES.tareas.permission },
    path: ROUTES.tareas.path,
    component: MainLayoutComponent,
    canActivate: [ParentRouteGuard],
    canActivateChild: [ChildRouteGuard],
    loadChildren: () => import('./workspaces/steps/steps-workspace.module')
      .then((m) => m.StepsWorkspaceModule)
  },
  {
    data: { permission: ROUTES.adquisiciones.permission },
    path: ROUTES.adquisiciones.path,
    component: MainLayoutComponent,
    canActivate: [ParentRouteGuard],
    canActivateChild: [ChildRouteGuard],
    loadChildren: () => import('./workspaces/procurement/procurement-workspace.module')
      .then((m) => m.ProcurementWorkspaceModule)
  },
  {
    data: { permission: ROUTES.pagos.permission },
    path: ROUTES.pagos.path,
    component: MainLayoutComponent,
    canActivate: [ParentRouteGuard],
    canActivateChild: [ChildRouteGuard],
    loadChildren: () => import('./workspaces/payments/payments-workspace.module')
      .then((m) => m.PaymentsWorkspaceModule)
  },
  {
    data: { permission: ROUTES.presupuesto.permission },
    path: ROUTES.presupuesto.path,
    component: MainLayoutComponent,
    canActivate: [ParentRouteGuard],
    canActivateChild: [ChildRouteGuard],
    loadChildren: () => import('./workspaces/budget/budget-workspace.module')
      .then((m) => m.BudgetWorkspaceModule)
  },
  {
    data: { permission: ROUTES.inventarios.permission },
    path: ROUTES.inventarios.path,
    component: MainLayoutComponent,
    canActivate: [ParentRouteGuard],
    canActivateChild: [ChildRouteGuard],
    loadChildren: () => import('./workspaces/inventory/inventory-workspace.module')
      .then((m) => m.InventoryWorkspaceModule)
  },
  {
    data: { permission: ROUTES.flujo_de_efectivo.permission },
    path: ROUTES.flujo_de_efectivo.path,
    component: MainLayoutComponent,
    canActivate: [ParentRouteGuard],
    canActivateChild: [ChildRouteGuard],
    loadChildren: () => import('./workspaces/cash-flow/cash-flow-workspace.module')
      .then((m) => m.CashFlowWorkspaceModule)
  },
  {
    data: { permission: ROUTES.administracion.permission },
    path: ROUTES.administracion.path,
    component: MainLayoutComponent,
    canActivate: [ParentRouteGuard],
    canActivateChild: [ChildRouteGuard],
    loadChildren: () => import('./workspaces/system-management/system-management-workspace.module')
                             .then((m) => m.SystemManagementWorkspaceModule)
  },
  {
    path: ROUTES.unauthorized.path,
    canActivate: [ParentRouteGuard],
    component: MainLayoutComponent,
    loadChildren: () => import('./workspaces/system-security/unauthorized.module')
                              .then(m => m.UnauthorizedModule)
  },
  {
    path: ROUTES.security.path,
    loadChildren: () => import('./workspaces/system-security/authentication.module')
                              .then(m => m.AuthenticationModule)
  },
  { path: '', redirectTo: DEFAULT_PATH, pathMatch: 'full' },
  { path: '**', component: NoContentComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
