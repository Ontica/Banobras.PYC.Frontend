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

import { BudgetPlanningMainPageComponent } from './budget-planning-main-page/budget-planning-main-page.component';
import { BudgetPlanningExplorerComponent } from './budget-planning-explorer/budget-planning-explorer.component';
import { BudgetPlanningFilterComponent } from './budget-planning-explorer/budget-planning-filter.component';
import { SegmentItemSelectorComponent } from './segment-items/segment-item-selector.component';

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
    BudgetPlanningMainPageComponent,
    BudgetPlanningExplorerComponent,
    BudgetPlanningFilterComponent,
    SegmentItemSelectorComponent,
  ],
  exports: [
    BudgetPlanningMainPageComponent,
  ]
})
export class BudgetPlanningModule { }
