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

import { ReportsControlsModule } from '../_reports-controls/reports-controls.module';

import { PaymentsOrdersMainPageComponent } from './payments-orders-main-page/payments-orders-main-page.component';
import { PaymentsOrdersExplorerComponent } from './payments-orders-explorer/payments-orders-explorer.component';
import { PaymentsOrdersFilterComponent } from './payments-orders-explorer/payments-orders-filter.component';
import { PaymentsOrdersListControlsComponent } from './payments-orders-explorer/payments-orders-list-controls.component';
import { PaymentsOrdersListComponent } from './payments-orders-explorer/payments-orders-list.component';
import { PaymentsOrdersListItemComponent } from './payments-orders-explorer/payments-orders-list-item.component';
import { PaymentsOrdersListHeaderComponent } from './payments-orders-explorer/payments-orders-list-header.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    ReportsControlsModule,
  ],
  declarations: [
    PaymentsOrdersMainPageComponent,
    PaymentsOrdersExplorerComponent,
    PaymentsOrdersFilterComponent,
    PaymentsOrdersListControlsComponent,
    PaymentsOrdersListComponent,
    PaymentsOrdersListItemComponent,
    PaymentsOrdersListHeaderComponent,
  ],
  exports: [
    PaymentsOrdersMainPageComponent,
  ],
})
export class PaymentsModule { }
