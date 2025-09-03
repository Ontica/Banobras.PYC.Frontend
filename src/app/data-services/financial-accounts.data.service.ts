/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { EmpObservable, HttpService, Identifiable } from '@app/core';


@Injectable()
export class FinancialAccountsDataService {


  constructor(private http: HttpService) { }


  getAccountsTypes(): EmpObservable<Identifiable[]> {

    const path = `v1/financial-projects/financial-accounts-types`;

    return this.http.get<Identifiable[]>(path);
  }

}
