/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService } from '@app/core';

import { PartiesQuery, PartyDescriptor, SupplierDescriptor } from '@app/models';


@Injectable()
export class PartiesDataService {


  constructor(private http: HttpService) { }


  searchParties(query: PartiesQuery): EmpObservable<PartyDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v8/procurement/suppliers/search';

    return this.http.post<SupplierDescriptor[]>(path, query);
  }

}
