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

import { BudgetMainPageComponent } from './budget-main-page/budget-main-page.component';
import { BudgetExplorerComponent } from './budget-explorer/budget-explorer.component';
import { BudgetFilterComponent } from './budget-explorer/budget-filter.component';
import {
  BudgetSegmentItemSelectorComponent
} from './budget-segment-items/budget-segment-item-selector.component';


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
    BudgetMainPageComponent,
    BudgetExplorerComponent,
    BudgetFilterComponent,
    BudgetSegmentItemSelectorComponent,
  ],
  exports: [
    BudgetMainPageComponent,
  ]
})
export class BudgetingModule { }
