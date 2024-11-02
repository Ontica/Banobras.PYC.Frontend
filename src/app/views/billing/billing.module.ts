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

import { BillsMainPageComponent } from './bills-main-page/bills-main-page.component';
import { BillsExplorerComponent } from './bills-explorer/bills-explorer.component';
import { BillTabbedViewComponent } from './bill-tabbed-view/bill-tabbed-view.component';
import { BillsFilterComponent } from './bills-explorer/bills-filter.component';


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
    BillsMainPageComponent,
    BillsExplorerComponent,
    BillTabbedViewComponent,
    BillsFilterComponent,
  ],
  exports: [
    BillsMainPageComponent,
  ]
})
export class BillingModule { }
