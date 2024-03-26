/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularMaterialModule } from '../angular-material.module';

import { ProgressTextDirective } from './progress-text/progress-text.directive';

import { SpinnerComponent } from './spinner/spinner.component';
import { SpinnerHostDirective } from './spinner/spinner-host.directive';
import { SpinnerService } from './spinner/spinner.service';


@NgModule({

  imports: [
    CommonModule,

    AngularMaterialModule
  ],

  declarations: [
    ProgressTextDirective,
    SpinnerComponent,
    SpinnerHostDirective,
  ],

  exports: [
    ProgressTextDirective,
    SpinnerComponent,
    SpinnerHostDirective
  ],

  providers: [
    SpinnerService
  ]

})
export class SharedIndicatorsModule { }
