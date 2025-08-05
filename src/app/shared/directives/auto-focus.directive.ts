/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[empNgAutofocus]'
})
export class EmpAutofocusDirective implements AfterViewInit {


  constructor(private el: ElementRef<HTMLInputElement>) { }


  ngAfterViewInit() {
    setTimeout(() => this.el.nativeElement.focus(), 0);
  }

}
