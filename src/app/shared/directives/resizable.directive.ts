/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[empNgResizable]'
})

export class EmpResizableDirective {

  @Input() empNgResizableGrabWidth = 8;

  @Input() empNgResizableMinWidth = 400;

  dragging = false;

  private newWidth = (wid) => {
    const newWidthSize = Math.max(this.empNgResizableMinWidth, wid);
    this.el.nativeElement.style.width = (newWidthSize) + 'px';
  };

  private mouseMoveG = (evt) => {
    if (!this.dragging) {
      return;
    }
    this.newWidth(evt.clientX - this.el.nativeElement.offsetLeft);
    evt.stopPropagation();
  };

  private mouseUpG = (evt) => {
    if (!this.dragging) {
      return;
    }
    this.restoreGlobalMouseEvents();
    this.dragging = false;
    evt.stopPropagation();
    document.removeEventListener('selectstart', this.disableGlobalSelectEvents);
  };

  private mouseDown = (evt) => {
    if (this.inDragRegion(evt)) {
      this.dragging = true;
      this.preventGlobalMouseEvents();
      evt.stopPropagation();
      document.addEventListener('selectstart', this.disableGlobalSelectEvents);
    }
  };

  private mouseMove = (evt) => {
    if (this.inDragRegion(evt) || this.dragging) {
      this.el.nativeElement.style.cursor = 'ew-resize';
    } else {
      this.el.nativeElement.style.cursor = 'default';
    }
  };


  constructor(private el: ElementRef) {
    document.addEventListener('mousemove', this.mouseMoveG, true);
    document.addEventListener('mouseup', this.mouseUpG, true);
    el.nativeElement.addEventListener('mousedown', this.mouseDown, true);
    el.nativeElement.addEventListener('mousemove', this.mouseMove, true);
  }


  private preventGlobalMouseEvents() {
    document.body.style['pointer-events'] = 'none';
  }


  private restoreGlobalMouseEvents() {
    document.body.style['pointer-events'] = 'auto';
  }


  private disableGlobalSelectEvents(event) {
    event.preventDefault();
  }


  private inDragRegion(evt) {
    return this.el.nativeElement.clientWidth - evt.clientX + this.el.nativeElement.offsetLeft
      < this.empNgResizableGrabWidth;
  }

}
