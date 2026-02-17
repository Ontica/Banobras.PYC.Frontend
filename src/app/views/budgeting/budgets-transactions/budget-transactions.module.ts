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

import { BillingModule } from '@app/views/billing/billing.module';
import { EntityRecordsModule } from '@app/views/entity-records/entity-records.module';
import { ReportsControlsModule } from '@app/views/_reports-controls/reports-controls.module';
import { TaxesModule } from '@app/views/taxes/taxes.module';

import { BudgetTransactionsMainPageComponent } from './transactions-main-page/transactions-main-page.component';
import { BudgetTransactionsExplorerComponent } from './transactions-explorer/transactions-explorer.component';
import { BudgetTransactionsListComponent } from './transactions-explorer/transactions-list.component';

import { BudgetTransactionsFilterComponent } from './transactions-explorer/transactions-filter.component';
import { BudgetTransactionsListHeaderComponent } from './transactions-explorer/transactions-list-header.component';
import { BudgetTransactionsListItemComponent } from './transactions-explorer/transactions-list-item.component';

import { BudgetTransactionsImporterComponent } from './transactions-importer/transactions-importer.component';
import { BudgetTransactionsImporterDetailsTableComponent } from './transactions-importer/importer-details-table.component';

import { BudgetTransactionTabbedViewComponent } from './transaction-tabbed-view/transaction-tabbed-view.component';
import { BudgetTransactionPrintViewComponent } from './transaction-tabbed-view/transaction-print-view.component';
import { BudgetTransactionsRelatedListComponent } from './transaction-tabbed-view/transactions-related-list.component';
import { BudgetTransactionCreatorComponent } from './transaction/transaction-creator.component';
import { BudgetTransactionEditorComponent } from './transaction/transaction-editor.component';
import { BudgetTransactionHeaderComponent } from './transaction/transaction-header.component';
import { BudgetTransactionEntriesEditionComponent } from './transaction-entries/transaction-entries-edition.component';
import { BudgetTransactionEntriesControlsComponent } from './transaction-entries/transaction-entries-controls.component';
import { BudgetTransactionEntriesTableComponent } from './transaction-entries/transaction-entries-table.component';
import { BudgetTransactionEntryEditorComponent } from './transaction-entries/transaction-entry-editor.component';
import { BudgetTransactionsPlanningGeneratorComponent } from './transactions-planning/transactions-planning-generator.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    BillingModule,
    EntityRecordsModule,
    ReportsControlsModule,
    TaxesModule,
  ],
  declarations: [
    BudgetTransactionsMainPageComponent,
    BudgetTransactionsExplorerComponent,
    BudgetTransactionsListComponent,

    BudgetTransactionsFilterComponent,
    BudgetTransactionsListHeaderComponent,
    BudgetTransactionsListItemComponent,

    BudgetTransactionsImporterComponent,
    BudgetTransactionsImporterDetailsTableComponent,

    BudgetTransactionTabbedViewComponent,
    BudgetTransactionPrintViewComponent,
    BudgetTransactionsRelatedListComponent,
    BudgetTransactionCreatorComponent,
    BudgetTransactionEditorComponent,
    BudgetTransactionHeaderComponent,
    BudgetTransactionEntriesEditionComponent,
    BudgetTransactionEntriesControlsComponent,
    BudgetTransactionEntriesTableComponent,
    BudgetTransactionEntryEditorComponent,
    BudgetTransactionsPlanningGeneratorComponent,
  ],
  exports: [
    BudgetTransactionsMainPageComponent,
    BudgetTransactionsListComponent,
    BudgetTransactionTabbedViewComponent,
    BudgetTransactionsPlanningGeneratorComponent,
  ]
})
export class BudgetTransactionsModule { }
