/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { HttpService } from '@app/core';


@Injectable()
export class CataloguesDataService {

  constructor(private http: HttpService) { }

}
