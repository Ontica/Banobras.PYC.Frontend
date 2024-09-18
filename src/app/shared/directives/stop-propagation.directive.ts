/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Directive, HostListener } from '@angular/core';


@Directive({
  selector: '[empNgStopPropagation]'
})
export class EmpStopPropagationDirective {

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    event.stopPropagation();
  }

}
