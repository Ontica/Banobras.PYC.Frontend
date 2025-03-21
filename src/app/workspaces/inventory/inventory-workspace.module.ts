/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryWorkspaceRoutingModule } from './inventory-workspace-routing.module';

import { FixedAssetsTransactionsModule } from '@app/views/fixed-assets-transactions/fixed-assets-transactions.module';
import { AssetsModule } from '@app/views/assets/assets.module';
import { RequestsModule } from '@app/views/requests/requests.module';


@NgModule({

  imports: [
    CommonModule,

    InventoryWorkspaceRoutingModule,

    FixedAssetsTransactionsModule,
    AssetsModule,
    RequestsModule,
  ]

})
export class InventoryWorkspaceModule { }
