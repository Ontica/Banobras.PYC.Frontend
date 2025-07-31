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
import { CashTransactionsListComponent } from './cash-ledger-explorer/transactions-list.component';
import { CashTransactionsListHeaderComponent } from './cash-ledger-explorer/transactions-list-header.component';
import { CashTransactionsListItemComponent } from './cash-ledger-explorer/transactions-list-item.component';


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
    CashTransactionsListComponent,
    CashTransactionsListHeaderComponent,
    CashTransactionsListItemComponent,
  ],
  exports: [
    CashLedgerMainPageComponent,
  ]
})
export class CashLedgerModule { }
