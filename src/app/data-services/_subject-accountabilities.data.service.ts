/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService } from '@app/core';

import { Accountability, AccountabilityDescriptor, PartyRelationFields,
         StructureForEditAccountabilities } from '@app/models';


@Injectable()
export class SubjectAccountabilitiesDataService {


  constructor(private http: HttpService) { }


  getStructureForEditAccountabilities(subjectUID: string): EmpObservable<StructureForEditAccountabilities> {
    Assertion.assertValue(subjectUID, 'subjectUID');

    const path = `v5/security/management/subjects/${subjectUID}/accountabilities/structured-data-for-edition`;

    return this.http.get<StructureForEditAccountabilities>(path);
  }


  getAccountabilities(subjectUID: string): EmpObservable<AccountabilityDescriptor[]> {
    Assertion.assertValue(subjectUID, 'subjectUID');

    const path = `v5/security/management/subjects/${subjectUID}/accountabilities`;

    return this.http.get<AccountabilityDescriptor[]>(path);
  }


  getAccountability(subjectUID: string,
                    accountabilityUID: string): EmpObservable<Accountability> {
    Assertion.assertValue(subjectUID, 'subjectUID');
    Assertion.assertValue(accountabilityUID, 'accountabilityUID');

    const path = `v5/security/management/subjects/${subjectUID}/accountabilities/${accountabilityUID}`;

    return this.http.get<Accountability>(path);
  }


  createAccountability(subjectUID: string,
                       dataFields: PartyRelationFields): EmpObservable<AccountabilityDescriptor[]> {
    Assertion.assertValue(subjectUID, 'subjectUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v5/security/management/subjects/${subjectUID}/accountabilities`;

    return this.http.post<AccountabilityDescriptor[]>(path, dataFields);
  }


  updateAccountability(subjectUID: string,
                       accountabilityUID: string,
                       dataFields: PartyRelationFields): EmpObservable<AccountabilityDescriptor[]> {
    Assertion.assertValue(subjectUID, 'subjectUID');
    Assertion.assertValue(accountabilityUID, 'accountabilityUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v5/security/management/subjects/${subjectUID}/accountabilities/${accountabilityUID}`;

    return this.http.put<AccountabilityDescriptor[]>(path, dataFields);
  }


  deleteAccountability(subjectUID: string,
                       accountabilityUID: string): EmpObservable<AccountabilityDescriptor[]> {
    Assertion.assertValue(subjectUID, 'subjectUID');
    Assertion.assertValue(accountabilityUID, 'accountabilityUID');

    const path = `v5/security/management/subjects/${subjectUID}/accountabilities/${accountabilityUID}`;

    return this.http.delete<AccountabilityDescriptor[]>(path);
  }

}
