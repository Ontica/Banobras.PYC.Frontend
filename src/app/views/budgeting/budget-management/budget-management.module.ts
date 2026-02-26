/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from '@app/shared/angular-material.module';
import { SharedModule } from '@app/shared/shared.module';

import { BudgetTransactionsModule } from '../budgets-transactions/budget-transactions.module';
import { PaymentsManagementModule } from '@app/views/payments/payments-management/payments-management.module';

import { BudgetManagementComponent } from './budget-management.component';
import { BudgetSubmitterComponent } from './budget-submitter.component';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    BudgetTransactionsModule,
    PaymentsManagementModule,
  ],
  declarations: [
    BudgetManagementComponent,
    BudgetSubmitterComponent,
  ],
  exports: [
    BudgetManagementComponent,
  ]
})
export class BudgetManagementModule { }
