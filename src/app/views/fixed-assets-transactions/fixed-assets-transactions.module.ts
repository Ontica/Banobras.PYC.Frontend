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

import { FixedAssetTransactionsMainPageComponent } from './transactions-main-page/transactions-main-page.component';
import { FixedAssetTransactionsExplorerComponent } from './transactions-explorer/transactions-explorer.component';
import { FixedAssetTransactionsFilterComponent } from './transactions-explorer/transactions-filter.component';
import { FixedAssetTransactionsListComponent } from './transactions-explorer/transactions-list.component';
import { FixedAssetTransactionsListHeaderComponent } from './transactions-explorer/transactions-list-header.component';
import { FixedAssetTransactionsListItemComponent } from './transactions-explorer/transactions-list-item.component';

import { FixedAssetTransactionTabbedViewComponent } from './transaction-tabbed-view/transaction-tabbed-view.component';


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
    FixedAssetTransactionsMainPageComponent,
    FixedAssetTransactionsExplorerComponent,
    FixedAssetTransactionsFilterComponent,
    FixedAssetTransactionsListComponent,
    FixedAssetTransactionsListHeaderComponent,
    FixedAssetTransactionsListItemComponent,

    FixedAssetTransactionTabbedViewComponent,
    // TransactionEditorComponent,
    // TransactionHeaderComponent,
    // TransactionEntriesEditionComponent,
    // TransactionEntriesTableComponent,
  ],
  exports: [
    FixedAssetTransactionsMainPageComponent,
  ]
})
export class FixedAssetsTransactionsModule { }
