/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from '../angular-material.module';

import { QuillModule } from 'ngx-quill';
import { NgSelectModule } from '@ng-select/ng-select';

import { SharedDirectivesModule } from '../directives/shared-directives.module';
import { SharedPipesModule } from '../pipes/shared-pipes.module';
import { SharedContainersModule } from '../containers/shared-containers.module';
import { IconSvgModule } from '../icon-svg.module';

import { ButtonCopyToClipboardComponent } from './button-copy-to-clipboard/button-copy-to-clipboard.component';
import { CheckboxAllComponent } from './check-box-all/check-box-all.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { DateRangePickerComponent } from './date-range-picker/date-range-picker.component';
import { DynamicFormControlComponent } from './dynamic-form/dynamic-form-control.component';
import { FileControlComponent } from './file-control/file-control.component';
import { FilePrintPreviewComponent } from './file-print-preview/file-print-preview.component';
import { InputNumericComponent } from './input-numeric/input-numeric.component';
import { MenuComponent } from './menu/menu.component';
import { MonthPickerComponent } from './date-range-picker/month-picker/month-picker.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { SelectBoxComponent } from './select-box/select-box.component';
import { SelectBoxTypeaheadComponent } from './select-box-typeahead/select-box-typeahead.component';
import { TextEditorComponent } from './text-editor/text-editor.component';


@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,

    QuillModule.forRoot(),
    NgSelectModule,

    SharedDirectivesModule,
    SharedPipesModule,
    SharedContainersModule,
    IconSvgModule,
  ],

  declarations: [
    ButtonCopyToClipboardComponent,
    CheckboxAllComponent,
    DatePickerComponent,
    DateRangePickerComponent,
    DynamicFormControlComponent,
    FileControlComponent,
    FilePrintPreviewComponent,
    InputNumericComponent,
    MenuComponent,
    MonthPickerComponent,
    SearchBoxComponent,
    SelectBoxComponent,
    SelectBoxTypeaheadComponent,
    TextEditorComponent,
  ],

  exports: [
    ButtonCopyToClipboardComponent,
    CheckboxAllComponent,
    DatePickerComponent,
    DateRangePickerComponent,
    DynamicFormControlComponent,
    FileControlComponent,
    FilePrintPreviewComponent,
    InputNumericComponent,
    MenuComponent,
    SearchBoxComponent,
    SelectBoxComponent,
    SelectBoxTypeaheadComponent,
    TextEditorComponent,
  ]

})
export class SharedFormControlsModule { }
