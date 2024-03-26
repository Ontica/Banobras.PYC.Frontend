/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { SecurityModule } from '@app/views/_security/security.module';

import { UnauthorizedComponent } from '@app/views/_security/unauthorized/unauthorized.component';


const routes: Routes = [
  {
    path: '',
    component: UnauthorizedComponent,
    pathMatch: 'full',
  },
];


@NgModule({

  imports: [
    RouterModule.forChild(routes),
    SecurityModule,
  ],

})
export class UnauthorizedModule { }
