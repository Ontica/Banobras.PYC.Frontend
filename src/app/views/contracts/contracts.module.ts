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

import { ReportsControlsModule } from '../_reports-controls/reports-controls.module';

import { ContractsMainPageComponent } from './contracts-main-page/contracts-main-page.component';
import { ContractsExplorerComponent } from './contracts-explorer/contracts-explorer.component';
import { ContractsFilterComponent } from './contracts-explorer/contracts-filter.component';
import { ContractsListComponent } from './contracts-explorer/contracts-list.component';
import { ContractsListItemComponent } from './contracts-explorer/contracts-list-item.component';
import { ContractsListHeaderComponent } from './contracts-explorer/contracts-list-header.component';


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
    ContractsMainPageComponent,
    ContractsExplorerComponent,
    ContractsFilterComponent,
    ContractsListComponent,
    ContractsListItemComponent,
    ContractsListHeaderComponent,
  ],
  exports: [
    ContractsMainPageComponent,
  ],
})
export class ContractsModule { }
