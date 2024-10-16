/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { ContractDescriptor, ContractsQuery } from '@app/models';


@Injectable()
export class ContractsDataService {


  constructor(private http: HttpService) { }


  getContractTypes(): EmpObservable<Identifiable[]> {
    const path = 'v2/contracts/contract-types';

    return this.http.get<Identifiable[]>(path);
  }


  searchContracts(query: ContractsQuery): EmpObservable<ContractDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v2/contracts/search';

    return this.http.post<ContractDescriptor[]>(path, query);
  }

}
