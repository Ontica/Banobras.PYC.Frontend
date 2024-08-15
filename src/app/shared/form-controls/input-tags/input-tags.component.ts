/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, forwardRef, Input, Output, ViewChild } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { NgSelectComponent } from '@ng-select/ng-select';

import { ArrayLibrary } from '@app/shared/utils';


export interface InputTagsConfig {
  splittable?: boolean;
  splitChar?: string;
}

const DefaultInputTagsConfig: InputTagsConfig = {
  splittable: true,
  splitChar: ',',
};


@Component({
  selector: 'emp-ng-input-tags',
  templateUrl: './input-tags.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTagsComponent),
      multi: true
    }
  ]
})
export class InputTagsComponent implements ControlValueAccessor {

  @ViewChild(NgSelectComponent) select: NgSelectComponent;

  @Input()
  get config() {
    return this.inputTagsConfig;
  }
  set config(value: InputTagsConfig) {
    this.inputTagsConfig = Object.assign({}, DefaultInputTagsConfig, value);
  }

  @Input() showError = false;

  @Output() clear = new EventEmitter<boolean>();

  @Output() changes = new EventEmitter<any>();

  @Output() unfocus = new EventEmitter<any>();

  inputTagsConfig = DefaultInputTagsConfig;

  tags: string[] = [];

  selectedTags: string[] = [];

  disabled: boolean;


  onChange: (value: string[]) => void;


  onTouched: (event: any) => void;


  addTagFn(name: string) {
    return { name: name, tag: true };
  }


  writeValue(tags: string[]): void {
    this.selectedTags = tags || [];
  }


  registerOnChange(fn: any): void {
    this.onChange = fn;
  }


  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }


  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }


  onInputChange(value: string[]) {
    let tags = [];

    if (value && value.length > 0) {

      if (this.inputTagsConfig.splittable) {
        value.forEach(input => {
          const splitInput = input.split(this.inputTagsConfig.splitChar)
                                  .map(tag => tag.trim())
                                  .filter(tag => tag !== '');
          tags = [...tags, ...splitInput];
        });
      } else {
        tags = value.map(x => x.trim());
      }

    }

    this.selectedTags = ArrayLibrary.getUniqueItems(tags);
    this.onChange(this.selectedTags);
    this.changes.emit(this.selectedTags);
  }


  onInputClear() {
    this.clear.emit(true);
  }


  onInputBlur(event) {
    this.select.searchTerm = '';
    this.unfocus.emit(event);
  }

}
