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

import { BillingModule } from '../billing/billing.module';
import { BudgetsModule } from '@app/views/budgeting/budgets/budgets.module';
import { EntityRecordsModule } from '@app/views/entity-records/entity-records.module';
import { ReportsControlsModule } from '@app/views/_reports-controls/reports-controls.module';
import { TaxesModule } from '@app/views/taxes/taxes.module';

import { OrdersMainPageComponent } from './orders-main-page/orders-main-page.component';
import { OrdersExplorerComponent } from './orders-explorer/orders-explorer.component';
import { OrdersFilterComponent } from './orders-explorer/orders-filter.component';
import { OrdersDataComponent } from './orders-explorer/orders-data.component';
import { OrderTabbedViewComponent } from './order-tabbed-view/order-tabbed-view.component';
import { OrderHeaderComponent } from './order/order-header.component';
import { OrderCreatorComponent } from './order/order-creator.component';
import { OrderEditorComponent } from './order/order-editor.component';
import { OrderItemsEditionComponent } from './order-items/order-items-edition.component';
import { OrderItemsTableComponent } from './order-items/order-items-table.component';
import { OrderItemEditorComponent } from './order-items/order-item-editor.component';


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
    TaxesModule,
  ],
  declarations: [
    OrdersMainPageComponent,
    OrdersExplorerComponent,
    OrdersFilterComponent,
    OrdersDataComponent,
    OrderTabbedViewComponent,
    OrderHeaderComponent,
    OrderCreatorComponent,
    OrderEditorComponent,
    OrderItemsEditionComponent,
    OrderItemsTableComponent,
    OrderItemEditorComponent,
  ],
  exports: [
    OrdersMainPageComponent,
  ],
})
export class OrdersModule { }
