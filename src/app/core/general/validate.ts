/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

import { FormatLibrary } from '@app/shared/utils';

import { Assertion } from './assertion';

import { isEmpty } from '../data-types';


export class Validate {

  static hasValue(object: any): boolean {
    if (Assertion.isNullValue(object)) {
      return false;
    }
    if (Assertion.isUndefinedValue(object)) {
      return false;
    }
    if (Assertion.isNaNValue(object)) {
      return false;
    }
    if (Assertion.isEmptyString(object)) {
      return false;
    }
    if (Assertion.isEmptyObject(object)) {
      return false;
    }
    return true;
  }


  static isEmail(value: string): boolean {
    if (!this.hasValue(value)) {
      return false;
    }
    const regularExpresion = new RegExp(/^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/);
    const test = regularExpresion.test(value);
    return test;
  }


  static isTrue(value: boolean): boolean {
    return value === true;
  }


  static notNull(value: any): boolean {
    if (Assertion.isNullValue(value) || Assertion.isUndefinedValue(value) || Assertion.isEmptyObject(value)) {
      return false;
    }
    return true;
  }


  static isPositive(control: AbstractControl): ValidationErrors | null {
    if (typeof control.value === 'string' && FormatLibrary.stringToNumber(control.value) <= 0) {
      return { isPositive: true };
    }
    if (typeof control.value === 'number' && control.value <= 0) {
      return { isPositive: true };
    }
    return null;
  }


  static fractionValue(control: AbstractControl): ValidationErrors | null {
    const fractionRegex: RegExp = /[1-9][0-9]*\/[1-9][0-9]*/g;
    if (!fractionRegex.test(control.value)) {
      return { fractionValue: true };
    }
    return null;
  }


  static maxCurrencyValue(max: number): ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && (FormatLibrary.stringToNumber(control.value) > max)) {
        return { maxCurrencyValue: true };
      }
      return null;
    };
  }


  static minCurrencyValue(min: number): ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && (FormatLibrary.stringToNumber(control.value) < min)) {
        return { minCurrencyValue: true };
      }
      return null;
    };
  }


  static periodRequired(control: AbstractControl,
                        periodValidationType: 'both-dates' | 'one-date' | 'start-date' | 'end-date' = 'both-dates',
                        startDateLabel: string = 'fromDate',
                        endDateLabel: string = 'toDate'): ValidationErrors | null {
    let periodRequired = false;

    if (control.value) {
      const hasStartDate = !!control.value[startDateLabel];
      const hasEndDate = !!control.value[endDateLabel];

      switch (periodValidationType) {
        case 'one-date':
          periodRequired = !hasStartDate && !hasEndDate;
          break;
        case 'start-date':
          periodRequired = !hasStartDate;
          break;
        case 'end-date':
          periodRequired = !hasEndDate;
          break;
        case 'both-dates':
        default:
          periodRequired = !hasStartDate || !hasEndDate;
          break;
      }
    }
    return periodRequired ? { periodRequired } : null;
  }


  static changeRequired(initialValue: any): ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      if (typeof control.value === 'boolean' && control.value === initialValue) {
        return { changeRequired: true };
      }

      if (control.value && control.value === initialValue) {
        return { changeRequired: true };
      }

      if (Array.isArray(control.value) && Array.isArray(initialValue) &&
          initialValue.length === control.value.length &&
          initialValue.every(x => control.value.includes(x))) {
        return { changeRequired: true };
      }

      return null;
    };
  }


  static objectFieldsRequired(...fields: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value) {
        let errors: ValidationErrors = {};

        fields.forEach(field => {
          if (isEmpty(control.value[field])) {
            errors[`${field}Error`] = true;
          }
        });

        return Object.keys(errors).length ? errors : null;
      }
      return null;
    };
  }


  static hasNumber(control: AbstractControl): ValidationErrors | null {
    const hasNumber = /\d/.test(control.value);
    if (!hasNumber) {
      return { hasNumber: true };
    }
    return null;
  }


  static hasUpper(control: AbstractControl): ValidationErrors | null {
    const hasUpper = /[A-Z]/.test(control.value);
    if (!hasUpper) {
      return { hasUpper: true };
    }
    return null;
  }


  static hasLower(control: AbstractControl): ValidationErrors | null {
    const hasLower = /[a-z]/.test(control.value);
    if (!hasLower) {
      return { hasLower: true };
    }
    return null;
  }


  static hasSpecialCharacters(control: AbstractControl): ValidationErrors | null {
    const hasSpecialCharacters = /[-+=_.,:;~`!@#$%^&*(){}<>\[\]"'\/\\]/.test(control.value);
    if (!hasSpecialCharacters) {
      return { hasSpecialCharacters: true };
    }
    return null;
  }


  static matchOther(controlName: string, matchingControlName: string): ValidatorFn {
    return (formGroup: FormGroup<any>) => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);

      if (!control || !matchingControl || !matchingControl.value) {
        return null;
      }

      if (control.value !== matchingControl.value) {
        return { matchOther: true };
      }

      return null;
    };
  }

}
