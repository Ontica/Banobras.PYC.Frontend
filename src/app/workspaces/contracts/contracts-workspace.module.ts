/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContractsWorkspaceRoutingModule } from './contracts-workspace-routing.module';

import { ContractsModule } from '@app/views/contracts/contracts.module';
import { RequestsModule } from '@app/views/requests/requests.module';
import { ProductsModule } from '@app/views/products/products.module';

import { ProductsMainPageComponent } from './products-main-page/products-main-page.component';


@NgModule({

  imports: [
    CommonModule,

    ContractsWorkspaceRoutingModule,

    ContractsModule,
    RequestsModule,
    ProductsModule,
  ],
  declarations: [
    ProductsMainPageComponent
  ],

})
export class ContractsWorkspaceModule { }
