/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from '@app/shared/angular-material.module';
import { SharedModule } from '@app/shared/shared.module';

import { LoginComponent } from './login/login.component';
import { ChangePasswordFormComponent } from './change-password/change-password-form.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UserAuthenticationComponent } from './user-authentication/user-authentication.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';


@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,
  ],

  declarations: [
    LoginComponent,
    ChangePasswordFormComponent,
    ChangePasswordComponent,
    UserAuthenticationComponent,
    UnauthorizedComponent,
  ],

  exports: [
    UserAuthenticationComponent,
    ChangePasswordComponent,
    UnauthorizedComponent,
  ]

})
export class SecurityModule { }
