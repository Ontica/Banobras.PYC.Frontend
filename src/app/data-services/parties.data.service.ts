/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService } from '@app/core';

import { OrgUnitDescriptor, PartiesQuery, SupplierDescriptor } from '@app/models';


@Injectable()
export class PartiesDataService {


  constructor(private http: HttpService) { }


  searchSuppliers(query: PartiesQuery): EmpObservable<SupplierDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v8/procurement/suppliers/search';

    return this.http.post<SupplierDescriptor[]>(path, query);
  }


  searchOrgUnits(query: PartiesQuery): EmpObservable<OrgUnitDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v8/human-resources/organizational-structure/search';

    return this.http.post<OrgUnitDescriptor[]>(path, query);
  }

}
