/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo } from '@app/core';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { DocumentsDataService } from '@app/data-services';

import { Document, DocumentCategory, DocumentFields, DocumentProduct,
         DocumentsEntityTypes } from '@app/models';


export enum DocumentUploaderEventType {
  CLOSE_MODAL_CLICKED = 'DocumentUploaderComponent.Event.CloseButtonClicked',
  DOCUMENT_UPLOADED   = 'DocumentUploaderComponent.Event.DocumentUploaded',
}

interface DocumentUploaderFormModel extends FormGroup<{
  documentCategory: FormControl<DocumentCategory>;
  documentProduct: FormControl<DocumentProduct>;
  name: FormControl<string>;
}> { }

@Component({
  selector: 'emp-ng-document-uploader',
  templateUrl: './document-uploader.component.html',
})
export class DocumentUploaderComponent implements OnInit {

  @Input() entityType: DocumentsEntityTypes = null;

  @Input() entityUID: string = null;

  @Output() documentUploaderEvent = new EventEmitter<EventInfo>();

  form: DocumentUploaderFormModel;

  formHelper = FormHelper;

  fileData = null;

  isFormInvalidated = false;

  isLoading = false;

  submitted = false;

  categoriesList: DocumentCategory[] = [];


  constructor(private documentsData: DocumentsDataService) {
    this.initForm();
  }


  ngOnInit() {
    this.loadDataLists();
  }


  get isFormReady(): boolean {
    return FormHelper.isFormReady(this.form) && !!this.fileData && !!this.fileData.file;
  }


  onCloseButtonClicked() {
    sendEvent(this.documentUploaderEvent, DocumentUploaderEventType.CLOSE_MODAL_CLICKED);
  }


  onDocumentCategoryChanges() {
    this.form.controls.documentProduct.reset();
    this.fileData = null;
  }


  onDocumentProductChanges() {
    this.fileData = null;
  }


  onSubmitButtonClicked() {
    this.isFormInvalidated = true;

    if (this.formHelper.isFormReadyAndInvalidate(this.form) && this.isFormReady) {
      this.upploadDocument(this.getFormData(), this.fileData.file);
    }
  }


  private loadDataLists() {
    this.isLoading = true;

    this.documentsData.getDocumentCategories()
      .firstValue()
      .then(x => this.categoriesList = x)
      .finally(() => this.isLoading = false);
  }


  private upploadDocument(dataFields: DocumentFields, file: File) {
    this.submitted = true;

    this.documentsData.upploadDocument(this.entityType, this.entityUID, dataFields, file)
      .firstValue()
      .then(x => this.resolveDocumentUploaded(x))
      .finally(() => this.submitted = false);
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      documentCategory: [null as DocumentCategory, Validators.required],
      documentProduct: [null as DocumentProduct, Validators.required],
      name: ['', Validators.required],
    });
  }


  private getFormData(): DocumentFields {
    Assertion.assert(this.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: DocumentFields = {
      documentProductUID: formModel.documentProduct.uid,
      name: formModel.name,
      total: 0,
      documentNumber: '',
    };

    return data;
  }



  private resolveDocumentUploaded(document: Document) {
    sendEvent(this.documentUploaderEvent, DocumentUploaderEventType.DOCUMENT_UPLOADED, {document});
  }

}
