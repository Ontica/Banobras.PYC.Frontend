/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { FilePreviewComponent } from '@app/shared/containers';

import { DocumentsDataService } from '@app/data-services';

import { Document, DocumentsEntityTypes } from '@app/models';

import { DocumentsTableEventType } from './documents-table.component';

import { DocumentUploaderEventType } from './document-uploader.component';


export enum DocumentsEditionEventType {
  DOCUMENTS_UPDATED = 'DocumentsEditionComponent.Event.DocumentsUpdated',
}

@Component({
  selector: 'emp-ng-documents-edition',
  templateUrl: './documents-edition.component.html',
})
export class DocumentsEditionComponent {

  @ViewChild('filePreview', { static: true }) filePreview: FilePreviewComponent;

  @Input() entityType: DocumentsEntityTypes = null;

  @Input() entityUID: string = null;

  @Input() documents: Document[] = [];

  @Input() canEdit = false;

  @Output() documentsEditionEvent = new EventEmitter<EventInfo>();

  displayUploader = false;

  submitted = false;


  constructor(private documentsData: DocumentsDataService) { }


  onUpploadDocumentClicked() {
    this.displayUploader = true;
  }


  onDocumentUploaderEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as DocumentUploaderEventType) {
      case DocumentUploaderEventType.CLOSE_MODAL_CLICKED:
        this.displayUploader = false;
        return;
      case DocumentUploaderEventType.DOCUMENT_UPLOADED:
        this.emitDocumentsUpdated();
        this.displayUploader = false;
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onDocumentsTableEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as DocumentsTableEventType) {
      case DocumentsTableEventType.SHOW_DOCUMENT_CLICKED:
        Assertion.assertValue(event.payload.document.uid, 'event.payload.document.uid');
        Assertion.assertValue(event.payload.document.file, 'event.payload.document.file');
        this.openFilePreview(event.payload.document);
        return;
      case DocumentsTableEventType.REMOVE_DOCUMENT_CLICKED:
        Assertion.assertValue(event.payload.document.uid, 'event.payload.document.uid');
        this.deleteDocument(event.payload.document.uid);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private deleteDocument(documentUID: string) {
    this.submitted = true;

    this.documentsData.deleteDocument(this.entityType, this.entityUID, documentUID)
      .firstValue()
      .then(() => this.emitDocumentsUpdated())
      .finally(() => this.submitted = false);
  }


  private emitDocumentsUpdated() {
    const payload = { entityUID: this.entityUID };
    sendEvent(this.documentsEditionEvent, DocumentsEditionEventType.DOCUMENTS_UPDATED, payload);
  }


  private openFilePreview(document: Document) {
    this.filePreview.open(document.file.url, document.file.type);
  }

}
