/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularMaterialModule } from '../angular-material.module';

import { SharedPipesModule } from '../pipes/shared-pipes.module';

import { CardComponent } from './card/card.component';

import { MessageBoxComponent } from './message-box/message-box.component';
import { MessageBoxService } from './message-box/message.box.service';

import { ModalWindowComponent } from './modal-window/modal-window';
import { ExpansionButtonComponent } from './expansion-button/expansion-button.component';
import { AlertService } from './alert/alert.service';


@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    SharedPipesModule
  ],
  declarations: [
    CardComponent,
    MessageBoxComponent,
    ModalWindowComponent,
    ExpansionButtonComponent
  ],
  exports: [
    CardComponent,
    MessageBoxComponent,
    ModalWindowComponent,
    ExpansionButtonComponent
  ],
  providers: [
    AlertService,
    MessageBoxService,
  ]
})
export class SharedContainersModule { }
