
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

import { RequestsMainPageComponent } from './requests-main-page/requests-main-page.component';
import { RequestsFilterComponent } from './requests-explorer/requests-filter.component';
import { RequestsExplorerComponent } from './requests-explorer/requests-explorer.component';

import { RequestCreatorComponent } from './request/request-creator.component';
import { RequestHeaderComponent } from './request/request-header.component';


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
    RequestsMainPageComponent,
    RequestsExplorerComponent,
    RequestsFilterComponent,

    RequestHeaderComponent,
    RequestCreatorComponent,
  ],
  exports: [
    RequestsMainPageComponent,
  ]
})
export class RequestsModule { }
