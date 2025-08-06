/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { SearchServicesModule } from '../search-services/search-services.module';

import { SearchToolComponent } from './search-tool/search-tool.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SearchServicesModule,
  ],
  declarations: [
    SearchToolComponent,
  ],
  exports: [
    SearchToolComponent,
  ],
})
export class ToolsModule { }
