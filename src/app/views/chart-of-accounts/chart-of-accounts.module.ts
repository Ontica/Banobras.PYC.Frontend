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

import { EntityRecordsModule } from '@app/views/entity-records/entity-records.module';
import { FinancialAccountsModule } from '@app/views/financial-accounts/financial-accounts.module';
import { ReportsControlsModule } from '@app/views/_reports-controls/reports-controls.module';

import { ChartOfAccountsMainPageComponent } from './chart-of-accounts-main-page/chart-of-accounts-main-page.component';
import { ChartOfAccountsExplorerComponent } from './chart-of-accounts-explorer/chart-of-accounts-explorer.component';
import { ChartOfAccountsFilterComponent } from './chart-of-accounts-explorer/chart-of-accounts-filter.component';
import { ChartOfAccountsListComponent } from './chart-of-accounts-explorer/chart-of-accounts-list.component';
import { ChartOfAccountsListHeaderComponent } from './chart-of-accounts-explorer/chart-of-accounts-list-header.component';
import { ChartOfAccountsListItemComponent } from './chart-of-accounts-explorer/chart-of-accounts-list-item.component';
import { StandardAccountTabbedViewComponent } from './standard-account-tabbed-view/standard-account-tabbed-view.component';
import { StandardAccountViewComponent } from './standard-account-tabbed-view/standard-account-view.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    EntityRecordsModule,
    FinancialAccountsModule,
    ReportsControlsModule,
  ],
  declarations: [
    ChartOfAccountsMainPageComponent,
    ChartOfAccountsExplorerComponent,
    ChartOfAccountsFilterComponent,
    ChartOfAccountsListComponent,
    ChartOfAccountsListHeaderComponent,
    ChartOfAccountsListItemComponent,
    StandardAccountTabbedViewComponent,
    StandardAccountViewComponent,
  ],
  exports: [
    ChartOfAccountsMainPageComponent,
  ]
})
export class ChartOfAccountsModule { }
