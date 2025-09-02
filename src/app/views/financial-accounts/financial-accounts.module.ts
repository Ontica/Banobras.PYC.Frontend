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

import { EntityRecordsModule } from '@app/views/entity-records/entity-records.module';
import { ReportsControlsModule } from '@app/views/_reports-controls/reports-controls.module';

import { FinancialAccountsEditionComponent } from './accounts-edition/accounts-edition.component';
import { FinancialAccountsControlsComponent } from './accounts-edition/accounts-controls.component';
import { FinancialAccountsTableComponent } from './accounts-edition/accounts-table.component';
import { FinancialAccountEditorComponent } from './accounts-edition/account-editor.component';
import { CreditAccountAttributesComponent } from './accounts-edition/account-attributes/credit-account-attributes.component';
import { CreditFinancialDataComponent } from './accounts-edition/financial-data/credit-financial-data.component';

import { FinancialAccountOperationsEditionComponent } from './accounts-edition/operations/operations-edition.component';
import { FinancialAccountOperationsTableComponent } from './accounts-edition/operations/operations-table.component';
import { FinancialAccountOperationAssignerComponent } from './accounts-edition/operations/operation-assigner.component';

// imports of standalone component
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
    FinancialAccountOperationsEditionComponent,
    FinancialAccountOperationsTableComponent,
    FinancialAccountOperationAssignerComponent,
  ],
  exports: [
    FinancialAccountsEditionComponent,
  ]
})
export class FinancialAccountsModule { }
