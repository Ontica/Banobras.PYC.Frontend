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

import { AssetsAssignmentsMainPageComponent } from './assignments-main-page/assignments-main-page.component';
import { AssetsAssignmentsExplorerComponent } from './assignments-explorer/assignments-explorer.component';
import { AssetsAssignmentsFilterComponent } from './assignments-explorer/assignments-filter.component';
import { AssetsAssignmentTableComponent } from './assignments-explorer/assignments-table.component';
import { AssetsAssignmentsAssignmentTabbedViewComponent } from './assignment-tabbed-view/assignment-tabbed-view.component';
import { AssetsAssignmentHeaderComponent } from './assignment/assignment-header.component';
import { AssetsAssignmentEditorComponent } from './assignment/assignment-editor.component';
import { AssetsAssignmentEntriesEditionComponent } from './assignment-entries-edition/assignment-entries-edition.component';
import { AssetsAssignmentEntriesTableComponent } from './assignment-entries-edition/assignment-entries-table.component';



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
  ],
  declarations: [
    AssetsAssignmentsMainPageComponent,
    AssetsAssignmentsExplorerComponent,
    AssetsAssignmentsFilterComponent,
    AssetsAssignmentTableComponent,
    AssetsAssignmentsAssignmentTabbedViewComponent,
    AssetsAssignmentHeaderComponent,
    AssetsAssignmentEditorComponent,
    AssetsAssignmentEntriesEditionComponent,
    AssetsAssignmentEntriesTableComponent,
  ],
  exports: [
    AssetsAssignmentsMainPageComponent,
  ],
})
export class AssetsAssignmentsModule { }
