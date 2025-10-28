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

import { FinancialRulesMainPageComponent } from './rules-main-page/rules-main-page.component';
import { FinancialRulesExplorerComponent } from './rules-explorer/rules-explorer.component';
import { FinancialRulesFilterComponent } from './rules-explorer/rules-filter.component';


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
    FinancialRulesMainPageComponent,
    FinancialRulesExplorerComponent,
    FinancialRulesFilterComponent,
  ],
  exports: [
    FinancialRulesMainPageComponent,
  ]
})
export class FinancialRulesModule { }
