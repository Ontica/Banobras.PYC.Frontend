/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetWorkspaceRoutingModule } from './budget-workspace-routing.module';

import { BudgetPlanningModule } from '@app/views/budget-planning/budget-planning.module';

@NgModule({

  imports: [
    CommonModule,

    BudgetWorkspaceRoutingModule,

    BudgetPlanningModule,
  ]

})
export class BudgetWorkspaceModule { }
