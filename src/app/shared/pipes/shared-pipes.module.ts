/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DateTimeFormatPipe } from './date-time-format.pipe';
import { DecimalFormatPipe } from './decimal-format.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { SafeUrlPipe } from './safe-url.pipe';
import { TimeFormatPipe } from './time-format.pipe';


@NgModule({

  imports: [
    CommonModule,
  ],

  declarations: [
    DateTimeFormatPipe,
    DecimalFormatPipe,
    SafeHtmlPipe,
    SafeUrlPipe,
    TimeFormatPipe
  ],

  exports: [
    DateTimeFormatPipe,
    DecimalFormatPipe,
    SafeHtmlPipe,
    SafeUrlPipe,
    TimeFormatPipe
  ],


})
export class SharedPipesModule { }
