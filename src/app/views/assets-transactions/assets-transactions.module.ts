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

import { AssetTransactionsMainPageComponent } from './transactions-main-page/transactions-main-page.component';
import { AssetTransactionsExplorerComponent } from './transactions-explorer/transactions-explorer.component';
import { AssetTransactionsFilterComponent } from './transactions-explorer/transactions-filter.component';
import { AssetTransactionsListComponent } from './transactions-explorer/transactions-list.component';
import { AssetTransactionsListHeaderComponent } from './transactions-explorer/transactions-list-header.component';
import { AssetTransactionsListItemComponent } from './transactions-explorer/transactions-list-item.component';

import { AssetTransactionTabbedViewComponent } from './transaction-tabbed-view/transaction-tabbed-view.component';
import { AssetTransactionPrintViewComponent } from './transaction-tabbed-view/transaction-print-view.component';
import { AssetTransactionCreatorComponent } from './transaction/transaction-creator.component';
import { AssetTransactionEditorComponent } from './transaction/transaction-editor.component';
import { AssetTransactionHeaderComponent } from './transaction/transaction-header.component';

import { AssetTransactionEntriesEditionComponent } from './transaction-entries/transaction-entries-edition.component';
import { AssetTransactionEntriesTableComponent } from './transaction-entries/transaction-entries-table.component';


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
    AssetTransactionsMainPageComponent,
    AssetTransactionsExplorerComponent,
    AssetTransactionsFilterComponent,
    AssetTransactionsListComponent,
    AssetTransactionsListHeaderComponent,
    AssetTransactionsListItemComponent,

    AssetTransactionTabbedViewComponent,
    AssetTransactionPrintViewComponent,
    AssetTransactionCreatorComponent,
    AssetTransactionEditorComponent,
    AssetTransactionHeaderComponent,

    AssetTransactionEntriesEditionComponent,
    AssetTransactionEntriesTableComponent,
  ],
  exports: [
    AssetTransactionsMainPageComponent,
  ]
})
export class AssetsTransactionsModule { }
