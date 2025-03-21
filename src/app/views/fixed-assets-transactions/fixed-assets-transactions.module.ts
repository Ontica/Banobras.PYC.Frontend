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
import { DocumentsModule } from '../documents/documents.module';
import { AssetsModule } from '../assets/assets.module';

import { FixedAssetTransactionsMainPageComponent } from './transactions-main-page/transactions-main-page.component';
import { FixedAssetTransactionsExplorerComponent } from './transactions-explorer/transactions-explorer.component';
import { FixedAssetTransactionsFilterComponent } from './transactions-explorer/transactions-filter.component';
import { FixedAssetTransactionsListComponent } from './transactions-explorer/transactions-list.component';
import { FixedAssetTransactionsListHeaderComponent } from './transactions-explorer/transactions-list-header.component';
import { FixedAssetTransactionsListItemComponent } from './transactions-explorer/transactions-list-item.component';

import { FixedAssetTransactionTabbedViewComponent } from './transaction-tabbed-view/transaction-tabbed-view.component';
import { FixedAssetTransactionPrintViewComponent } from './transaction-tabbed-view/transaction-print-view.component';
import { FixedAssetTransactionEditorComponent } from './transaction/transaction-editor.component';
import { FixedAssetTransactionHeaderComponent } from './transaction/transaction-header.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    ReportsControlsModule,
    DocumentsModule,
    AssetsModule,
  ],
  declarations: [
    FixedAssetTransactionsMainPageComponent,
    FixedAssetTransactionsExplorerComponent,
    FixedAssetTransactionsFilterComponent,
    FixedAssetTransactionsListComponent,
    FixedAssetTransactionsListHeaderComponent,
    FixedAssetTransactionsListItemComponent,

    FixedAssetTransactionTabbedViewComponent,
    FixedAssetTransactionPrintViewComponent,
    FixedAssetTransactionEditorComponent,
    FixedAssetTransactionHeaderComponent,
  ],
  exports: [
    FixedAssetTransactionsMainPageComponent,
  ]
})
export class FixedAssetsTransactionsModule { }
