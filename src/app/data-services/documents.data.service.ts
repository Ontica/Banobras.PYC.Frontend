/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService } from '@app/core';

import { Document, DocumentCategory, DocumentFields, DocumentsEntityTypes,
         getEntityModule } from '@app/models';


@Injectable()
export class DocumentsDataService {


  constructor(private http: HttpService) { }


  getDocumentCategories(): EmpObservable<DocumentCategory[]> {
    const path = `v8/documents/categories`;

    return this.http.get<DocumentCategory[]>(path);
  }


  upploadDocument(entityType: DocumentsEntityTypes, entityUID: string,
                  dataFields: DocumentFields, file: File): EmpObservable<Document> {
    Assertion.assertValue(entityType, 'entityType');
    Assertion.assertValue(entityUID, 'entityUID');
    Assertion.assertValue(dataFields, 'dataFields');
    Assertion.assertValue(document, 'document');

    const formData: FormData = new FormData();
    formData.append('document', JSON.stringify(dataFields));
    formData.append('media', file);

    const path = `v2/${getEntityModule(entityType)}/${entityUID}/documents`;

    return this.http.post<Document>(path, formData);
  }


  deleteDocument(entityType: DocumentsEntityTypes, entityUID: string, documentUID: string): EmpObservable<void> {
    Assertion.assertValue(entityType, 'entityType');
    Assertion.assertValue(entityUID, 'entityUID');
    Assertion.assertValue(documentUID, 'documentUID');

    const path = `v2/${getEntityModule(entityType)}/${entityUID}/documents/${documentUID}`;

    return this.http.delete<void>(path);
  }

}
