/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpContextMenuDisabledDirective } from './context-menu-disabled.directive';
import { EmpCurrencyDirective } from './currency.directive';
import { EmpFormKeyDownEnterDirective } from './form-keydown-enter.directive';
import { EmpFractionDirective } from './fraction.directive';
import { EmpHasPermissionDirective } from './has-permission.directive';
import { EmpInputKeysDirective } from './input-keys.directive';
import { EmpIntegerDirective } from './integer.directive';
import { EmpNumerationDirective } from './numeration.directive';
import { EmpResizableDirective } from './resizable.directive';
import { EmpTextareaAutoresizeDirective } from './text-area-autoresize.directive';


@NgModule({

  imports: [
    CommonModule,
  ],

  declarations: [
    EmpContextMenuDisabledDirective,
    EmpCurrencyDirective,
    EmpFormKeyDownEnterDirective,
    EmpFractionDirective,
    EmpHasPermissionDirective,
    EmpInputKeysDirective,
    EmpIntegerDirective,
    EmpNumerationDirective,
    EmpResizableDirective,
    EmpTextareaAutoresizeDirective,
  ],

  exports: [
    EmpContextMenuDisabledDirective,
    EmpCurrencyDirective,
    EmpFormKeyDownEnterDirective,
    EmpFractionDirective,
    EmpHasPermissionDirective,
    EmpInputKeysDirective,
    EmpIntegerDirective,
    EmpNumerationDirective,
    EmpResizableDirective,
    EmpTextareaAutoresizeDirective,
  ],

  providers: [

  ],

})
export class SharedDirectivesModule { }
