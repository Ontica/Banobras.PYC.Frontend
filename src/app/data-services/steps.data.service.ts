/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { Step, StepFields } from '@app/models';


@Injectable()
export class StepsDataService {


  constructor(private http: HttpService) { }


  getWorkflowModelItems(workflowInstanceUID: string): EmpObservable<Identifiable[]> {
    Assertion.assertValue(workflowInstanceUID, 'workflowInstanceUID');

    const path = `v4/workflow/execution/workflow-instances/${workflowInstanceUID}/optional-model-items`;

    return this.http.get<Identifiable[]>(path);
  }


  insertWorkflowStep(workflowInstanceUID: string,
                     dataFields: StepFields): EmpObservable<Step> {
    Assertion.assertValue(workflowInstanceUID, 'workflowInstanceUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v4/workflow/execution/workflow-instances/${workflowInstanceUID}/steps`;

    return this.http.post<Step>(path, dataFields);
  }


  updateWorkflowStep(workflowInstanceUID: string,
                     stepUID: string,
                     dataFields: StepFields): EmpObservable<Step> {
    Assertion.assertValue(workflowInstanceUID, 'workflowInstanceUID');
    Assertion.assertValue(stepUID, 'stepUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v4/workflow/execution/workflow-instances/${workflowInstanceUID}/steps/${stepUID}`;

    return this.http.put<Step>(path, dataFields);
  }


  removeWorkflowStep(workflowInstanceUID: string, stepUID: string): EmpObservable<void> {
    Assertion.assertValue(workflowInstanceUID, 'workflowInstanceUID');
    Assertion.assertValue(stepUID, 'stepUID');

    const path = `v4/workflow/execution/workflow-instances/${workflowInstanceUID}/steps/${stepUID}`;

    return this.http.delete<void>(path);
  }

}
