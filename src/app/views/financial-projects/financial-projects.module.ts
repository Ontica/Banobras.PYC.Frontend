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

import { EntityRecordsModule } from '../entity-records/entity-records.module';
import { ReportsControlsModule } from '../_reports-controls/reports-controls.module';

import { FinancialProjectsMainPageComponent } from './projects-main-page/projects-main-page.component';
import { FinancialProjectsExplorerComponent } from './projects-explorer/projects-explorer.component';
import { FinancialProjectsFilterComponent } from './projects-explorer/projects-filter.component';
import { FinancialProjectsTableComponent } from './projects-explorer/projects-table.component';
import { FinancialProjectHeaderComponent } from './project/project-header.component';
import { FinancialProjectCreatorComponent } from './project/project-creator.component';
import { FinancialProjectEditorComponent } from './project/project-editor.component';
import { FinancialProjectTabbedViewComponent } from './project-tabbed-view/project-tabbed-view.component';
import { FinancialProjectAccountsEditionComponent } from './project-accounts/project-accounts-edition.component';
import { FinancialProjectAccountsTableComponent } from './project-accounts/project-accounts-table.component';
import { FinancialProjectAccountEditorComponent } from './project-accounts/project-account-editor.component';
import { CreditAccountAttributesComponent } from './project-accounts/account-attributes/credit-account-attributes.component';
import { CreditFinancialDataComponent } from './project-accounts/financial-data/credit-financial-data.component';
import { FinancialProjectAccountOperationsEditionComponent } from './project-accounts/account-operations/account-operations-edition.component';
import { FinancialProjectAccountOperationsTableComponent } from './project-accounts/account-operations/account-operations-table.component';
import { FinancialProjectAccountOperationAssignerComponent } from './project-accounts/account-operations/account-operation-assigner.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    EntityRecordsModule,
    ReportsControlsModule,
  ],
  declarations: [
    FinancialProjectsMainPageComponent,
    FinancialProjectsExplorerComponent,
    FinancialProjectsFilterComponent,
    FinancialProjectsTableComponent,
    FinancialProjectHeaderComponent,
    FinancialProjectCreatorComponent,
    FinancialProjectEditorComponent,
    FinancialProjectTabbedViewComponent,
    FinancialProjectAccountsEditionComponent,
    FinancialProjectAccountsTableComponent,
    FinancialProjectAccountEditorComponent,
    CreditAccountAttributesComponent,
    CreditFinancialDataComponent,
    FinancialProjectAccountOperationsEditionComponent,
    FinancialProjectAccountOperationsTableComponent,
    FinancialProjectAccountOperationAssignerComponent,
  ],
  exports: [
    FinancialProjectsMainPageComponent,
  ]
})
export class FinancialProjectsModule { }
