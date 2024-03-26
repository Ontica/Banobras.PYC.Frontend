/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Directive, ElementRef, HostListener, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';


@Directive({
  selector: 'input[empNgInteger]'
})
export class EmpIntegerDirective {

  constructor(private el: ElementRef,
              @Optional() private control: NgControl) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this.el.nativeElement.value;
    const formattedValue = initalValue.replace(/[^0-9]*/g, '');

    this.setValue(formattedValue);

    if (initalValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }

  setValue(value) {
    if (this.control?.control) {
      this.control.control.setValue(value);
    } else {
      this.el.nativeElement.value = value;
    }
  }

}
