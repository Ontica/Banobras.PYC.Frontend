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

import { PaymentInstructionsMainPageComponent } from './payment-instructions/payment-instructions-main-page/payment-instructions-main-page.component';
import { PaymentInstructionsExplorerComponent } from './payment-instructions/payment-instructions-explorer/payment-instructions-explorer.component';
import { PaymentInstructionsFilterComponent } from './payment-instructions/payment-instructions-explorer/payment-instructions-filter.component';
import { PaymentInstructionsListComponent } from './payment-instructions/payment-instructions-explorer/payment-instructions-list.component';
import { PaymentInstructionsListItemComponent } from './payment-instructions/payment-instructions-explorer/payment-instructions-list-item.component';
import { PaymentInstructionsListHeaderComponent } from './payment-instructions/payment-instructions-explorer/payment-instructions-list-header.component';
import { PaymentInstructionTabbedViewComponent } from './payment-instructions/payment-instruction-tabbed-view/payment-instruction-tabbed-view.component';
import { PaymentInstructionEditorComponent } from './payment-instructions/payment-instruction/payment-instruction-editor.component';
import { PaymentInstructionHeaderComponent } from './payment-instructions/payment-instruction/payment-instruction-header.component';
import { InstructionLogTableComponent } from './payment-instructions/instruction-log/instruction-log-table.component';
import { PaymentOrdersEditionComponent } from './payment-orders/payment-orders-edition/payment-orders-edition.component';
import { PaymentOrderRequestComponent } from './payment-orders/payment-orders-edition/payment-order-request.component';
import { PaymentOrdersTableComponent } from './payment-orders/payment-orders-edition/payment-orders-table.component';

import { PaymentOrdersMainPageComponent } from './payment-orders/payment-orders-main-page/payment-orders-main-page.component';
import { PaymentOrdersExplorerComponent } from './payment-orders/payment-orders-explorer/payment-orders-explorer.component';
import { PaymentOrdersFilterComponent } from './payment-orders/payment-orders-explorer/payment-orders-filter.component';
import { PaymentOrdersListComponent } from './payment-orders/payment-orders-explorer/payment-orders-list.component';
import { PaymentOrdersListHeaderComponent } from './payment-orders/payment-orders-explorer/payment-orders-list-header.component';
import { PaymentOrdersListItemComponent } from './payment-orders/payment-orders-explorer/payment-orders-list-item.component';
import { PaymentOrderTabbedViewComponent } from './payment-orders/payment-order-tabbed-view/payment-order-tabbed-view.component';
import { PaymentOrderPrintViewComponent } from './payment-orders/payment-order-tabbed-view/payment-order-print-view.component';
import { PaymentOrderEditorComponent } from './payment-orders/payment-order/payment-order-editor.component';
import { PaymentOrderCreatorComponent } from './payment-orders/payment-order/payment-order-creator.component';
import { PaymentOrderHeaderComponent } from './payment-orders/payment-order/payment-order-header.component';
import { PaymentOrderItemsEditionComponent } from './payment-orders/payment-order-items/payment-order-items-edition.component';
import { PaymentOrderItemsTableComponent } from './payment-orders/payment-order-items/payment-order-items-table.component';

import { PaymentTimeControlModalComponent } from './payment-time-control/time-control-modal.component';
import { PaymentTimeWindowSelectorComponent } from './payment-time-control/time-window-selector.component';


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
    PaymentInstructionsMainPageComponent,
    PaymentInstructionsExplorerComponent,
    PaymentInstructionsFilterComponent,
    PaymentInstructionsListComponent,
    PaymentInstructionsListItemComponent,
    PaymentInstructionsListHeaderComponent,
    PaymentInstructionTabbedViewComponent,
    PaymentInstructionEditorComponent,
    PaymentInstructionHeaderComponent,
    InstructionLogTableComponent,

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

    PaymentTimeControlModalComponent,
    PaymentTimeWindowSelectorComponent,
  ],
  exports: [
    PaymentInstructionsMainPageComponent,
    PaymentOrdersMainPageComponent,
    PaymentOrdersEditionComponent,
    PaymentTimeControlModalComponent,
  ],
})
export class PaymentsModule { }
