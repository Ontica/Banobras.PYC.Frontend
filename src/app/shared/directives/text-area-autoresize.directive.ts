/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Directive, HostListener, ElementRef, OnInit, Input } from '@angular/core';

import { FormatLibrary } from '../utils';


@Directive({
  selector: '[empNgTextareaAutoresize]'
})
export class EmpTextareaAutoresizeDirective implements OnInit {

  @Input() maxHeightTextarea = 72;

  constructor(private elementRef: ElementRef) { }


  ngOnInit() {
    this.validateResize();
  }


  @HostListener('ngModelChange', ['$event'])
  ngModelChange() {
    this.validateResize();
  }


  @HostListener(':input')
  onInput() {
    this.resize();
  }


  private validateResize() {
    const maxHeight = !!this.maxHeightTextarea ? this.maxHeightTextarea + 'px' : '';
    this.elementRef.nativeElement.style.maxHeight = maxHeight;

    if (this.elementRef.nativeElement.scrollHeight) {
      setTimeout(() => this.resize());
    }
  }


  private resize() {
    const currentHeight = FormatLibrary.stringToNumber(this.elementRef.nativeElement.style.height);
    if (!!this.maxHeightTextarea && currentHeight >= this.maxHeightTextarea) {
      this.elementRef.nativeElement.style.overflow = 'auto';
      this.elementRef.nativeElement.style.height = this.maxHeightTextarea + 'px';
    } else {
      this.elementRef.nativeElement.style.overflow = 'hidden';
      this.elementRef.nativeElement.style.height = 'auto';
      this.elementRef.nativeElement.style.height = this.elementRef.nativeElement.scrollHeight + 'px';
    }
  }

}
