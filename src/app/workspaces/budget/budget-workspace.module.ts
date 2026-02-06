/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetWorkspaceRoutingModule } from './budget-workspace-routing.module';

import { BudgetsModule } from '@app/views/budgeting/budgets/budgets.module';
import { BudgetTransactionsModule } from '@app/views/budgeting/budgets-transactions/budget-transactions.module';
import { ReportingModule } from '@app/views/reporting/reporting.module';
import { RequestsModule } from '@app/views/requests/requests.module';

@NgModule({

  imports: [
    CommonModule,

    BudgetWorkspaceRoutingModule,

    BudgetsModule,
    BudgetTransactionsModule,
    ReportingModule,
    RequestsModule,
  ]

})
export class BudgetWorkspaceModule { }
