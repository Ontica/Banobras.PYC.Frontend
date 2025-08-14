/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Directive, ElementRef, HostListener, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[empNgTextTruncateToggle]'
})
export class EmpTextTruncateToggleDirective implements OnChanges {

  @Input() maxLines = 4;

  @Input() text!: string;

  private expanded = false;


  constructor(private el: ElementRef, private renderer: Renderer2) {}

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
    this.renderer.setStyle(this.el.nativeElement, '--max-lines', this.maxLines);
    if (this.expanded) {
      this.renderer.removeClass(this.el.nativeElement, 'text-truncate');
      this.el.nativeElement.title = '';
    } else {
      this.renderer.addClass(this.el.nativeElement, 'text-truncate');
      this.el.nativeElement.title = this.text;
    }
  }
}
