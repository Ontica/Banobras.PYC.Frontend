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

import { OrdersModule } from '../orders/orders.module';
import { ReportsControlsModule } from '../_reports-controls/reports-controls.module';

import { ProvisionsMainPageComponent } from './provisions-main-page/provisions-main-page.component';
import { ProvisionsExplorerComponent } from './provisions-explorer/provisions-explorer.component';
import { ProvisionsFilterComponent } from './provisions-explorer/provisions-filter.component';
import { ProvisionsDataComponent } from './provisions-explorer/provisions-data.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    OrdersModule,
    ReportsControlsModule,
  ],
  declarations: [
    ProvisionsMainPageComponent,
    ProvisionsExplorerComponent,
    ProvisionsFilterComponent,
    ProvisionsDataComponent,
  ],
  exports: [
    ProvisionsMainPageComponent,
  ],
})
export class ProvisionsModule { }
