/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input,
         OnInit, Output } from '@angular/core';

import * as moment from 'moment';

interface MonthData {
  month: number;
  monthName: string;
  monthYear: number;
  isInRange: boolean;
  isLowerEdge: boolean;
  isUpperEdge: boolean;
  isCurrentMonth: boolean;
}

interface RangeIndex {
  startIndex: number;
  endIndex: number;
}

export interface MonthRange {
  startMonthDate: moment.Moment;
  endMonthDate: moment.Moment;
}

@Component({
  selector: 'emp-ng-month-picker',
  templateUrl: 'month-picker.component.html',
  styleUrls: ['month-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthPickerComponent implements OnInit {

  @Input() rangeYearsToShow = 50;

  @Input() showMonthsPrevious = false;

  @Output() monthRangeSelected = new EventEmitter<MonthRange>();

  years: number[];

  months: string[];

  monthViewSlicesIndexes: number[];

  monthsData: MonthData[];

  monthDataSlice: MonthData[];

  rangeIndexes: RangeIndex = { startIndex: null, endIndex: null };

  selectedYearIndex: number;

  currentMonthIndex: number;

  globalIndexOffset: number;

  focusMonthIndex: number;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.initYearLabels();
    this.initMonthLabels();
    this.initMonthViewSlicesIndexes();
    this.resetRange();
  }


  incrementYear() {
    if (this.selectedYearIndex !== this.years.length - 1) {
      this.selectedYearIndex++;
      this.sliceDataIntoView();
    }
  }


  decrementYear() {
    if (this.selectedYearIndex !== 0) {
      this.selectedYearIndex--;
      this.sliceDataIntoView();
    }
  }


  onMonthClicked(indexClicked) {
    if (this.rangeIndexes.startIndex !== null && this.rangeIndexes.endIndex !== null) {
      this.clearRangeSelection();
    }

    if (this.rangeIndexes.startIndex === null) {
      this.rangeIndexes.startIndex = this.calculateMonthIndex(indexClicked);
      return;
    }

    if (this.rangeIndexes.endIndex === null) {
      this.focusMonthIndex = null;
      const endIndex = this.calculateMonthIndex(indexClicked);

      if (this.rangeIndexes.startIndex > endIndex) {
        this.rangeIndexes.startIndex = endIndex;
        return;
      }

      this.rangeIndexes.endIndex = endIndex;
      this.updateMonthDataInRange();
      this.validateEmitData();
    }
  }


  onMouseOver(index: number) {
    const currentIndex = this.calculateMonthIndex(index);

    if (this.rangeIndexes.startIndex && !this.rangeIndexes.endIndex &&
        currentIndex > this.rangeIndexes.startIndex) {
      this.focusMonthIndex = currentIndex;
    } else {
      this.focusMonthIndex = null;
    }
  }


  onMouseOut() {
    this.focusMonthIndex = null;
  }


  isMonthInEdge(index: number) {
    const monthIndex = this.calculateMonthIndex(index);
    return this.rangeIndexes.startIndex === monthIndex || this.rangeIndexes.endIndex === monthIndex;
  }

  isPreviousYearMonth(monthIndex: number) {
    if (!this.showMonthsPrevious) {
      return false;
    }

    return this.selectedYearIndex === 0 ? monthIndex > 11 : monthIndex < 6 || monthIndex > 17;
  }


  isMonthInPreview(index: number) {
    if (!this.focusMonthIndex) {
      return false;
    }

    const monthIndex = this.calculateMonthIndex(index);
    return monthIndex >= this.rangeIndexes.startIndex && this.focusMonthIndex >= monthIndex;
  }


  isMonthInStartPreview(index: number) {
    const monthIndex = this.calculateMonthIndex(index);
    return this.focusMonthIndex && monthIndex === this.rangeIndexes.startIndex;
  }


  isMonthInEndPreview(index: number) {
    const monthIndex = this.calculateMonthIndex(index);
    return this.focusMonthIndex && this.focusMonthIndex === monthIndex;
  }

  calculateMonthIndex(index: number) {
    return this.globalIndexOffset + index;
  }


  emitData(startMonthDate: moment.Moment, endMonthDate: moment.Moment) {
    this.monthRangeSelected.emit({ startMonthDate, endMonthDate });
  }


  resetRange() {
    this.initMonthsData();
    this.initRangeIndexes();
    this.initCurrentMonthAndYearIndex();
    this.sliceDataIntoView();
    this.cdr.detectChanges();
  }


  private clearRangeSelection() {
    this.initMonthsData();
    this.initRangeIndexes();
    this.sliceDataIntoView();
    this.cdr.detectChanges();
  }


  private initYearLabels() {
    const currentYear = new Date().getFullYear();
    const range = (start, stop, step) =>
      Array.from(
        { length: (stop - start) / step + 1 },
        (_, i) => start + i * step
      );
    this.years = range(currentYear - this.rangeYearsToShow, currentYear + this.rangeYearsToShow, 1);
  }


  private initMonthLabels() {
    this.months = new Array(12).fill(0).map((_, i) => {
      return new Date(`${i + 1}/1`).toLocaleDateString(undefined, {
        month: 'short'
      });
    });
  }


  private initMonthViewSlicesIndexes() {
    this.monthViewSlicesIndexes = [];
    this.years.forEach((year, index) => {
      if (index === 0) {
        this.monthViewSlicesIndexes.push(0);
      } else if (this.showMonthsPrevious && index === 1) {
        this.monthViewSlicesIndexes.push(6);
      } else {
        this.monthViewSlicesIndexes.push(this.monthViewSlicesIndexes[index - 1] + 12);
      }
    });
  }


  private initMonthsData() {
    this.monthsData = new Array();

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    this.years.forEach(year => {
      this.months.forEach((month, monthNumber) => {
        this.monthsData.push({
          month: monthNumber,
          monthName: month.toUpperCase(),
          monthYear: year,
          isInRange: false,
          isLowerEdge: false,
          isUpperEdge: false,
          isCurrentMonth: year === currentYear && monthNumber === currentMonth,
        });
      });
    });
  }


  private initRangeIndexes() {
    this.rangeIndexes = { startIndex: null, endIndex: null };
  }


  private initCurrentMonthAndYearIndex() {
    this.selectedYearIndex = this.years.findIndex(year => year === new Date().getFullYear());
  }


  private sliceDataIntoView() {
    this.globalIndexOffset = this.monthViewSlicesIndexes[this.selectedYearIndex];
    this.monthDataSlice = this.monthsData.slice(
      this.globalIndexOffset,
      this.calculateMonthIndex(this.showMonthsPrevious ? 24 : 12)
    );
  }


  private updateMonthDataInRange() {
    this.monthsData.forEach((month, index) => {
      if (this.rangeIndexes.startIndex <= index && index <= this.rangeIndexes.endIndex) {
        month.isInRange = true;
      }
      if (this.rangeIndexes.startIndex === index) {
        month.isLowerEdge = true;
      }
      if (this.rangeIndexes.endIndex === index) {
        month.isUpperEdge = true;
      }
    });
  }


  private validateEmitData() {
    const fromMonthYear = this.monthsData[this.rangeIndexes.startIndex];
    const toMonthYear = this.monthsData[this.rangeIndexes.endIndex];

    const startMonth =
      this.getMomentDateFromParts(1, fromMonthYear.month, fromMonthYear.monthYear).startOf('month');
    const endMonth = this.getMomentDateFromParts(1, toMonthYear.month, toMonthYear.monthYear).endOf('month');

    this.emitData(startMonth, endMonth);
  }


  private getMomentDateFromParts(date: number, month: number, year: number) {
    return moment().date(date).month(month).year(year);
  }

}
