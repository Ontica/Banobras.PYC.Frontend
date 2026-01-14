/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService } from '@app/core';

import { EntityStatus, ExplorerOperationResult, FileReport, PayrollDescriptor,
         PayrollsQuery } from '@app/models';


@Injectable()
export class IntegrationsDataService {

  constructor(private http: HttpService) { }


  //#region PAYROLLS (SIAL)
  searchPayrolls(query: PayrollsQuery): EmpObservable<PayrollDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = `v2/pyc/integration/sial/payrolls`;

    return this.http.post<PayrollDescriptor[]>(path, query);
  }


  exportPayroll(payrollUID: string): EmpObservable<FileReport> {
    Assertion.assertValue(payrollUID, 'payrollUID');

    const path = `v2/pyc/integration/sial/payrolls/${payrollUID}/export`;

    return this.http.post<FileReport>(path);
  }


  updatePayrollStatus(payrollUID: string, status: EntityStatus): EmpObservable<PayrollDescriptor> {
    Assertion.assertValue(payrollUID, 'payrollUID');
    Assertion.assertValue(status, 'status');

    const path = `v2/pyc/integration/sial/payrolls/${payrollUID}/update-status/${status}`;

    return this.http.put<PayrollDescriptor>(path, null);
  }
  //#endregion


  //#region VOUCHERS (SICOFIN)
  generateVouchers(): EmpObservable<ExplorerOperationResult> {
    const path = `v2/pyc/integration/sicofin/vouchers/generate`;

    return this.http.post<ExplorerOperationResult>(path);
  }
  //#endregion

}
