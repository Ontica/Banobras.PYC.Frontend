/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService} from '@app/core';

import { FinancialConceptsQuery, FinancialConceptHolder, FinancialConceptGroupDescriptor,
         FinancialConceptGroup, FinancialConceptType } from '@app/models';


@Injectable()
export class FinancialConceptsDataService {


  constructor(private http: HttpService) { }


  getFinancialConceptsGroups(): EmpObservable<FinancialConceptGroupDescriptor[]> {
    const path = `v3/financial-concepts/groups`;

    return this.http.get<FinancialConceptGroupDescriptor[]>(path);
  }


  getFinancialConceptsClassifications(): EmpObservable<FinancialConceptGroupDescriptor[]> {
    const path = `v3/financial-concepts/list/${FinancialConceptType.CASH_FLOW}`;

    return this.http.get<FinancialConceptGroupDescriptor[]>(path);
  }


  searchFinancialConceptsByGroup(groupUID: string, query: FinancialConceptsQuery): EmpObservable<FinancialConceptGroup> {
    Assertion.assertValue(groupUID, 'groupUID');
    Assertion.assertValue(query, 'query');

    const path = `v3/financial-concepts/groups/${groupUID}`;

    return this.http.post<FinancialConceptGroup>(path, query);
  }


  getFinancialConcept(conceptUID: string): EmpObservable<FinancialConceptHolder> {
    Assertion.assertValue(conceptUID, 'conceptUID');

    const path = `v3/financial-concepts/${conceptUID}`;

    return this.http.get<FinancialConceptHolder>(path);
  }

}
