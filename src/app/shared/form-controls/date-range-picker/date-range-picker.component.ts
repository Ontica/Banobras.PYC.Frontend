/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output, forwardRef, ViewChild, ElementRef, OnChanges,
         SimpleChanges } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MatDateRangePicker } from '@angular/material/datepicker';

import * as moment from 'moment';

import { Moment } from 'moment';

import { DateString, DateStringLibrary } from '@app/core/data-types/date-string-library';

import { MonthPickerComponent, MonthRange } from './month-picker/month-picker.component';

import { Identifiable } from '@app/core';

enum SelectionType {
  day = 'Selección por día',
  month = 'Selección por mes',
  year = 'Selección por año'
}

function getIdentifiableListFromEnum(enumObject): Identifiable[] {
  return Object.keys(enumObject)
        .map(key => Object.assign({uid: key, name: enumObject[key]}) );
}

@Component({
  selector: 'emp-ng-date-range-picker',
  templateUrl: 'date-range-picker.component.html',
  styleUrls: ['date-range-picker.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DateRangePickerComponent), multi: true },
  ]
})
export class DateRangePickerComponent implements ControlValueAccessor, OnChanges {

  @ViewChild(MatDateRangePicker, {static: false}) picker: MatDateRangePicker<Moment>;

  @ViewChild(MonthPickerComponent, {static: false}) monthPicker: MonthPickerComponent;

  @ViewChild('appendedContainer', {static: false}) appendedContainer: ElementRef;

  @Input() bindValueStartDate = 'fromDate';

  @Input() bindValueEndDate = 'toDate';

  @Input() showError = false;

  @Input() displaySelectionType = true;

  @Input()
  get value(): any {
    return Object.assign({}, this.completeValue, {
        [this.bindValueStartDate]: this.startDate,
        [this.bindValueEndDate]: this.endDate
      });
  }

  set value(value: any) {
    this.writeValue(value);
  }

  @Input() startDate: DateString;

  @Input() endDate: DateString;

  @Input() comparisonStartDate: DateString;

  @Input() comparisonEndDate: DateString;

  @Input() minDate = null;

  @Input() maxDate = null;

  @Input() fixedEndDate = null;

  @Output() valueChange = new EventEmitter<any>();

  @Output() startDateChange = new EventEmitter<any>();

  @Output() endDateChange = new EventEmitter<any>();

  completeValue: any;

  disabled = false;

  selectionTypeList: Identifiable[] = getIdentifiableListFromEnum(SelectionType);

  selectedSelectionType = SelectionType.day;

  selectedPickerView: 'month' | 'year' | 'multi-year' = 'month';

  selectRangeClicked = false;

  propagateChange = (_: any) => { };

  propagateTouch = () => { };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.startDate && changes.endDate &&
        !changes.startDate.currentValue && !changes.endDate.currentValue) {
      this.clearMonthPicker();
    }
  }


  get isMonthSelection() {
    return this.displaySelectionType && this.selectedSelectionType === SelectionType.month;
  }


  get isYearSelection() {
    return this.displaySelectionType && this.selectedSelectionType === SelectionType.year;
  }


  onOpenedPicker() {
    this.appendFooter();
  }


  onClearDates() {
    this.setDatesAndPropagateChanges(null, null);
    this.clearMonthPicker();
  }


  onInputsChange(startDateValue: string, endDateValue: string) {
    this.validateChange(startDateValue, endDateValue);
    if (!!startDateValue || !!endDateValue) {
      this.selectedPickerView = 'month';
      this.selectedSelectionType = SelectionType.day;
    }
  }


  onChange(startDateValue: string, endDateValue: string) {
    this.validateChange(startDateValue, endDateValue);
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
      this.completeValue = obj;
      this.startDate = this.getDateInputValue(obj[this.bindValueStartDate]);
      this.endDate = this.getDateInputValue(obj[this.bindValueEndDate]);

      if (!this.startDate || !this.endDate) {
        console.log(`Invalid date value received in calendar component: '${obj}'.`);
      }
    } else {
      this.completeValue = null;
      this.startDate = null;
      this.endDate = null;
    }
  }


  getDateForComparison(date: DateString): any {
    return date ? moment(date) : null;
  }


  onViewChanged(view) {
    if (this.selectRangeClicked) {
      this.selectRangeClicked = false;
    }
  }


  onSelectionTypeChanges(event) {
    switch (event) {
      case this.selectionTypeList[0]:
        this.selectedPickerView = 'month';
        break;

      case this.selectionTypeList[1]:
        this.selectedPickerView = 'year';
        break;

      case this.selectionTypeList[2]:
      default:
        this.selectedPickerView = 'multi-year';
        break;
    }
    this.validateChange(null, null);
    this.resetDatePicker();
  }


  onMonthsSelected(rangeOfMonths: MonthRange) {
    if (this.isMonthSelection) {
      const startOfMonth = DateStringLibrary.mapDateStringFromMoment(rangeOfMonths.startMonthDate);
      const endOfMonth = DateStringLibrary.mapDateStringFromMoment(rangeOfMonths.endMonthDate);
      this.validateChangeMonthOrYearRange(startOfMonth, endOfMonth);
    }
  }


  onYearSelected(normalizedYear: Moment) {
    if (this.isYearSelection) {
      const startOfYear = DateStringLibrary.mapDateStringFromMoment(normalizedYear.startOf('year'));
      const endOfYear = DateStringLibrary.mapDateStringFromMoment(normalizedYear.endOf('year'));
      this.validateChangeMonthOrYearRange(startOfYear, endOfYear);
    }
  }




  private appendFooter() {
    const matCalendar = document.getElementsByClassName('mat-datepicker-content')[0] as HTMLElement;
    matCalendar.appendChild(this.appendedContainer.nativeElement);
  }


  private clearMonthPicker() {
    if (this.isMonthSelection && this.monthPicker) {
      this.monthPicker.resetRange();
    }
  }


  private resetDatePicker() {
    this.picker.close();
    setTimeout(() => this.picker.open(), 250);
  }


  private validateChangeMonthOrYearRange(startDateValue: DateString, endDateValue: DateString) {
    this.selectRangeClicked = true;
    this.validateChange(startDateValue, endDateValue);
    this.picker.close();
  }


  private validateChange(startDateValue, endDateValue) {
    if (!startDateValue && !endDateValue) {
      this.setDatesAndPropagateChanges(null, null);
    } else {
      if (this.fixedEndDate) {
        startDateValue = this.validateFixedStartDate(startDateValue);
        endDateValue = this.validateFixedEndDate(endDateValue);
      }

      const startDate = this.getDateInputValue(startDateValue);
      const endDate = this.getDateInputValue(endDateValue);

      this.setDatesAndPropagateChanges(startDate, endDate);
    }
  }

  private validateFixedStartDate(startDateValue) {
    if (this.minDate && (!startDateValue ||
                          DateStringLibrary.compareDates(startDateValue, this.minDate) === -1) ) {
      return this.minDate;
    } else if (DateStringLibrary.compareDates(startDateValue, this.fixedEndDate) === 1){
      return this.fixedEndDate;
    }

    return startDateValue;
  }


  private validateFixedEndDate(endDateValue) {
    return this.fixedEndDate ?? endDateValue;
  }


  private getDateInputValue(obj): Date {
    return DateStringLibrary.validateDateValue(obj);
  }


  private setDatesAndPropagateChanges(startDate: Date, endDate: Date) {
    if (!this.fixedEndDate &&
        startDate && DateStringLibrary.compareDates(this.startDate, startDate) === 0 &&
        endDate && DateStringLibrary.compareDates(this.endDate, endDate) === 0) {
      return;
    }

    this.startDate = startDate;
    this.endDate = endDate;

    const emittedStartValue = DateStringLibrary.datePart(this.startDate);
    const emittedEndValue = DateStringLibrary.datePart(this.endDate);

    const emittedValue = Object.assign({}, this.value, {
      [this.bindValueStartDate]: emittedStartValue,
      [this.bindValueEndDate]: emittedEndValue
    });

    this.valueChange.emit(emittedValue);
    this.startDateChange.emit(emittedStartValue);
    this.endDateChange.emit(emittedEndValue);
    this.propagateChange(emittedValue);
  }

}
