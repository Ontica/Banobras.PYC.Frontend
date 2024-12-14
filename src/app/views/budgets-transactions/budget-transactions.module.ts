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

import { DocumentsModule } from '../documents/documents.module';
import { ReportsControlsModule } from '../_reports-controls/reports-controls.module';

import { BudgetTransactionsMainPageComponent } from './transactions-main-page/transactions-main-page.component';
import { BudgetTransactionsExplorerComponent } from './transactions-explorer/transactions-explorer.component';
import { BudgetTransactionsListComponent } from './transactions-explorer/transactions-list.component';

import { BudgetTransactionsFilterComponent } from './transactions-explorer/transactions-filter.component';
import { BudgetTransactionsListHeaderComponent } from './transactions-explorer/transactions-list-header.component';
import { BudgetTransactionsListItemComponent } from './transactions-explorer/transactions-list-item.component';

import { BudgetTransactionTabbedViewComponent } from './transaction-tabbed-view/transaction-tabbed-view.component';
import { BudgetTransactionEditorComponent } from './transaction/transaction-editor.component';
import { BudgetTransactionHeaderComponent } from './transaction/transaction-header.component';
import { BudgetTransactionEntriesEditionComponent } from './transaction-entries/transaction-entries-edition.component';
import { BudgetTransactionEntriesTableComponent } from './transaction-entries/transaction-entries-table.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    DocumentsModule,
    ReportsControlsModule,
  ],
  declarations: [
    BudgetTransactionsMainPageComponent,
    BudgetTransactionsExplorerComponent,
    BudgetTransactionsListComponent,

    BudgetTransactionsFilterComponent,
    BudgetTransactionsListHeaderComponent,
    BudgetTransactionsListItemComponent,

    BudgetTransactionTabbedViewComponent,
    BudgetTransactionEditorComponent,
    BudgetTransactionHeaderComponent,
    BudgetTransactionEntriesEditionComponent,
    BudgetTransactionEntriesTableComponent,
  ],
  exports: [
    BudgetTransactionsMainPageComponent,
    BudgetTransactionsListComponent,
  ]
})
export class BudgetTransactionsModule { }
