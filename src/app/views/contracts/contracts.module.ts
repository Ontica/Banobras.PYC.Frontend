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
import { BudgetsModule } from '@app/views/budgeting/budgets/budgets.module';

import { ContractsMainPageComponent } from './contracts-main-page/contracts-main-page.component';
import { ContractsExplorerComponent } from './contracts-explorer/contracts-explorer.component';
import { ContractsFilterComponent } from './contracts-explorer/contracts-filter.component';
import { ContractsListComponent } from './contracts-explorer/contracts-list.component';
import { ContractsListItemComponent } from './contracts-explorer/contracts-list-item.component';
import { ContractsListHeaderComponent } from './contracts-explorer/contracts-list-header.component';
import { ContractTabbedViewComponent } from './contract-tabbed-view/contract-tabbed-view.component';
import { ContractCreatorComponent } from './contract/contract-creator.component';
import { ContractEditorComponent } from './contract/contract-editor.component';
import { ContractHeaderComponent } from './contract/contract-header.component';
import { ContractItemEditorComponent } from './contract-items/contract-item-editor.component';
import { ContractItemsEditionComponent } from './contract-items/contract-items-edition.component';
import { ContractItemsTableComponent } from './contract-items/contract-items-table.component';
import { ContractOrdersTableComponent } from './contract-orders/contract-orders-table.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    EntityRecordsModule,
    ReportsControlsModule,
    BudgetsModule,
  ],
  declarations: [
    ContractsMainPageComponent,
    ContractsExplorerComponent,
    ContractsFilterComponent,
    ContractsListComponent,
    ContractsListItemComponent,
    ContractsListHeaderComponent,
    ContractTabbedViewComponent,
    ContractCreatorComponent,
    ContractEditorComponent,
    ContractHeaderComponent,
    ContractItemEditorComponent,
    ContractItemsEditionComponent,
    ContractItemsTableComponent,
    ContractOrdersTableComponent,
  ],
  exports: [
    ContractsMainPageComponent,
  ],
})
export class ContractsModule { }
