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

import { ReportBuilderComponent } from './report-builder/report-builder.component';
import { ReportViewerComponent } from './report-builder/report-viewer.component';
import { ReportFilterComponent } from './report-builder/report-filters/report-filter.component';
import { BudgetReportFilterComponent } from './report-builder/report-filters/budget-report-filter.component';
import { BudgetTransactionsModule } from '../budgeting/budgets-transactions/budget-transactions.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    ReportsControlsModule,
    BudgetTransactionsModule,
  ],
  declarations: [
    ReportBuilderComponent,
    ReportFilterComponent,
    ReportViewerComponent,
    BudgetReportFilterComponent,
  ],
  exports: [
    ReportBuilderComponent,
  ]
})
export class ReportingModule { }
