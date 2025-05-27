/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CashFlowWorkspaceRoutingModule } from './cash-flow-workspace-routing.module';

import { CashFlowModule } from '@app/views/cash-flow/cash-flow.module';
import { FinancialProjectsModule } from '@app/views/financial-projects/financial-projects.module';


@NgModule({

  imports: [
    CommonModule,

    CashFlowWorkspaceRoutingModule,

    CashFlowModule,
    FinancialProjectsModule,
  ],

})
export class CashFlowWorkspaceModule { }
