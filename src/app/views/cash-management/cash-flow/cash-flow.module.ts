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

import { CashFlowMainPageComponent } from './cash-flow-main-page/cash-flow-main-page.component';
import { CashFlowExplorerComponent } from './cash-flow-explorer/cash-flow-explorer.component';
import { CashFlowFilterComponent } from './cash-flow-explorer/cash-flow-filter.component';



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
    CashFlowMainPageComponent,
    CashFlowExplorerComponent,
    CashFlowFilterComponent,
  ],
  exports: [
    CashFlowMainPageComponent,
  ]
})
export class CashFlowModule { }
