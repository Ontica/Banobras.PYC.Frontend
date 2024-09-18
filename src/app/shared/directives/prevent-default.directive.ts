/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Directive, HostListener } from '@angular/core';


@Directive({
  selector: '[empNgPreventDefault]'
})
export class EmpPreventDefaultDirective {

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    event.preventDefault();
  }

}
