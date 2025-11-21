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

import { BillFields, DocumentFields, DocumentsEntityTypes } from '@app/models';


export enum BillUploaderEventType {
  CLOSE_MODAL_CLICKED = 'BillUploaderComponent.Event.CloseButtonClicked',
  UPLOAD_CLICKED      = 'BillUploaderComponent.Event.UploadClicked',
}

interface BillUploaderFormModel extends FormGroup<{
  documentProductUID: FormControl<string>;
  name: FormControl<string>;
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

  documentProductsList: Identifiable[] = [];


  constructor(private ordersData: OrdersDataService) {
    this.initForm();
  }


  ngOnInit() {
    this.loadDataLists();
  }


  get isFormReady(): boolean {
    return FormHelper.isFormReady(this.form) && !!this.xmlFile && !!this.xmlFile.file;
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
        xmlFile: this.xmlFile?.file ?? null,
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
    });
  }


  private getFormData(): BillFields {
    Assertion.assert(this.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: DocumentFields = {
      documentProductUID: formModel.documentProductUID,
      name: formModel.name,
    };

    return data;
  }

}
