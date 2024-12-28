/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { Contract, ContractData, ContractDescriptor, ContractFields, ContractItem, ContractItemFields,
         ContractsQuery } from '@app/models';


@Injectable()
export class ContractsDataService {


  constructor(private http: HttpService) { }


  getContractTypes(): EmpObservable<Identifiable[]> {
    const path = 'v8/procurement/contracts/contract-types';

    return this.http.get<Identifiable[]>(path);
  }


  getContractsToOrder(supplierUID: string): EmpObservable<Contract[]> {
    Assertion.assertValue(supplierUID, 'supplierUID');

    const path = `v8/procurement/suppliers/${supplierUID}/contracts/to-order`;

    return this.http.get<Contract[]>(path);
  }


  searchContracts(query: ContractsQuery): EmpObservable<ContractDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v8/procurement/contracts/search';

    return this.http.post<ContractDescriptor[]>(path, query);
  }


  getContract(contractUID: string): EmpObservable<ContractData> {
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


  addContractItem(contractUID: string,
                  dataFields: ContractItemFields): EmpObservable<ContractItem> {
    Assertion.assertValue(contractUID, 'contractUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v8/procurement/contracts/${contractUID}/items`;

    return this.http.post<ContractItem>(path, dataFields);
  }


  updateContractItem(contractUID: string,
                     contractItemUID: string,
                     dataFields: ContractItemFields): EmpObservable<ContractItem> {
    Assertion.assertValue(contractUID, 'contractUID');
    Assertion.assertValue(contractItemUID, 'contractItemUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v8/procurement/contracts/${contractUID}/items/${contractItemUID}`;

    return this.http.put<ContractItem>(path, dataFields);
  }


  removeContractItem(contractUID: string, contractItemUID: string): EmpObservable<void> {
    Assertion.assertValue(contractUID, 'contractUID');
    Assertion.assertValue(contractItemUID, 'contractItemUID');

    const path = `v8/procurement/contracts/${contractUID}/items/${contractItemUID}`;

    return this.http.delete<void>(path);
  }

}
