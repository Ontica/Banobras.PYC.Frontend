/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService } from '@app/core';

import { ExplorerOperationCommand, ExplorerOperationResult, ProvisionDescriptor, ProvisionsOperationType,
         ProvisionsQuery } from '@app/models';


@Injectable()
export class ProvisionsDataService {


  constructor(private http: HttpService) { }


  searchProvisions(query: ProvisionsQuery): EmpObservable<ProvisionDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v2/financial-management/provisions/search';

    return this.http.post<ProvisionDescriptor[]>(path, query);
  }


  bulkOperationProvisions(operationType: ProvisionsOperationType,
                          command: ExplorerOperationCommand): EmpObservable<ExplorerOperationResult> {
    Assertion.assertValue(operationType, 'operationType');
    Assertion.assertValue(command, 'command');

    const path = `v2/financial-management/provisions/bulk-operation/${operationType}`;

    return this.http.post<ExplorerOperationResult>(path, command);
  }

}
