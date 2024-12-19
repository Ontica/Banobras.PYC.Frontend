/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcurementWorkspaceRoutingModule } from './procurement-workspace-routing.module';

import { ContractsModule } from '@app/views/contracts/contracts.module';
import { OrdersModule } from '@app/views/orders/orders.module';
import { ProductsModule } from '@app/views/products/products.module';
import { RequestsModule } from '@app/views/requests/requests.module';


@NgModule({

  imports: [
    CommonModule,

    ProcurementWorkspaceRoutingModule,

    ContractsModule,
    OrdersModule,
    ProductsModule,
    RequestsModule,
  ],

})
export class ProcurementWorkspaceModule { }
