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

import { DocumentsModule } from '../documents/documents.module';
import { ReportsControlsModule } from '../_reports-controls/reports-controls.module';

import { OrdersMainPageComponent } from './orders-main-page/orders-main-page.component';
import { OrdersExplorerComponent } from './orders-explorer/orders-explorer.component';
import { OrdersFilterComponent } from './orders-explorer/orders-filter.component';
import { OrdersDataComponent } from './orders-explorer/orders-data.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    DocumentsModule,
    ReportsControlsModule,
  ],
  declarations: [
    OrdersMainPageComponent,
    OrdersExplorerComponent,
    OrdersFilterComponent,
    OrdersDataComponent,
  ],
  exports: [
    OrdersMainPageComponent,
  ],
})
export class OrdersModule { }
