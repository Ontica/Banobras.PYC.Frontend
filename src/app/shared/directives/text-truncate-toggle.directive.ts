/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Directive, ElementRef, HostListener, Input, OnChanges } from '@angular/core';


@Directive({
  selector: '[empNgTextTruncateToggle]'
})
export class EmpTextTruncateToggleDirective implements OnChanges {

  @Input() maxLines = 4;

  @Input() text!: string;

  private expanded = false;


  constructor(private el: ElementRef) { }


  ngOnChanges() {
    this.expanded = false;
    this.applyState();
  }


  @HostListener('click')
  toggle() {
    this.expanded = !this.expanded;
    this.applyState();
  }


  private applyState() {
    this.el.nativeElement.style.setProperty('--max-lines', `${this.maxLines}`);

    if (this.expanded) {
      this.el.nativeElement.classList.remove('text-truncate');
      this.el.nativeElement.removeAttribute('title');
    } else {
      this.el.nativeElement.classList.add('text-truncate');
      this.el.nativeElement.setAttribute('title', this.text ?? '');
    }
  }

}
