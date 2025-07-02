/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService } from '@app/core';

import { FileReport, AssetsAssignmentDescriptor, AssetsAssignmentHolder,
         AssetsAssignmentsQuery } from '@app/models';


@Injectable()
export class AssetsAssignmentsDataService {


  constructor(private http: HttpService) { }


  searchAssetsAssignments(query: AssetsAssignmentsQuery): EmpObservable<AssetsAssignmentDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v2/assets/assignments/search';

    return this.http.post<AssetsAssignmentDescriptor[]>(path, query);
  }


  getAssetsAssignment(assignmentUID: string): EmpObservable<AssetsAssignmentHolder> {
    Assertion.assertValue(assignmentUID, 'assignmentUID');

    const path = `v2/assets/assignments/${assignmentUID}`;

    return this.http.get<AssetsAssignmentHolder>(path);
  }

}
