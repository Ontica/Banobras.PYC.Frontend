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
import { EntityRecordsModule } from '../entity-records/entity-records.module';

import { AssetsModule } from '../assets/assets.module';
import { AssetsTransactionsModule } from '../assets-transactions/assets-transactions.module';

import { AssetsAssignmentsMainPageComponent } from './assignments-main-page/assignments-main-page.component';
import { AssetsAssignmentsExplorerComponent } from './assignments-explorer/assignments-explorer.component';
import { AssetsAssignmentsFilterComponent } from './assignments-explorer/assignments-filter.component';
import { AssetsAssignmentsAssignmentTabbedViewComponent } from './assignment-tabbed-view/assignment-tabbed-view.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    EntityRecordsModule,
    ReportsControlsModule,
    AssetsModule,
    AssetsTransactionsModule,
  ],
  declarations: [
    AssetsAssignmentsMainPageComponent,
    AssetsAssignmentsExplorerComponent,
    AssetsAssignmentsFilterComponent,
    AssetsAssignmentsAssignmentTabbedViewComponent,
  ],
  exports: [
    AssetsAssignmentsMainPageComponent,
  ],
})
export class AssetsAssignmentsModule { }
