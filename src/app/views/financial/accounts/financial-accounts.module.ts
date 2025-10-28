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

import { FinancialAccountsMainPageComponent } from './accounts-main-page/accounts-main-page.component';
import { FinancialAccountsExplorerComponent } from './accounts-explorer/accounts-explorer.component';
import { FinancialAccountsFilterComponent } from './accounts-explorer/accounts-filter.component';
import { FinancialAccountsListComponent } from './accounts-explorer/accounts-list.component';
import { FinancialAccountListHeaderComponent } from './accounts-explorer/accounts-list-header.component';
import { FinancialAccountListItemComponent } from './accounts-explorer/accounts-list-item.component';
import { FinancialAccountTabbedViewComponent } from './account-tabbed-view/account-tabbed-view.component';
import { FinancialAccountOperationsModalComponent } from './operations/operations-modal.component';
import { FinancialAccountsEditionComponent } from './accounts-edition/accounts-edition.component';
import { FinancialAccountsControlsComponent } from './accounts-edition/accounts-controls.component';
import { FinancialAccountsTableComponent } from './accounts-edition/accounts-table.component';
import { FinancialAccountHeaderComponent } from './accounts-edition/account-header.component';
import { FinancialAccountEditorComponent } from './accounts-edition/account-editor.component';
import { FinancialAccountModalComponent } from './accounts-edition/account-modal.component';
import { CreditAccountAttributesComponent } from './accounts-edition/account-attributes/credit-account-attributes.component';
import { CreditFinancialDataComponent } from './accounts-edition/financial-data/credit-data.component';
import { ExternalCreditSearcherComponent } from './accounts-edition/external-credit/external-credit-searcher.component';
import { FinancialAccountOperationsEditionComponent } from './operations/operations-edition.component';
import { FinancialAccountOperationsTableComponent } from './operations/operations-table.component';
import { FinancialAccountOperationAssignerComponent } from './operations/operation-assigner.component';

// imports of standalone component
import { FinancialProjectModalComponent } from '../../financial/projects/project/project-modal.component';
import { FinancialProjectEditorComponent } from '../../financial/projects/project/project-editor.component';


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
    FinancialProjectEditorComponent,
  ],
  declarations: [
    FinancialAccountsMainPageComponent,
    FinancialAccountsExplorerComponent,
    FinancialAccountsFilterComponent,
    FinancialAccountsListComponent,
    FinancialAccountListHeaderComponent,
    FinancialAccountListItemComponent,
    FinancialAccountTabbedViewComponent,
    FinancialAccountsEditionComponent,
    FinancialAccountsControlsComponent,
    FinancialAccountsTableComponent,
    FinancialAccountHeaderComponent,
    FinancialAccountEditorComponent,
    FinancialAccountModalComponent,
    CreditAccountAttributesComponent,
    CreditFinancialDataComponent,
    ExternalCreditSearcherComponent,
    FinancialAccountOperationsModalComponent,
    FinancialAccountOperationsEditionComponent,
    FinancialAccountOperationsTableComponent,
    FinancialAccountOperationAssignerComponent,
  ],
  exports: [
    FinancialAccountsMainPageComponent,
    FinancialAccountsEditionComponent,
  ]
})
export class FinancialAccountsModule { }
