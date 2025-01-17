/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, forwardRef } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { FormatLibrary } from '@app/shared/utils';


@Component({
  selector: 'emp-ng-input-numeric',
  templateUrl: 'input-numeric.component.html',
  styleUrls: ['input-numeric.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumericComponent),
      multi: true
    },
  ]
})
export class InputNumericComponent implements ControlValueAccessor {

  @ViewChild('input') inputField: ElementRef;

  @Input() id: string;

  @Input() minDecimals = 2;

  @Input() maxDecimals = 2;

  @Input() showError = false;

  @Input() noMargin = false;

  @Input() placeholder = '';

  @Input() format: 'decimal' | 'percent' = 'decimal';

  @Output() valueChange = new EventEmitter<number>();

  @Output() keyupEnter = new EventEmitter<number>();

  @Output() keyupEscape = new EventEmitter<void>();

  disabled = false;

  formattedValue = '';

  propagateChange = (_: any) => { };

  propagateTouch = () => { };


  onBlur() {
    this.propagateTouch();
  }


  onInputChange(newValue: string) {
    const numericValue = this.getNumericValue(newValue);
    this.setFormattedValue(numericValue);

    this.propagateChange(numericValue);
    this.valueChange.emit(numericValue);
    this.onBlur();
  }


  onKeyupEnter(value) {
    this.keyupEnter.emit(value);
  }


  onKeyupScape() {
    this.keyupEscape.emit();
  }


  writeValue(value: any): void {
    this.setFormattedValue(value);
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }


  registerOnTouched(fn: any) {
    this.propagateTouch = fn;
  }


  setDisabledState?(isDisabled: boolean) {
    this.disabled = isDisabled;
  }


  private getNumericValue(value: any) {
    return value === null || value === undefined || value === '' ?
      null :
      parseFloat(FormatLibrary.stringToNumber(value).toFixed(this.maxDecimals));
  }


  private setFormattedValue(value: any) {
    const formatted =  value === null || value === undefined || value === '' ? null :
      FormatLibrary.numberWithCommas(value, `1.${this.minDecimals}-${this.maxDecimals}`);

    this.formattedValue = this.format === 'percent' && formatted !== null ? formatted + '%' : formatted;
  }

}
