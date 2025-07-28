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

import { AccountabilitiesModule } from '@app/views/_accountabilities/accountabilities.module';
import { EntityRecordsModule } from '@app/views/entity-records/entity-records.module';
import { ReportsControlsModule } from '@app/views/_reports-controls/reports-controls.module';

import { PartiesMainPageComponent } from './parties-main-page/parties-main-page.component';
import { PartiesExplorerComponent } from './parties-explorer/parties-explorer.component';
import { PartiesFilterComponent } from './parties-explorer/parties-filter.component';
import { PartyTabbedViewComponent } from './party-tabbed-view/party-tabbed-view.component';
import { PartyViewComponent } from './party-tabbed-view/party-view.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    AccountabilitiesModule,
    EntityRecordsModule,
    ReportsControlsModule,
  ],
  declarations: [
    PartiesMainPageComponent,
    PartiesExplorerComponent,
    PartiesFilterComponent,
    PartyTabbedViewComponent,
    PartyViewComponent,
  ],
  exports: [
    PartiesMainPageComponent,
  ],
})
export class PartiesModule { }
