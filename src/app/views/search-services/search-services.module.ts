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

import { RecordSearchComponent } from './record-search/record-search.component';
import { RecordSearchFilterComponent } from './record-search/record-search-filter.component';
import { RecordSearchListComponent } from './record-search/record-search-list.component';
import { RecordSearchListItemComponent } from './record-search/record-search-list-item.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,
  ],
  declarations: [
    RecordSearchComponent,
    RecordSearchFilterComponent,
    RecordSearchListComponent,
    RecordSearchListItemComponent,
  ],
  exports: [
    RecordSearchComponent,
  ]
})
export class SearchServicesModule { }
