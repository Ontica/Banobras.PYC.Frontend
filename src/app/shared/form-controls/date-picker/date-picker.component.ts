/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { DateString, DateStringLibrary } from '@app/core/data-types/date-string-library';


@Component({
  selector: 'emp-ng-datepicker',
  templateUrl: 'date-picker.component.html',
  styleUrls: ['date-picker.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DatePickerComponent), multi: true },
  ]
})
export class DatePickerComponent implements ControlValueAccessor {

  @Output() valueChange = new EventEmitter<DateString>();

  @Input()
  get value(): DateString { return this.date; }
  set value(value: DateString) {
    this.writeValue(value);
  }

  @Input() showError = false;

  @Input() minDate = null;

  @Input() maxDate = null;

  disabled = false;
  date: Date;

  propagateChange = (_: any) => { };
  propagateTouch = () => { };


  onChange(value: any) {
    this.validateChange(value);
  }


  onInputChange(value: any) {
    this.validateChange(value);
  }

  onBlur() {
    this.propagateTouch();
  }


  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }


  registerOnTouched(fn: any): void {
    this.propagateTouch = fn;
  }


  setDisabledState?(isDisabled: boolean): void {
    if (this.disabled === isDisabled) {
      return;
    }
    this.disabled = isDisabled;
  }


  writeValue(obj: any): void {
    if (obj) {
      this.date = this.getDateInputValue(obj);
      if (!this.date) {
        console.log(`Invalid date value received in calendar component: '${obj}'.`);
      }
    } else {
      this.date = null;
    }
  }


  // private methods

  private validateChange(value: any) {
    if (value) {
      let date = this.validateMinAndMaxDate(value);
      date = this.getDateInputValue(date);

      this.setDateAndPropagateChanges(date);
    } else {
      this.setDateAndPropagateChanges(null);
    }
  }


  private getDateInputValue(obj: any): Date {
    return DateStringLibrary.validateDateValue(obj);
  }


  private validateMinAndMaxDate(dateValue) {
    if (this.minDate && this.isDateLessThanMinDate(dateValue)) {
      return this.minDate;
    }

    if (this.maxDate && this.isDateGreaterThanMaxDate(dateValue)) {
      return this.maxDate;
    }

    return dateValue;
  }


  private isDateLessThanMinDate(dateValue: DateString): boolean {
    return !dateValue || DateStringLibrary.compareDates(dateValue, this.minDate) === -1;
  }


  private isDateGreaterThanMaxDate(dateValue: DateString): boolean {
    return !dateValue || DateStringLibrary.compareDates(dateValue, this.maxDate) === 1;
  }


  private setDateAndPropagateChanges(value: Date) {
    if (!this.minDate && value && DateStringLibrary.compareDates(this.date, value) === 0) {
      return;
    }

    this.date = value;

    const emittedValue = DateStringLibrary.datePart(this.date);

    this.valueChange.emit(emittedValue);
    this.propagateChange(emittedValue);
  }

}
