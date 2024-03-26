/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { PresentationLayer } from './presentation-layer';
import { PresentationState } from './presentation.state';

import { StateHandlersModule } from '@app/presentation/state.handlers.module';


@NgModule({

  imports: [
    StateHandlersModule
  ],

  providers: [
    PresentationLayer,
    PresentationState
  ]

})
export class PresentationModule { }
