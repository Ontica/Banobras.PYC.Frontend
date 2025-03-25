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
  ],
  exports: [
    AssetTransactionsMainPageComponent,
  ]
})
export class AssetsTransactionsModule { }
