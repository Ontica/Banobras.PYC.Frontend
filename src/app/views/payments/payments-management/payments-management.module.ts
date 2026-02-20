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

import { PaymentTimeControlModalComponent } from './payment-time-control/time-control-modal.component';
import { PaymentTimeWindowSelectorComponent } from './payment-time-control/time-window-selector.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,
  ],
  declarations: [
    PaymentTimeControlModalComponent,
    PaymentTimeWindowSelectorComponent,
  ],
  exports: [
    PaymentTimeControlModalComponent,
  ],
})
export class PaymentsManagementModule { }
