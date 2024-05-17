/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetWorkspaceRoutingModule } from './budget-workspace-routing.module';

import { BudgetingModule } from '@app/views/budgeting/budgeting.module';

@NgModule({

  imports: [
    CommonModule,

    BudgetWorkspaceRoutingModule,

    BudgetingModule,
  ]

})
export class BudgetWorkspaceModule { }
