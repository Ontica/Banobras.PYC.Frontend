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

import { ReportsControlsModule } from '@app/views/_reports-controls/reports-controls.module';
import { EntityRecordsModule } from '@app/views/entity-records/entity-records.module';

import { CashLedgerMainPageComponent } from './cash-ledger-main-page/cash-ledger-main-page.component';
import { CashLedgerExplorerComponent } from './cash-ledger-explorer/cash-ledger-explorer.component';
import { CashLedgerFilterComponent } from './cash-ledger-explorer/cash-ledger-filter.component';
import { CashLedgerListComponent } from './cash-ledger-explorer/cash-ledger-list.component';
import { CashLedgerListHeaderComponent } from './cash-ledger-explorer/cash-ledger-list-header.component';
import { CashLedgerListItemComponent } from './cash-ledger-explorer/cash-ledger-list-item.component';
import { CashTransactionTabbedViewComponent } from './cash-transaction-tabbed-view/transaction-tabbed-view.component';
import { CashTransactionViewComponent } from './cash-transaction-tabbed-view/transaction-view.component';
import { CashTransactionPrintViewComponent } from './cash-transaction-tabbed-view/transaction-print-view.component';
import { CashEntriesEditionComponent } from './cash-entries/entries-edition.component';
import { CashEntriesTableComponent } from './cash-entries/entries-table.component';
import { CashEntriesAnalysisComponent } from './cash-entries/entries-analysis.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    ReportsControlsModule,
    EntityRecordsModule,
  ],
  declarations: [
    CashLedgerMainPageComponent,
    CashLedgerExplorerComponent,
    CashLedgerFilterComponent,
    CashLedgerListComponent,
    CashLedgerListHeaderComponent,
    CashLedgerListItemComponent,
    CashTransactionTabbedViewComponent,
    CashTransactionViewComponent,
    CashTransactionPrintViewComponent,
    CashEntriesEditionComponent,
    CashEntriesTableComponent,
    CashEntriesAnalysisComponent,
  ],
  exports: [
    CashLedgerMainPageComponent,
  ]
})
export class CashLedgerModule { }
