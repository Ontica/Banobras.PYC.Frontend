/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { AbstractControl, FormControl, FormGroup } from '@angular/forms';


export class FormHelper {

  static isFormReady(form: FormGroup<any>): boolean {
    return form.valid && form.dirty;
  }


  static isControlInvalid(control: FormControl<any> | AbstractControl<any>): boolean {
    return control.enabled && control.invalid && (control.dirty || control.touched);
  }


  static isFormReadyAndInvalidate(form: FormGroup<any>): boolean {
    const isReady = this.isFormReady(form);
    if (!isReady) {
      this.markFormControlsAsTouched(form);
    }
    return isReady;
  }


  static markFormControlsAsTouched(form: FormGroup<any>) {
    Object.keys(form.controls).forEach(key => {
      const control = form.controls[key];
      control.markAsTouched({ onlySelf: true });
    });
  }


  static setControlValidators(control: FormControl<any>, validator: any | any[]) {
    control.clearValidators();
    control.setValidators(validator);
    control.updateValueAndValidity();
  }


  static clearControlValidators(control: FormControl<any>) {
    control.clearValidators();
    control.updateValueAndValidity();
  }


  static setDisableForm(form: FormGroup<any>, disable: boolean = true) {
    if (disable) {
      form.disable();
    } else {
      form.enable();
    }
  }

  static setDisableControl(control: FormControl<any>, disable: boolean = true) {
    if (disable) {
      control.disable();
    } else {
      control.enable();
    }
  }

}
