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

import { FinancialConceptsMainPageComponent } from './financial-concepts-main-page/financial-concepts-main-page.component';
import { FinancialConceptsExplorerComponent } from './financial-concepts-explorer/financial-concepts-explorer.component';
import { FinancialConceptsFilterComponent } from './financial-concepts-explorer/financial-concepts-filter.component';
import { FinancialConceptTabbedViewComponent } from './financial-concept-tabbed-view/financial-concept-tabbed-view.component';
import { FinancialConceptViewComponent } from './financial-concept-tabbed-view/financial-concept-view.component';


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
    FinancialConceptsMainPageComponent,
    FinancialConceptsExplorerComponent,
    FinancialConceptsFilterComponent,
    FinancialConceptTabbedViewComponent,
    FinancialConceptViewComponent,
  ],
  exports: [
    FinancialConceptsMainPageComponent,
  ]
})
export class FinancialConceptsModule { }
