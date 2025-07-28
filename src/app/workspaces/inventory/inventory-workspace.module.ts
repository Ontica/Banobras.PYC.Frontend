/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryWorkspaceRoutingModule } from './inventory-workspace-routing.module';

import { AssetsModule } from '@app/views/inventory/assets/assets.module';
import { AssetsAssignmentsModule } from '@app/views/inventory/assets-assignments/assets-assignments.module';
import { AssetsTransactionsModule } from '@app/views/inventory/assets-transactions/assets-transactions.module';
import { RequestsModule } from '@app/views/requests/requests.module';


@NgModule({

  imports: [
    CommonModule,

    InventoryWorkspaceRoutingModule,

    AssetsModule,
    AssetsAssignmentsModule,
    AssetsTransactionsModule,
    RequestsModule,
  ]

})
export class InventoryWorkspaceModule { }
