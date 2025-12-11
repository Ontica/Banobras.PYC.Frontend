/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, Identifiable } from '@app/core';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { OrdersDataService } from '@app/data-services';

import { BillFields, DocumentFields, DocumentProduct, DocumentsEntityTypes } from '@app/models';


export enum BillUploaderEventType {
  CLOSE_MODAL_CLICKED = 'BillUploaderComponent.Event.CloseButtonClicked',
  UPLOAD_CLICKED      = 'BillUploaderComponent.Event.UploadClicked',
}

interface BillUploaderFormModel extends FormGroup<{
  documentProductUID: FormControl<string>;
  name: FormControl<string>;
  total: FormControl<number>;
}> { }

@Component({
  selector: 'emp-ng-bill-uploader',
  templateUrl: './bill-uploader.component.html',
})
export class BillUploaderComponent implements OnInit {

  @Input() entityType: DocumentsEntityTypes = null;

  @Input() entityUID: string = null;

  @Output() billUploaderEvent = new EventEmitter<EventInfo>();

  form: BillUploaderFormModel;

  formHelper = FormHelper;

  xmlFile = null;

  pdfFile = null;

  isFormInvalidated = false;

  isLoading = false;

  submitted = false;

  documentProductsList: DocumentProduct[] = [];

  isCFDI = true;


  constructor(private ordersData: OrdersDataService) {
    this.initForm();
  }


  ngOnInit() {
    this.loadDataLists();
  }


  get isFormReady(): boolean {
    const xmlValid = this.isCFDI && !!this.xmlFile?.file;
    const pdfValid = !this.isCFDI && !!this.pdfFile?.file;
    return FormHelper.isFormReady(this.form) && (xmlValid || pdfValid)
  }


  onDocumentProductChanges(documentProduct: DocumentProduct) {
    this.isCFDI = documentProduct.isCFDI;
    this.validateFieldsRequired();
  }


  onCloseButtonClicked() {
    sendEvent(this.billUploaderEvent, BillUploaderEventType.CLOSE_MODAL_CLICKED);
  }


  onSubmitButtonClicked() {
    this.isFormInvalidated = true;

    if (this.formHelper.isFormReadyAndInvalidate(this.form) && this.isFormReady) {
      const payload = {
        entityType: this.entityType,
        entityUID: this.entityUID,
        dataFields: this.getFormData(),
        xmlFile: this.isCFDI ? (this.xmlFile?.file ?? null) : null,
        pdfFile: this.pdfFile?.file ?? null,
      };

      sendEvent(this.billUploaderEvent, BillUploaderEventType.UPLOAD_CLICKED, payload);
    }
  }


  private loadDataLists() {
    this.isLoading = true;

    this.ordersData.getOrdersBillTypes()
      .firstValue()
      .then(x => this.documentProductsList = x)
      .finally(() => this.isLoading = false);
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      documentProductUID: ['', Validators.required],
      name: ['', Validators.required],
      total: [null],
    });
  }


  private validateFieldsRequired() {
    if (this.isCFDI) {
      this.formHelper.clearControlValidators(this.form.controls.total);
    } else {
      this.formHelper.setControlValidators(this.form.controls.total, [Validators.required]);
    }
  }


  private getFormData(): BillFields {
    Assertion.assert(this.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: DocumentFields = {
      documentProductUID: formModel.documentProductUID,
      name: formModel.name,
      total: this.isCFDI ? null : formModel.total,
    };

    return data;
  }

}
