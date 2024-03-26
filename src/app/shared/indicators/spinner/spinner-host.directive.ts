/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Directive, ElementRef, Input } from '@angular/core';

import { SpinnerComponent } from './spinner.component';


@Directive({
  selector: '[empNgSpinnerHost]'
})
export class SpinnerHostDirective {

  @Input('empNgSpinnerHost') spinner: SpinnerComponent;

  constructor(private el: ElementRef) {
    this.el.nativeElement.style.position = 'relative';
  }

}
