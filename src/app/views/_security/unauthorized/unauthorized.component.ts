/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';


@Component({
  selector: 'emp-ng-unauthorized',
  template: `
    <div class="unauthorized-container">
      <h1>401: La cuenta no tiene permisos de acceso o la sesión ya expiró.</h1>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      display: flex;
      justify-content: center;
      padding: 2em;
      color: #4d4d4d;
    }`
  ],
})
export class UnauthorizedComponent { }
