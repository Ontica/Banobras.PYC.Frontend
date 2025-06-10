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

import { FinancialAccountsEditionComponent } from './accounts-edition/financial-accounts-edition.component';
import { FinancialAccountsControlsComponent } from './accounts-edition/financial-accounts-controls.component';
import { FinancialAccountsTableComponent } from './accounts-edition/financial-accounts-table.component';
import { FinancialAccountEditorComponent } from './accounts-edition/financial-account-editor.component';
import { CreditAccountAttributesComponent } from './account-attributes/credit-account-attributes.component';
import { CreditFinancialDataComponent } from './financial-data/credit-financial-data.component';
import { OperationsEditionComponent } from './operations/operations-edition.component';
import { OperationsTableComponent } from './operations/operations-table.component';
import { OperationAssignerComponent } from './operations/operation-assigner.component';

import { FinancialProjectModalComponent } from '../financial-projects/project/project-modal.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    EntityRecordsModule,
    ReportsControlsModule,

    FinancialProjectModalComponent,
  ],
  declarations: [
    FinancialAccountsEditionComponent,
    FinancialAccountsControlsComponent,
    FinancialAccountsTableComponent,
    FinancialAccountEditorComponent,
    CreditAccountAttributesComponent,
    CreditFinancialDataComponent,
    OperationsEditionComponent,
    OperationsTableComponent,
    OperationAssignerComponent,
  ],
  exports: [
    FinancialAccountsEditionComponent,
  ]
})
export class FinancialAccountsModule { }
