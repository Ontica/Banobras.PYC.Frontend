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

import { BillsEditionModule } from '@app/views/billing/bills-edition/bills-edition.module';
import { EntityRecordsModule } from '@app/views/entity-records/entity-records.module';
import { ReportsControlsModule } from '@app/views/_reports-controls/reports-controls.module';

import { PaymentInstructionsMainPageComponent } from './payment-instructions-main-page/payment-instructions-main-page.component';
import { PaymentInstructionsExplorerComponent } from './payment-instructions-explorer/payment-instructions-explorer.component';
import { PaymentInstructionsFilterComponent } from './payment-instructions-explorer/payment-instructions-filter.component';
import { PaymentInstructionsListComponent } from './payment-instructions-explorer/payment-instructions-list.component';
import { PaymentInstructionsListItemComponent } from './payment-instructions-explorer/payment-instructions-list-item.component';
import { PaymentInstructionsListHeaderComponent } from './payment-instructions-explorer/payment-instructions-list-header.component';
import { PaymentInstructionTabbedViewComponent } from './payment-instruction-tabbed-view/payment-instruction-tabbed-view.component';
import { PaymentInstructionEditorComponent } from './payment-instruction/payment-instruction-editor.component';
import { PaymentInstructionHeaderComponent } from './payment-instruction/payment-instruction-header.component';
import { InstructionLogTableComponent } from './instruction-log/instruction-log-table.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    BillsEditionModule,
    EntityRecordsModule,
    ReportsControlsModule,
  ],
  declarations: [
    PaymentInstructionsMainPageComponent,
    PaymentInstructionsExplorerComponent,
    PaymentInstructionsFilterComponent,
    PaymentInstructionsListComponent,
    PaymentInstructionsListItemComponent,
    PaymentInstructionsListHeaderComponent,
    PaymentInstructionTabbedViewComponent,
    PaymentInstructionEditorComponent,
    PaymentInstructionHeaderComponent,
    InstructionLogTableComponent,
  ],
  exports: [
    PaymentInstructionsMainPageComponent,
  ],
})
export class PaymentInstructionsModule { }
