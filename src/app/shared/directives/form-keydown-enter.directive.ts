/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Directive, EventEmitter, HostListener, Output } from '@angular/core';


@Directive({
  selector: 'form[empNgFormKeyDownEnter]'
})
export class EmpFormKeyDownEnterDirective {

  @Output() public empNgFormKeyDownEnter = new EventEmitter<void>();

  @HostListener('keydown.enter', ['$event'])
  public onKeyDownEnter(event: KeyboardEvent): void {
    const targetTagName = (event.target as HTMLElement).tagName.toLowerCase();

    if (targetTagName === 'textarea') {
      event.stopPropagation();
    } else {
      event.preventDefault();
      this.empNgFormKeyDownEnter.emit();
    }
  }

}
