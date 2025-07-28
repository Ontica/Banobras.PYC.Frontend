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

import { ConfirmSubmitModalComponent } from './confirm-submit-modal/confirm-submit-modal.component';
import { DocumentsEditionComponent } from './documents-edition/documents-edition.component';
import { DocumentsTableComponent } from './documents-edition/documents-table.component';
import { DocumentUploaderComponent } from './documents-edition/document-uploader.component';
import { HistoryTableComponent } from './history-table/history-table.component';


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
    ConfirmSubmitModalComponent,
    DocumentsEditionComponent,
    DocumentsTableComponent,
    DocumentUploaderComponent,
    HistoryTableComponent,
  ],
  exports: [
    ConfirmSubmitModalComponent,
    DocumentsEditionComponent,
    HistoryTableComponent,
  ],
})
export class EntityRecordsModule { }
