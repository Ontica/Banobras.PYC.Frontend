/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService } from '@app/core';

import { FileReport, AssetsAssignmentDescriptor, AssetsAssignmentHolder, AssetsAssignmentsQuery,
         AssetsOperationType, ExplorerOperationCommand, ExplorerOperationResult } from '@app/models';


@Injectable()
export class AssetsAssignmentsDataService {


  constructor(private http: HttpService) { }


  searchAssignments(query: AssetsAssignmentsQuery): EmpObservable<AssetsAssignmentDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v2/assets/assignments/search';

    return this.http.post<AssetsAssignmentDescriptor[]>(path, query);
  }


  exportAssignments(query: AssetsAssignmentsQuery): EmpObservable<FileReport> {
    Assertion.assertValue(query, 'query');

    const path = 'v2/assets/assignments/export';

    return this.http.post<FileReport>(path, query);
  }


  bulkOperationAssignments(operationType: AssetsOperationType,
                           command: ExplorerOperationCommand): EmpObservable<ExplorerOperationResult> {
    Assertion.assertValue(operationType, 'operationType');
    Assertion.assertValue(command, 'command');

    const path = `v2/assets/assignments/bulk-operation/${operationType}`;

    return this.http.post<ExplorerOperationResult>(path, command);
  }


  getAssignment(assignmentUID: string): EmpObservable<AssetsAssignmentHolder> {
    Assertion.assertValue(assignmentUID, 'assignmentUID');

    const path = `v2/assets/assignments/${assignmentUID}`;

    return this.http.get<AssetsAssignmentHolder>(path);
  }


  bulkOperationAssignmentAssets(assignmentUID: string,
                                operationType: AssetsOperationType,
                                command: ExplorerOperationCommand): EmpObservable<ExplorerOperationResult> {
    Assertion.assertValue(assignmentUID, 'assignmentUID');
    Assertion.assertValue(operationType, 'operationType');
    Assertion.assertValue(command, 'command');

    const path = `v2/assets/assignments/${assignmentUID}/bulk-operation/${operationType}`;

    return this.http.post<ExplorerOperationResult>(path, command);
  }

}
