/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpAutofocusDirective } from './auto-focus.directive';
import { EmpContextMenuDisabledDirective } from './context-menu-disabled.directive';
import { EmpCurrencyDirective } from './currency.directive';
import { EmpFormKeyDownEnterDirective } from './form-keydown-enter.directive';
import { EmpFractionDirective } from './fraction.directive';
import { EmpHasPermissionDirective } from './has-permission.directive';
import { EmpInputKeysDirective } from './input-keys.directive';
import { EmpIntegerDirective } from './integer.directive';
import { EmpNumerationDirective } from './numeration.directive';
import { EmpPreventDefaultDirective } from './prevent-default.directive';
import { EmpResizableDirective } from './resizable.directive';
import { EmpStopPropagationDirective } from './stop-propagation.directive';
import { EmpTextareaAutoresizeDirective } from './text-area-autoresize.directive';
import { EmpTextTruncateToggleDirective } from './text-truncate-toggle.directive';


@NgModule({

  imports: [
    CommonModule,
  ],

  declarations: [
    EmpAutofocusDirective,
    EmpContextMenuDisabledDirective,
    EmpCurrencyDirective,
    EmpFormKeyDownEnterDirective,
    EmpFractionDirective,
    EmpHasPermissionDirective,
    EmpInputKeysDirective,
    EmpIntegerDirective,
    EmpNumerationDirective,
    EmpPreventDefaultDirective,
    EmpResizableDirective,
    EmpStopPropagationDirective,
    EmpTextareaAutoresizeDirective,
    EmpTextTruncateToggleDirective,
  ],

  exports: [
    EmpAutofocusDirective,
    EmpContextMenuDisabledDirective,
    EmpCurrencyDirective,
    EmpFormKeyDownEnterDirective,
    EmpFractionDirective,
    EmpHasPermissionDirective,
    EmpInputKeysDirective,
    EmpIntegerDirective,
    EmpNumerationDirective,
    EmpPreventDefaultDirective,
    EmpResizableDirective,
    EmpStopPropagationDirective,
    EmpTextareaAutoresizeDirective,
    EmpTextTruncateToggleDirective,
  ],

})
export class SharedDirectivesModule { }
