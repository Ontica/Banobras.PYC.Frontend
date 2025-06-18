/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService } from '@app/core';

import { Accountability, OrgUnitHolder, PartyRelationFields,
         StructureForEditAccountabilities } from '@app/models';


@Injectable()
export class AccountabilityDataService {


  constructor(private http: HttpService) { }


  getStructureForEditAccountabilities(commissionerUID: string): EmpObservable<StructureForEditAccountabilities> {
    Assertion.assertValue(commissionerUID, 'commissionerUID');

    const path = `v8/human-resources/accountabilities/${commissionerUID}/structured-data-for-edition`;

    return this.http.get<StructureForEditAccountabilities>(path);
  }


  getAccountability(accountabilityUID: string): EmpObservable<Accountability> {
    Assertion.assertValue(accountabilityUID, 'accountabilityUID');

    const path = `v8/human-resources/accountabilities/${accountabilityUID}`;

    return this.http.get<Accountability>(path);
  }


  createAccountability(dataFields: PartyRelationFields): EmpObservable<OrgUnitHolder> {
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v8/human-resources/accountabilities`;

    return this.http.post<OrgUnitHolder>(path, dataFields);
  }


  updateAccountability(accountabilityUID: string,
                       dataFields: PartyRelationFields): EmpObservable<OrgUnitHolder> {
    Assertion.assertValue(accountabilityUID, 'accountabilityUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v8/human-resources/accountabilities/${accountabilityUID}`;

    return this.http.put<OrgUnitHolder>(path, dataFields);
  }


  deleteAccountability(accountabilityUID: string): EmpObservable<OrgUnitHolder> {
    Assertion.assertValue(accountabilityUID, 'accountabilityUID');

    const path = `v8/human-resources/accountabilities/${accountabilityUID}`;

    return this.http.delete<OrgUnitHolder>(path);
  }

}
