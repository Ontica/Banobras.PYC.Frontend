/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Directive, HostListener, Input } from '@angular/core';


@Directive({
  selector: '[empNgContextMenuDisabled]'
})
export class EmpContextMenuDisabledDirective {

  @Input() set empNgContextMenuDisabled(disabled) {
    this.disabled = disabled !== false;
  }

  disabled = true;

  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    if (this.disabled) {
      event.preventDefault();
    }
  }

}
