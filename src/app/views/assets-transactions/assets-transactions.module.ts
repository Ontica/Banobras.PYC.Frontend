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
import { AssetsModule } from '../assets/assets.module';
import { EntityRecordsModule } from '../entity-records/entity-records.module';

import { AssetsTransactionsMainPageComponent } from './transactions-main-page/transactions-main-page.component';
import { AssetsTransactionsExplorerComponent } from './transactions-explorer/transactions-explorer.component';
import { AssetsTransactionsFilterComponent } from './transactions-explorer/transactions-filter.component';
import { AssetsTransactionsListComponent } from './transactions-explorer/transactions-list.component';
import { AssetsTransactionsListHeaderComponent } from './transactions-explorer/transactions-list-header.component';
import { AssetsTransactionsListItemComponent } from './transactions-explorer/transactions-list-item.component';

import { AssetsTransactionTabbedViewComponent } from './transaction-tabbed-view/transaction-tabbed-view.component';
import { AssetsTransactionPrintViewComponent } from './transaction-tabbed-view/transaction-print-view.component';
import { AssetsTransactionCreatorComponent } from './transaction/transaction-creator.component';
import { AssetsTransactionEditorComponent } from './transaction/transaction-editor.component';
import { AssetsTransactionHeaderComponent } from './transaction/transaction-header.component';

import { AssetsTransactionEntriesEditionComponent } from './transaction-entries/transaction-entries-edition.component';
import { AssetsTransactionEntriesTableComponent } from './transaction-entries/transaction-entries-table.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    AssetsModule,
    EntityRecordsModule,
    ReportsControlsModule,
  ],
  declarations: [
    AssetsTransactionsMainPageComponent,
    AssetsTransactionsExplorerComponent,
    AssetsTransactionsFilterComponent,
    AssetsTransactionsListComponent,
    AssetsTransactionsListHeaderComponent,
    AssetsTransactionsListItemComponent,

    AssetsTransactionTabbedViewComponent,
    AssetsTransactionPrintViewComponent,
    AssetsTransactionCreatorComponent,
    AssetsTransactionEditorComponent,
    AssetsTransactionHeaderComponent,

    AssetsTransactionEntriesEditionComponent,
    AssetsTransactionEntriesTableComponent,
  ],
  exports: [
    AssetsTransactionsMainPageComponent,
  ]
})
export class AssetsTransactionsModule { }
