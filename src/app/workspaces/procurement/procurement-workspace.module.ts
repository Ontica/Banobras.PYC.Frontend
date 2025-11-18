/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcurementWorkspaceRoutingModule } from './procurement-workspace-routing.module';

import { OrdersModule } from '@app/views/orders/orders.module';
import { RequestsModule } from '@app/views/requests/requests.module';


@NgModule({

  imports: [
    CommonModule,

    ProcurementWorkspaceRoutingModule,

    OrdersModule,
    RequestsModule,
  ],

})
export class ProcurementWorkspaceModule { }
