/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentsWorkspaceRoutingModule } from './payments-workspace-routing.module';

import { BillingModule } from '@app/views/billing/billing.module';
import { PartiesModule } from '@app/views/parties/parties.module';
import { PaymentInstructionsModule } from '@app/views/payments/payment-instructions/payment-instructions.module';
import { PaymentOrdersModule } from '@app/views/payments/payment-orders/payment-orders.module';
import { ReportingModule } from '@app/views/reporting/reporting.module';
import { RequestsModule } from '@app/views/requests/requests.module';



@NgModule({

  imports: [
    CommonModule,

    PaymentsWorkspaceRoutingModule,

    BillingModule,
    PartiesModule,
    PaymentInstructionsModule,
    PaymentOrdersModule,
    ReportingModule,
    RequestsModule,
  ]

})
export class PaymentsWorkspaceModule { }
