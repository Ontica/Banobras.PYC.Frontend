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

import { DocumentsModule } from '../documents/documents.module';
import { ReportsControlsModule } from '../_reports-controls/reports-controls.module';

import { ContractsMainPageComponent } from './contracts-main-page/contracts-main-page.component';
import { ContractsExplorerComponent } from './contracts-explorer/contracts-explorer.component';
import { ContractsFilterComponent } from './contracts-explorer/contracts-filter.component';
import { ContractsListComponent } from './contracts-explorer/contracts-list.component';
import { ContractsListItemComponent } from './contracts-explorer/contracts-list-item.component';
import { ContractsListHeaderComponent } from './contracts-explorer/contracts-list-header.component';
import { ContractTabbedViewComponent } from './contract-tabbed-view/contract-tabbed-view.component';
import { ContractEditorComponent } from './contract/contract-editor.component';
import { ContractHeaderComponent } from './contract/contract-header.component';
import { ContractItemsTableComponent } from './contract-items/contract-items-table.component';
import { ContractMilestonesTableComponent } from './contract-milestones/contract-milestones-table.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    DocumentsModule,
    ReportsControlsModule,
  ],
  declarations: [
    ContractsMainPageComponent,
    ContractsExplorerComponent,
    ContractsFilterComponent,
    ContractsListComponent,
    ContractsListItemComponent,
    ContractsListHeaderComponent,
    ContractTabbedViewComponent,
    ContractEditorComponent,
    ContractHeaderComponent,
    ContractItemsTableComponent,
    ContractMilestonesTableComponent,
  ],
  exports: [
    ContractsMainPageComponent,
  ],
})
export class ContractsModule { }
