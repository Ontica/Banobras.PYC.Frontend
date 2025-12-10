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

import { PaymentsOrdersMainPageComponent } from './payments-orders/payments-orders-main-page/payments-orders-main-page.component';
import { PaymentsOrdersExplorerComponent } from './payments-orders/payments-orders-explorer/payments-orders-explorer.component';
import { PaymentsOrdersFilterComponent } from './payments-orders/payments-orders-explorer/payments-orders-filter.component';
import { PaymentsOrdersListComponent } from './payments-orders/payments-orders-explorer/payments-orders-list.component';
import { PaymentsOrdersListItemComponent } from './payments-orders/payments-orders-explorer/payments-orders-list-item.component';
import { PaymentsOrdersListHeaderComponent } from './payments-orders/payments-orders-explorer/payments-orders-list-header.component';
import { PaymentOrderTabbedViewComponent } from './payments-orders/payment-order-tabbed-view/payment-order-tabbed-view.component';
import { PaymentOrderEditorComponent } from './payments-orders/payment-order/payment-order-editor.component';
import { PaymentOrderCreatorComponent } from './payments-orders/payment-order/payment-order-creator.component';
import { PaymentOrderHeaderComponent } from './payments-orders/payment-order/payment-order-header.component';
import { InstructionLogTableComponent } from './payments-orders/instruction-log/instruction-log-table.component';
import { PaymentsOrdersEditionComponent } from './payments-orders/payments-orders-edition/payments-orders-edition.component';
import { PaymentOrderRequestComponent } from './payments-orders/payments-orders-edition/payment-order-request.component';
import { PaymentsOrdersTableComponent } from './payments-orders/payments-orders-edition/payments-orders-table.component';

import { PayablesMainPageComponent } from './payables/payables-main-page/payables-main-page.component';
import { PayablesExplorerComponent } from './payables/payables-explorer/payables-explorer.component';
import { PayablesFilterComponent } from './payables/payables-explorer/payables-filter.component';
import { PayablesListComponent } from './payables/payables-explorer/payables-list.component';
import { PayablesListHeaderComponent } from './payables/payables-explorer/payables-list-header.component';
import { PayablesListItemComponent } from './payables/payables-explorer/payables-list-item.component';
import { PayableTabbedViewComponent } from './payables/payable-tabbed-view/payable-tabbed-view.component';
import { PayableEditorComponent } from './payables/payable/payable-editor.component';
import { PayableCreatorComponent } from './payables/payable/payable-creator.component';
import { PayableHeaderComponent } from './payables/payable/payable-header.component';
import { PayableItemsEditionComponent } from './payables/payable-items/payable-items-edition.component';
import { PayableItemsTableComponent } from './payables/payable-items/payable-items-table.component';


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
    PaymentsOrdersMainPageComponent,
    PaymentsOrdersExplorerComponent,
    PaymentsOrdersFilterComponent,
    PaymentsOrdersListComponent,
    PaymentsOrdersListItemComponent,
    PaymentsOrdersListHeaderComponent,
    PaymentOrderTabbedViewComponent,
    PaymentOrderEditorComponent,
    PaymentOrderCreatorComponent,
    PaymentOrderHeaderComponent,
    InstructionLogTableComponent,
    PaymentsOrdersEditionComponent,
    PaymentOrderRequestComponent,
    PaymentsOrdersTableComponent,

    PayablesMainPageComponent,
    PayablesExplorerComponent,
    PayablesFilterComponent,
    PayablesListComponent,
    PayablesListHeaderComponent,
    PayablesListItemComponent,
    PayableTabbedViewComponent,
    PayableEditorComponent,
    PayableCreatorComponent,
    PayableHeaderComponent,
    PayableItemsEditionComponent,
    PayableItemsTableComponent,
  ],
  exports: [
    PaymentsOrdersMainPageComponent,
    PayablesMainPageComponent,
    PaymentsOrdersEditionComponent,
  ],
})
export class PaymentsModule { }
