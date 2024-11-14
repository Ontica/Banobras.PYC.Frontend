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

import { TransactionsMainPageComponent } from './transactions-main-page/transactions-main-page.component';
import { TransactionsExplorerComponent } from './transactions-explorer/transactions-explorer.component';
import { TransactionsListComponent } from './transactions-explorer/transactions-list.component';

import { TransactionsFilterComponent } from './budget/explorer/transactions-filter.component';
import { TransactionsListHeaderComponent } from './budget/explorer/transactions-list-header.component';
import { TransactionsListItemComponent } from './budget/explorer/transactions-list-item.component';

import { FixedAssetTransactionsFilterComponent } from './fixed-assets/explorer/transactions-filter.component';
import { FixedAssetTransactionsListHeaderComponent } from './fixed-assets/explorer/transactions-list-header.component';

import { TransactionTabbedViewComponent } from './budget/transaction-tabbed-view/transaction-tabbed-view.component';
import { TransactionEditorComponent } from './budget/transaction/transaction-editor.component';
import { TransactionHeaderComponent } from './budget/transaction/transaction-header.component';
import { TransactionEntriesEditionComponent } from './budget/transaction-entries/transaction-entries-edition.component';
import { TransactionEntriesTableComponent } from './budget/transaction-entries/transaction-entries-table.component';


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
    TransactionsMainPageComponent,
    TransactionsExplorerComponent,
    TransactionsListComponent,

    TransactionsFilterComponent,
    TransactionsListHeaderComponent,
    TransactionsListItemComponent,

    FixedAssetTransactionsFilterComponent,
    FixedAssetTransactionsListHeaderComponent,

    TransactionTabbedViewComponent,
    TransactionEditorComponent,
    TransactionHeaderComponent,
    TransactionEntriesEditionComponent,
    TransactionEntriesTableComponent,
  ],
  exports: [
    TransactionsMainPageComponent,
  ]
})
export class TransactionsModule { }
