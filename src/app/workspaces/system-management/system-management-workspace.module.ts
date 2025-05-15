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

import { AccessControlModule } from '@app/views/_access-control/access-control.module';
import { BudgetTransactionsModule } from '@app/views/budgets-transactions/budget-transactions.module';
import { PartiesModule } from '@app/views/parties/parties.module';

import { SystemManagementWorkspaceRoutingModule } from './system-management-workspace-routing.module';

import {
  AccessControlMainPageComponent
} from './access-control-main-page/access-control-main-page.component';

import {
  ControlPanelMainPageComponent
} from './control-panel-main-page/control-panel-main-page.component';



@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    AccessControlModule,
    BudgetTransactionsModule,
    PartiesModule,

    SystemManagementWorkspaceRoutingModule,
  ],

  declarations: [
    AccessControlMainPageComponent,
    ControlPanelMainPageComponent,
  ],

})
export class SystemManagementWorkspaceModule { }
