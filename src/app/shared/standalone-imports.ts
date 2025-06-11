/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from '@app/shared/angular-material.module';

import { SharedModule } from '@app/shared/shared.module';


export const STANDALONE_IMPORTS = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,

  AngularMaterialModule,
  SharedModule,
];
