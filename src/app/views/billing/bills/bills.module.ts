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

import { BudgetManagementModule } from '@app/views/budgeting/budget-management/budget-management.module';
import { EntityRecordsModule } from '@app/views/entity-records/entity-records.module';
import { PaymentOrdersEditionModule } from '@app/views/payments/payment-orders-edition/payment-orders-edition.module';
import { ReportsControlsModule } from '@app/views/_reports-controls/reports-controls.module';

import { BillsMainPageComponent } from './bills-main-page/bills-main-page.component';
import { BillsExplorerComponent } from './bills-explorer/bills-explorer.component';
import { BillsFilterComponent } from './bills-explorer/bills-filter.component';
import { BillsTableComponent } from './bills-explorer/bills-table.component';
import { BillTabbedViewComponent } from './bill-tabbed-view/bill-tabbed-view.component';
import { BillEditorComponent } from './bill/bill-editor.component';
import { BillHeaderComponent } from './bill/bill-header.component';
import { BillConceptsTableComponent } from './bill/bill-concepts-table.component';

import {
  PaymentOrderEditorComponent
} from '@app/views/payments/payment-orders/payment-order/payment-order-editor.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    BudgetManagementModule,
    EntityRecordsModule,
    PaymentOrdersEditionModule,
    ReportsControlsModule,

    PaymentOrderEditorComponent,
],
  declarations: [
    BillsMainPageComponent,
    BillsExplorerComponent,
    BillsFilterComponent,
    BillsTableComponent,
    BillTabbedViewComponent,
    BillEditorComponent,
    BillHeaderComponent,
    BillConceptsTableComponent,
  ],
  exports: [
    BillsMainPageComponent,
  ]
})
export class BillsModule { }
