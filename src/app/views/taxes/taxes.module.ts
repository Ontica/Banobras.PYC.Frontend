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

import { TaxesEditionComponent } from './taxes-edition/taxes-edition.component';
import { TaxesTableComponent } from './taxes-edition/taxes-table.component';
import { TaxAssignerComponent } from './taxes-edition/tax-assigner.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,
  ],
  declarations: [
    TaxesEditionComponent,
    TaxesTableComponent,
    TaxAssignerComponent,
  ],
  exports: [
    TaxesEditionComponent,
  ]
})
export class TaxesModule { }
