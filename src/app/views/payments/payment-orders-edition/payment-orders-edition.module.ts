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

import { PaymentOrdersEditionComponent } from './payment-orders-edition.component';
import { PaymentOrderRequestComponent } from './payment-order-request.component';
import { PaymentOrdersTableComponent } from './payment-orders-table.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,
  ],
  declarations: [
    PaymentOrdersEditionComponent,
    PaymentOrderRequestComponent,
    PaymentOrdersTableComponent,
  ],
  exports: [
    PaymentOrdersEditionComponent,
  ],
})
export class PaymentOrdersEditionModule { }
