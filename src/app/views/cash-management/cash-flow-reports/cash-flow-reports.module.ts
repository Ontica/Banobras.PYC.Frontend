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

import { ReportsControlsModule } from '@app/views/_reports-controls/reports-controls.module';

import { CashFlowReportMainPageComponent } from './cash-flow-report-main-page/cash-flow-report-main-page.component';
import { CashFlowReportExplorerComponent } from './cash-flow-report-explorer/cash-flow-report-explorer.component';
import { CashFlowReportFilterComponent } from './cash-flow-report-explorer/cash-flow-report-filter.component';



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
    CashFlowReportMainPageComponent,
    CashFlowReportExplorerComponent,
    CashFlowReportFilterComponent,
  ],
  exports: [
    CashFlowReportMainPageComponent,
  ]
})
export class CashFlowReportsModule { }
