/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Directive, ElementRef, HostListener, Input, OnChanges, Optional } from '@angular/core';

import { CurrencyPipe } from '@angular/common';

import { NgControl } from '@angular/forms';


@Directive({
  selector: 'input[empNgCurrency]'
})
export class EmpCurrencyDirective implements OnChanges {

  @Input() empNgCurrencyCode = 'MXN';

  @Input() empNgCurrencyDisplaySymbol: 'symbol-narrow' | '' = '';

  @Input() empNgCurrencyFractionDigitMin = 2;

  @Input() empNgCurrencyFractionDigitMax = 2;

  constructor(private el: ElementRef,
              private currencyPipe: CurrencyPipe,
              @Optional() private control: NgControl) { }


  ngOnChanges() {
    this.format();
  }


  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this.el.nativeElement.value;
    const formattedValue = initalValue.replace(/[^0-9.,$€]*/g, '');

    this.setValue(formattedValue);

    if (initalValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }


  @HostListener('focusout', ['$event']) onBlur() {
    this.format();
  }


  @HostListener('keydown', ['$event']) onKeyDown(event) {
    if (event.keyCode === 13) {
      this.format();
    }
  }


  format() {
    const initalValue = this.el.nativeElement.value;

    const numberValue = parseFloat(String(initalValue).replace(/[,$€]*/g, ''));

    const digitsInfo = `1.${this.empNgCurrencyFractionDigitMin}-${this.empNgCurrencyFractionDigitMax}`;

    const formattedValue = this.currencyPipe.transform(numberValue,
                                                       this.empNgCurrencyCode,
                                                       this.empNgCurrencyDisplaySymbol,
                                                       digitsInfo);

    this.setValue(formattedValue);
  }


  setValue(value) {
    if (this.control?.control) {
      this.control.control.setValue(value);
    } else {
      this.el.nativeElement.value = value;
    }
  }

}
