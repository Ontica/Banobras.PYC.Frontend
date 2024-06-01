/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnInit, forwardRef } from '@angular/core';

import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR,
         Validators } from '@angular/forms';

import { FormFieldData, FormFieldDataType } from '@app/models';

@Component({
  selector: 'emp-ng-dynamic-form-control',
  templateUrl: './dynamic-form-control.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynamicFormControlComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DynamicFormControlComponent),
      multi: true
    }
  ]
})

export class DynamicFormControlComponent implements ControlValueAccessor, OnInit {

  @Input() config: FormFieldData;

  formControl: FormControl;

  onChange: any = () => { };

  onTouched: any = () => { };

  controlType = FormFieldDataType;


  ngOnInit() {
    this.formControl = new FormControl(this.config.value || '', this.getValidators());

    this.formControl.valueChanges.subscribe(value => {
      this.onChange(value);
      this.onTouched();
    });
  }


  get showError(): boolean {
    return this.formControl.invalid;
  }


  getValidators() {
    const validators = [];
    if (this.config.required) {
      validators.push(Validators.required);
    }

    return validators;
  }


  writeValue(value: any) {
    if (value) {
      this.formControl.setValue(value, { emitEvent: false });
    }
  }


  registerOnChange(fn: any) {
    this.onChange = fn;
  }


  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }


  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }


  validate() {
    return this.formControl.valid ? null : { invalidForm: { valid: false, message: 'form fields are invalid' } };
  }

}
