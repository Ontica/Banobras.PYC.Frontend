/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DefaultComponent } from './default-component/default.component';
import { GalleryComponent } from './gallery/gallery.component';


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    DefaultComponent,
    GalleryComponent,
  ],
  exports: [
    DefaultComponent,
    GalleryComponent,
  ],
})
export class SharedComponentsModule { }
