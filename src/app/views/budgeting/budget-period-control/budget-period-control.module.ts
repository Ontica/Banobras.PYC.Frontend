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

import { BudgetPeriodControlComponent } from './budget-period-control.component';
import { BudgetSelectorComponent } from './budget-selector.component';
import { BudgetPeriodTableComponent } from './budget-period-table.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,
  ],
  declarations: [
    BudgetPeriodControlComponent,
    BudgetSelectorComponent,
    BudgetPeriodTableComponent,
  ],
  exports: [
    BudgetPeriodControlComponent,
  ]
})
export class BudgetPeriodControlModule { }
