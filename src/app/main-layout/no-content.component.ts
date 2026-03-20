/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';


@Component({
  selector: 'emp-ng-no-content',
  template: `
    <div class="text-not-found">
      <h1>404: La página solicitada no está disponible.</h1>
    </div>
  `
})
export class NoContentComponent { }
