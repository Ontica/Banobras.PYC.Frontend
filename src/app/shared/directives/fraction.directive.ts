/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Directive, ElementRef, HostListener, OnChanges, Optional } from '@angular/core';

import { NgControl } from '@angular/forms';


@Directive({
  selector: 'input[empNgFraction]'
})
export class EmpFractionDirective implements OnChanges {

  pattern: RegExp = new RegExp(/\s*(\d+|[/+*-])/g);

  constructor(private el: ElementRef,
              @Optional() private control: NgControl) { }


  ngOnChanges() {
    this.format();
  }


  @HostListener('input', ['$event']) onInputChange(event) {
    this.format();
  }


  @HostListener('focusout', ['$event']) onBlur() {
    this.format();
  }


  @HostListener('keydown', ['$event']) onKeyDown(event) {
    if (event.keyCode === 13) {
      this.format();
    }
  }


  private format() {
    const initalValue = this.el.nativeElement.value;
    const validValue = initalValue.replace(/[^0-9\/]*/g, '');
    const formattedValue = validValue.split('/').slice(0, 2).join('/');
    this.setValue(formattedValue);
  }


  private setValue(value) {
    if (this.control?.control) {
      this.control.control.setValue(value);
    } else {
      this.el.nativeElement.value = value;
    }
  }

}
