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
import { EntityRecordsModule } from '@app/views/entity-records/entity-records.module';
import { FinancialAccountsModule } from '@app/views/financial/accounts/financial-accounts.module';

import { FinancialProjectsMainPageComponent } from './projects-main-page/projects-main-page.component';
import { FinancialProjectsExplorerComponent } from './projects-explorer/projects-explorer.component';
import { FinancialProjectsFilterComponent } from './projects-explorer/projects-filter.component';
import { FinancialProjectsTableComponent } from './projects-explorer/projects-table.component';
import { FinancialProjectHeaderComponent } from './project/project-header.component';
import { FinancialProjectCreatorComponent } from './project/project-creator.component';
import { FinancialProjectEditorComponent } from './project/project-editor.component';
import { FinancialProjectTabbedViewComponent } from './project-tabbed-view/project-tabbed-view.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    ReportsControlsModule,
    EntityRecordsModule,
    FinancialAccountsModule,

    FinancialProjectHeaderComponent,
    FinancialProjectEditorComponent,
  ],
  declarations: [
    FinancialProjectsMainPageComponent,
    FinancialProjectsExplorerComponent,
    FinancialProjectsFilterComponent,
    FinancialProjectsTableComponent,
    FinancialProjectCreatorComponent,
    FinancialProjectTabbedViewComponent,
  ],
  exports: [
    FinancialProjectsMainPageComponent,
  ]
})
export class FinancialProjectsModule { }
