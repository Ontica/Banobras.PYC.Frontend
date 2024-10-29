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

import { ReportsControlsModule } from '../_reports-controls/reports-controls.module';

import { BudgetMainPageComponent } from './budgets/budget-main-page/budget-main-page.component';
import { BudgetExplorerComponent } from './budgets/budget-explorer/budget-explorer.component';
import { BudgetFilterComponent } from './budgets/budget-explorer/budget-filter.component';
import {
  BudgetSegmentItemSelectorComponent
} from './budgets/budget-segment-items/budget-segment-item-selector.component';

import {
  TransactionsMainPageComponent
} from './transactions/transactions-main-page/transactions-main-page.component';
import {
  TransactionsExplorerComponent
} from './transactions/transactions-explorer/transactions-explorer.component';
import {
  TransactionsFilterComponent
} from './transactions/transactions-explorer/transactions-filter.component';
import { TransactionsListComponent } from './transactions/transactions-explorer/transactions-list.component';
import {
  TransactionsListHeaderComponent
} from './transactions/transactions-explorer/transactions-list-header.component';
import {
  TransactionsListItemComponent
} from './transactions/transactions-explorer/transactions-list-item.component';

import {
  TransactionTabbedViewComponent
} from './transactions/transaction-tabbed-view/transaction-tabbed-view.component';
import { TransactionEditorComponent } from './transactions/transaction/transaction-editor.component';
import { TransactionHeaderComponent } from './transactions/transaction/transaction-header.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    ReportsControlsModule,
  ],
  declarations: [
    BudgetMainPageComponent,
    BudgetExplorerComponent,
    BudgetFilterComponent,
    BudgetSegmentItemSelectorComponent,

    TransactionsMainPageComponent,
    TransactionsExplorerComponent,
    TransactionsFilterComponent,
    TransactionsListComponent,
    TransactionsListHeaderComponent,
    TransactionsListItemComponent,
    TransactionTabbedViewComponent,
    TransactionEditorComponent,
    TransactionHeaderComponent,
  ],
  exports: [
    BudgetMainPageComponent,
    TransactionsMainPageComponent,
  ]
})
export class BudgetingModule { }
