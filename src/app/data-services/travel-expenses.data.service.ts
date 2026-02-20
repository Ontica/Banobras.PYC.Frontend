/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { TravelExpensesDataFields, TravelExpensesRequestResult } from '@app/models';


@Injectable()
export class TravelExpensesDataService {


  constructor(private http: HttpService) { }


  getCommissionerPaymentAccounts(commissionerUID: string): EmpObservable<Identifiable[]> {
    const path = `v2/expenses-management/commissioners/${commissionerUID}/payment-accounts`;

    return this.http.get<Identifiable[]>(path);
  }


  requestPayment(dataFields: TravelExpensesDataFields, pdfFile: File): EmpObservable<TravelExpensesRequestResult> {
    Assertion.assertValue(dataFields, 'dataFields');
    Assertion.assertValue(pdfFile, 'pdfFile');


    const formData: FormData = new FormData();
    formData.append('request', JSON.stringify(dataFields));
    formData.append('pdf', pdfFile);

    const path = `v2/expenses-management/travel-expenses/request-payment`;

    return this.http.post<TravelExpensesRequestResult>(path, formData);
  }

}
