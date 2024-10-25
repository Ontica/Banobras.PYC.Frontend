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

import { CataloguesAndRulesWorkspaceRoutingModule } from './catalogues-and-rules-workspace-routing.module';

import { ProductsModule } from '@app/views/products/products.module';

import { ProductsMainPageComponent } from './products-main-page/products-main-page.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    SharedModule,

    CataloguesAndRulesWorkspaceRoutingModule,

    ProductsModule,
  ],

  declarations: [
    ProductsMainPageComponent
  ],
})
export class CataloguesAndRulesWorkspaceModule { }
