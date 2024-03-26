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

import { DataTableComponent } from './data-table/data-table.component';
import { DataTableControlsComponent } from './data-table/data-table-controls.component';
import { ExportReportModalComponent } from './export-report-modal/export-report-modal.component';

@NgModule({
  declarations: [
    DataTableComponent,
    DataTableControlsComponent,
    ExportReportModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,
  ],
  exports: [
    DataTableComponent,
    DataTableControlsComponent,
    ExportReportModalComponent,
  ]
})
export class ReportsControlsModule { }
