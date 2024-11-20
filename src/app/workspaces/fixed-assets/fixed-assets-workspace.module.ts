/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FixedAssetsWorkspaceRoutingModule } from './fixed-assets-workspace-routing.module';

import { FixedAssetsTransactionsModule } from '@app/views/fixed-assets-transactions/fixed-assets-transactions.module';
import { FixedAssetsModule } from '@app/views/fixed-assets/fixed-assets.module';
import { RequestsModule } from '@app/views/requests/requests.module';


@NgModule({

  imports: [
    CommonModule,

    FixedAssetsWorkspaceRoutingModule,

    FixedAssetsTransactionsModule,
    FixedAssetsModule,
    RequestsModule,
  ]

})
export class FixedAssetsWorkspaceModule { }
