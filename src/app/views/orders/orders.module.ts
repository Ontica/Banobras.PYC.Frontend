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

import { BudgetingModule } from '../budgeting/budgeting.module';
import { DocumentsModule } from '../documents/documents.module';
import { ReportsControlsModule } from '../_reports-controls/reports-controls.module';

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


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    BudgetingModule,
    DocumentsModule,
    ReportsControlsModule,
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
  ],
  exports: [
    OrdersMainPageComponent,
  ],
})
export class OrdersModule { }
