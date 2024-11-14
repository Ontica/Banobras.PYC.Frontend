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

import { ProductsMainPageComponent } from './products-main-page/products-main-page.component';
import { ProductsExplorerComponent } from './products-explorer/products-explorer.component';
import { ProductsFilterComponent } from './products-explorer/products-filter.component';
import { ProductsTableComponent } from './products-explorer/products-table.component';


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
    ProductsMainPageComponent,
    ProductsExplorerComponent,
    ProductsFilterComponent,
    ProductsTableComponent,
  ],
  exports: [
    ProductsMainPageComponent,
  ],
})
export class ProductsModule { }
