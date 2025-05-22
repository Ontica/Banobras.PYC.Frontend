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

import { CashFlowProjectionsMainPageComponent } from './projections-main-page/projections-main-page.component';
import { CashFlowProjectionsExplorerComponent } from './projections-explorer/projections-explorer.component';
import { CashFlowProjectionsFilterComponent } from './projections-explorer/projections-filter.component';
import { CashFlowProjectionsListComponent } from './projections-explorer/projections-list.component';
import { CashFlowProjectionsListHeaderComponent } from './projections-explorer/projections-list-header.component';
import { CashFlowProjectionsListItemComponent } from './projections-explorer/projections-list-item.component';


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
    CashFlowProjectionsMainPageComponent,
    CashFlowProjectionsExplorerComponent,
    CashFlowProjectionsFilterComponent,
    CashFlowProjectionsListComponent,
    CashFlowProjectionsListHeaderComponent,
    CashFlowProjectionsListItemComponent,
  ],
  exports: [
    CashFlowProjectionsMainPageComponent,
  ]
})
export class CashFlowModule { }
