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

import { BillingModule } from '@app/views/billing/billing.module';
import { BudgetsModule } from '@app/views/budgeting/budgets/budgets.module';
import { EntityRecordsModule } from '@app/views/entity-records/entity-records.module';
import { ReportsControlsModule } from '@app/views/_reports-controls/reports-controls.module';

import { PaymentOrdersEditionComponent } from './payment-orders-edition/payment-orders-edition.component';
import { PaymentOrderRequestComponent } from './payment-orders-edition/payment-order-request.component';
import { PaymentOrdersTableComponent } from './payment-orders-edition/payment-orders-table.component';

import { PaymentOrdersMainPageComponent } from './payment-orders-main-page/payment-orders-main-page.component';
import { PaymentOrdersExplorerComponent } from './payment-orders-explorer/payment-orders-explorer.component';
import { PaymentOrdersFilterComponent } from './payment-orders-explorer/payment-orders-filter.component';
import { PaymentOrdersListComponent } from './payment-orders-explorer/payment-orders-list.component';
import { PaymentOrdersListHeaderComponent } from './payment-orders-explorer/payment-orders-list-header.component';
import { PaymentOrdersListItemComponent } from './payment-orders-explorer/payment-orders-list-item.component';
import { PaymentOrderTabbedViewComponent } from './payment-order-tabbed-view/payment-order-tabbed-view.component';
import { PaymentOrderPrintViewComponent } from './payment-order-tabbed-view/payment-order-print-view.component';
import { PaymentOrderEditorComponent } from './payment-order/payment-order-editor.component';
import { PaymentOrderCreatorComponent } from './payment-order/payment-order-creator.component';
import { PaymentOrderHeaderComponent } from './payment-order/payment-order-header.component';
import { PaymentOrderItemsEditionComponent } from './payment-order-items/payment-order-items-edition.component';
import { PaymentOrderItemsTableComponent } from './payment-order-items/payment-order-items-table.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    BillingModule,
    BudgetsModule,
    EntityRecordsModule,
    ReportsControlsModule,
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
    PaymentOrderEditorComponent,
    PaymentOrderCreatorComponent,
    PaymentOrderHeaderComponent,
    PaymentOrderItemsEditionComponent,
    PaymentOrderItemsTableComponent,

    PaymentOrdersEditionComponent,
    PaymentOrderRequestComponent,
    PaymentOrdersTableComponent,
  ],
  exports: [
    PaymentOrdersMainPageComponent,
    PaymentOrdersEditionComponent,
  ],
})
export class PaymentOrdersModule { }
