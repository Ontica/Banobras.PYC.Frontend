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
import { ChartOfAccountsModule } from '@app/views/chart-of-accounts/chart-of-accounts.module';
import { FinancialProjectsModule } from '@app/views/financial-projects/financial-projects.module';


@NgModule({

  imports: [
    CommonModule,

    CashFlowWorkspaceRoutingModule,

    CashFlowModule,
    ChartOfAccountsModule,
    FinancialProjectsModule,
  ],

})
export class CashFlowWorkspaceModule { }
