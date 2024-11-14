/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { ROUTES } from '@app/main-layout';

import { SecurityModule } from '@app/views/_security/security.module';

import { UserAuthenticationComponent } from '@app/views/_security/user-authentication/user-authentication.component';


const routes: Routes = [
  {
    path: ROUTES.security_login.path,
    component: UserAuthenticationComponent,
  },
  {
    path: '',
    redirectTo: ROUTES.security_login.path,
    pathMatch: 'full',
  },
];


@NgModule({

  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    SecurityModule,
  ]

})
export class AuthenticationModule { }
