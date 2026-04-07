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
import { ProvisionsModule } from '@app/views/provisions/provisions.module';


@NgModule({

  imports: [
    CommonModule,

    ProcurementWorkspaceRoutingModule,

    OrdersModule,
    ProvisionsModule,
  ],

})
export class ProcurementWorkspaceModule { }
