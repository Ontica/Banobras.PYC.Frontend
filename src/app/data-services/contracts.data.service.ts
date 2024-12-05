/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { ContractData, ContractDescriptor, ContractFields, ContractsQuery } from '@app/models';


@Injectable()
export class ContractsDataService {


  constructor(private http: HttpService) { }


  getContractTypes(): EmpObservable<Identifiable[]> {
    const path = 'v8/procurement/contracts/contract-types';

    return this.http.get<Identifiable[]>(path);
  }


  searchContracts(query: ContractsQuery): EmpObservable<ContractDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v8/procurement/contracts/search';

    return this.http.post<ContractDescriptor[]>(path, query);
  }


  getContractData(contractUID: string): EmpObservable<ContractData> {
    Assertion.assertValue(contractUID, 'contractUID');

    const path = `v8/procurement/contracts/${contractUID}`;

    return this.http.get<ContractData>(path);
  }


  createContract(dataFields: ContractFields): EmpObservable<ContractData> {
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v8/procurement/contracts`;

    return this.http.post<ContractData>(path, dataFields);
  }


  updateContract(contractUID: string, dataFields: ContractFields): EmpObservable<ContractData> {
    Assertion.assertValue(contractUID, 'contractUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v8/procurement/contracts/${contractUID}`;

    return this.http.put<ContractData>(path, dataFields);
  }


  deleteContract(contractUID: string): EmpObservable<void> {
    Assertion.assertValue(contractUID, 'contractUID');

    const path = `v8/procurement/contracts/${contractUID}`;

    return this.http.delete<void>(path);
  }

}
