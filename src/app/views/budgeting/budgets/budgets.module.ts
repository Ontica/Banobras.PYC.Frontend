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
import { EntityRecordsModule } from '@app/views/entity-records/entity-records.module';
import { PaymentsManagementModule } from '@app/views/payments/payments-management/payments-management.module';
import { ReportsControlsModule } from '@app/views/_reports-controls/reports-controls.module';

import { BudgetMainPageComponent } from './budget-main-page/budget-main-page.component';
import { BudgetExplorerComponent } from './budget-explorer/budget-explorer.component';
import { BudgetFilterComponent } from './budget-explorer/budget-filter.component';

import { BudgetEntryBreakdownComponent } from './budget-entry-breakdown/budget-entry-breakdown.component';
import { BudgetEntryExplorerComponent } from './budget-entry-explorer/budget-entry-explorer.component';
import { BudgetEntryFilterComponent } from './budget-entry-explorer/budget-entry-filter.component';

import {
  BudgetSegmentItemSelectorComponent
} from './budget-segment-items/budget-segment-item-selector.component';

import { BudgetManagementComponent } from './budget-management/budget-management.component';
import { BudgetSubmitterComponent } from './budget-management/budget-submitter.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    BudgetTransactionsModule,
    EntityRecordsModule,
    PaymentsManagementModule,
    ReportsControlsModule,
  ],
  declarations: [
    BudgetMainPageComponent,
    BudgetExplorerComponent,
    BudgetFilterComponent,

    BudgetEntryBreakdownComponent,
    BudgetEntryExplorerComponent,
    BudgetEntryFilterComponent,

    BudgetSegmentItemSelectorComponent,
    BudgetManagementComponent,
    BudgetSubmitterComponent,
  ],
  exports: [
    BudgetMainPageComponent,
    BudgetManagementComponent,
  ]
})
export class BudgetsModule { }
