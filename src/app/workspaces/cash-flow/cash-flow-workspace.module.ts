/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CashFlowWorkspaceRoutingModule } from './cash-flow-workspace-routing.module';

import { CashFlowModule } from '@app/views/cash-management/cash-flow/cash-flow.module';
import { CashFlowProjectionsModule } from '@app/views/cash-management/cash-flow-projections/cash-flow-projections.module';
import { CashLedgerModule } from '@app/views/cash-management/cash-ledger/cash-ledger.module';
import { ChartOfAccountsModule } from '@app/views/chart-of-accounts/chart-of-accounts.module';
import { FinancialAccountsModule } from '@app/views/financial-accounts/financial-accounts.module';
import { FinancialProjectsModule } from '@app/views/financial-projects/financial-projects.module';


@NgModule({

  imports: [
    CommonModule,

    CashFlowWorkspaceRoutingModule,

    CashFlowModule,
    CashFlowProjectionsModule,
    CashLedgerModule,
    ChartOfAccountsModule,
    FinancialAccountsModule,
    FinancialProjectsModule,
  ],

})
export class CashFlowWorkspaceModule { }
