/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';


@Injectable()
export class LoggerService {

  log(msg: string) {
    console.log(msg);
  }

  error(msg: string) {
    console.error(msg);
  }

}
