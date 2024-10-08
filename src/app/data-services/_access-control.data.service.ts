/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { FileReport, OperationsLogQuery, Subject, SubjectFields, SubjectsQuery } from '@app/models';


@Injectable()
export class AccessControlDataService {

  constructor(private http: HttpService) { }


  getWorkareas(): EmpObservable<Identifiable[]> {
    const path = `v5/security/management/subjects/workareas`;

    return this.http.get<Identifiable[]>(path);
  }


  getContexts(): EmpObservable<Identifiable[]> {
    const path = `v5/security/management/contexts`;

    return this.http.get<Identifiable[]>(path);
  }


  getRolesByContext(contextUID: string): EmpObservable<Identifiable[]> {
    const path = `v5/security/management/contexts/${contextUID}/roles`;

    return this.http.get<Identifiable[]>(path);
  }


  getFeaturesByContext(contextUID: string): EmpObservable<Identifiable[]> {
    const path = `v5/security/management/contexts/${contextUID}/features`;

    return this.http.get<Identifiable[]>(path);
  }


  searchSubjects(query: SubjectsQuery): EmpObservable<Subject[]> {
    let path = `v5/security/management/subjects/search`;

    return this.http.post<Subject[]>(path, query);
  }


  getSubjectContexts(subjectUID: string): EmpObservable<Identifiable[]> {
    Assertion.assertValue(subjectUID, 'subjectUID');

    const path = `v5/security/management/subjects/${subjectUID}/contexts`;

    return this.http.get<Identifiable[]>(path);
  }


  getSubjectRolesByContext(subjectUID: string, contextUID: string): EmpObservable<Identifiable[]> {
    Assertion.assertValue(subjectUID, 'subjectUID');
    Assertion.assertValue(contextUID, 'contextUID');

    const path = `v5/security/management/subjects/${subjectUID}/contexts/${contextUID}/roles`;

    return this.http.get<Identifiable[]>(path);
  }


  getSubjectFeaturesByContext(subjectUID: string, contextUID: string): EmpObservable<Identifiable[]> {
    Assertion.assertValue(subjectUID, 'subjectUID');
    Assertion.assertValue(contextUID, 'contextUID');

    const path = `v5/security/management/subjects/${subjectUID}/contexts/${contextUID}/features`;

    return this.http.get<Identifiable[]>(path);
  }


  createSubject(subjectFields: SubjectFields): EmpObservable<Subject> {
    Assertion.assertValue(subjectFields, 'subjectFields');

    const path = `v5/security/management/subjects`;

    return this.http.post<Subject>(path, subjectFields);
  }


  updateSubject(subjectUID: string, subjectFields: SubjectFields): EmpObservable<Subject> {
    Assertion.assertValue(subjectUID, 'subjectUID');
    Assertion.assertValue(subjectFields, 'subjectFields');

    const path = `v5/security/management/subjects/${subjectUID}`;

    return this.http.put<Subject>(path, subjectFields);
  }


  deleteSubject(subjectUID: string): EmpObservable<void> {
    Assertion.assertValue(subjectUID, 'subjectUID');

    const path = `v5/security/management/subjects/${subjectUID}`;

    return this.http.delete<void>(path);
  }


  resetCredentialsToSubject(subjectUID: string): EmpObservable<any> {
    Assertion.assertValue(subjectUID, 'subjectUID');

    const path = `v5/security/management/subjects/${subjectUID}/reset-credentials`;

    return this.http.post<any>(path);
  }


  activateSubject(subjectUID: string): EmpObservable<Subject> {
    Assertion.assertValue(subjectUID, 'subjectUID');

    const path = `v5/security/management/subjects/${subjectUID}/activate`;

    return this.http.post<Subject>(path);
  }


  suspendSubject(subjectUID: string): EmpObservable<Subject> {
    Assertion.assertValue(subjectUID, 'subjectUID');

    const path = `v5/security/management/subjects/${subjectUID}/suspend`;

    return this.http.post<Subject>(path);
  }


  assignContextToSubject(subjectUID: string, contextUID: string): EmpObservable<Identifiable[]> {
    Assertion.assertValue(subjectUID, 'subjectUID');
    Assertion.assertValue(contextUID, 'contextUID');

    const path = `v5/security/management/subjects/${subjectUID}/contexts/${contextUID}`;

    return this.http.post<Identifiable[]>(path);
  }


  removeContextToSubject(subjectUID: string, contextUID: string): EmpObservable<Identifiable[]> {
    Assertion.assertValue(subjectUID, 'subjectUID');
    Assertion.assertValue(contextUID, 'contextUID');

    const path = `v5/security/management/subjects/${subjectUID}/contexts/${contextUID}`;

    return this.http.delete<Identifiable[]>(path);
  }


  assignRoleToSubject(subjectUID: string,
                      contextUID: string,
                      roleUID: string): EmpObservable<Identifiable[]> {
    Assertion.assertValue(subjectUID, 'subjectUID');
    Assertion.assertValue(contextUID, 'contextUID');
    Assertion.assertValue(roleUID, 'roleUID');

    const path = `v5/security/management/subjects/${subjectUID}/contexts/${contextUID}/roles/${roleUID}`;

    return this.http.post<Identifiable[]>(path);
  }


  removeRoleToSubject(subjectUID: string,
                      contextUID: string,
                      roleUID: string): EmpObservable<Identifiable[]> {
    Assertion.assertValue(subjectUID, 'subjectUID');
    Assertion.assertValue(contextUID, 'contextUID');
    Assertion.assertValue(roleUID, 'roleUID');

    const path = `v5/security/management/subjects/${subjectUID}/contexts/${contextUID}/roles/${roleUID}`;

    return this.http.delete<Identifiable[]>(path);
  }


  assignFeatureToSubject(subjectUID: string,
                         contextUID: string,
                         featureUID: string): EmpObservable<Identifiable[]> {
    Assertion.assertValue(subjectUID, 'subjectUID');
    Assertion.assertValue(contextUID, 'contextUID');
    Assertion.assertValue(featureUID, 'featureUID');

    const path = `v5/security/management/subjects/${subjectUID}/contexts/${contextUID}/features/${featureUID}`;

    return this.http.post<Identifiable[]>(path);
  }


  removeFeatureToSubject(subjectUID: string,
                         contextUID: string,
                         featureUID: string): EmpObservable<Identifiable[]> {
    Assertion.assertValue(subjectUID, 'subjectUID');
    Assertion.assertValue(contextUID, 'contextUID');
    Assertion.assertValue(featureUID, 'featureUID');

    const path = `v5/security/management/subjects/${subjectUID}/contexts/${contextUID}/features/${featureUID}`;

    return this.http.delete<Identifiable[]>(path);
  }


  exportOperationalLogToExcel(query: OperationsLogQuery): EmpObservable<FileReport> {
    Assertion.assertValue(query, 'query');

    const path = `v5/security/management/operational-logs/excel`;

    return this.http.post<FileReport>(path, query);
  }

}
