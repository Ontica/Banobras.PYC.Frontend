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

import { SuppliersMainPageComponent } from './suppliers-main-page/suppliers-main-page.component';
import { SuppliersExplorerComponent } from './suppliers-explorer/suppliers-explorer.component';
import { SuppliersFilterComponent } from './suppliers-explorer/suppliers-filter.component';


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
    SuppliersMainPageComponent,
    SuppliersExplorerComponent,
    SuppliersFilterComponent,
  ],
  exports: [
    SuppliersMainPageComponent,
  ],
})
export class SuppliersModule { }
