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

import { BillsEditionModule } from '@app/views/billing/bills-edition/bills-edition.module';
import { BudgetManagementModule } from '@app/views/budgeting/budget-management/budget-management.module';
import { EntityRecordsModule } from '@app/views/entity-records/entity-records.module';
import { PaymentOrdersEditionModule } from '../payment-orders-edition/payment-orders-edition.module';
import { ReportsControlsModule } from '@app/views/_reports-controls/reports-controls.module';

import { PaymentOrdersMainPageComponent } from './payment-orders-main-page/payment-orders-main-page.component';
import { PaymentOrdersExplorerComponent } from './payment-orders-explorer/payment-orders-explorer.component';
import { PaymentOrdersFilterComponent } from './payment-orders-explorer/payment-orders-filter.component';
import { PaymentOrdersListComponent } from './payment-orders-explorer/payment-orders-list.component';
import { PaymentOrdersListHeaderComponent } from './payment-orders-explorer/payment-orders-list-header.component';
import { PaymentOrdersListItemComponent } from './payment-orders-explorer/payment-orders-list-item.component';
import { PaymentOrderTabbedViewComponent } from './payment-order-tabbed-view/payment-order-tabbed-view.component';
import { PaymentOrderPrintViewComponent } from './payment-order-tabbed-view/payment-order-print-view.component';
import { PaymentOrderItemsEditionComponent } from './payment-order-items/payment-order-items-edition.component';
import { PaymentOrderItemsTableComponent } from './payment-order-items/payment-order-items-table.component';

import { PaymentOrderEditorComponent } from './payment-order/payment-order-editor.component';
import { PaymentOrderCreatorComponent } from './payment-order/payment-order-creator.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    BillsEditionModule,
    BudgetManagementModule,
    EntityRecordsModule,
    PaymentOrdersEditionModule,
    ReportsControlsModule,

    PaymentOrderEditorComponent,
    PaymentOrderCreatorComponent,
  ],
  declarations: [
    PaymentOrdersMainPageComponent,
    PaymentOrdersExplorerComponent,
    PaymentOrdersFilterComponent,
    PaymentOrdersListComponent,
    PaymentOrdersListHeaderComponent,
    PaymentOrdersListItemComponent,
    PaymentOrderTabbedViewComponent,
    PaymentOrderPrintViewComponent,
    PaymentOrderItemsEditionComponent,
    PaymentOrderItemsTableComponent,
  ],
  exports: [
    PaymentOrdersMainPageComponent,
  ],
})
export class PaymentOrdersModule { }
