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
