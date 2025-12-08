/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Assertion, DateString, EventInfo, Identifiable, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { ArrayLibrary, FormatLibrary, FormHelper, sendEvent, sendEventIf } from '@app/shared/utils';

import { Bill, EmptyBill, BaseActions, EmptyBaseActions, BillFields } from '@app/models';


export enum BillHeaderEventType {
  CREATE = 'BillHeaderComponent.Event.CreateBill',
  UPDATE = 'BillHeaderComponent.Event.UpdateBill',
  DELETE = 'BillHeaderComponent.Event.DeleteBill',
}

interface BillFormModel extends FormGroup<{
  managedByUID: FormControl<string>;
  categoryUID: FormControl<string>;
  billTypeUID: FormControl<string>;
  issueDate: FormControl<DateString>;
  issuedByUID: FormControl<string>;
  issuedToUID: FormControl<string>;
  currencyCode: FormControl<string>;
  subtotal: FormControl<string>;
  discount: FormControl<string>;
  total: FormControl<string>;
}> { }

@Component({
  selector: 'emp-ng-bill-header',
  templateUrl: './bill-header.component.html',
})
export class BillHeaderComponent implements OnInit, OnChanges {

  @Input() isSaved = false;

  @Input() bill: Bill = EmptyBill;

  @Input() actions: BaseActions = EmptyBaseActions;

  @Output() billHeaderEvent = new EventEmitter<EventInfo>();

  form: BillFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  managedByList: Identifiable[] = [];

  categoriesList: Identifiable[] = [];

  billTypesList: Identifiable[] = [];

  issuedByList: Identifiable[] = [];

  issuedToList: Identifiable[] = [];


  constructor(private messageBox: MessageBoxService) {
    this.initForm();
    this.enableEditor(true);
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.bill && this.isSaved) {
      this.enableEditor(false);
      this.validateDataLists();
    }
  }


  get hasActions(): boolean {
    return this.actions.canDelete || this.actions.canUpdate;
  }


  onSubmitButtonClicked() {
    if (FormHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.isSaved ? BillHeaderEventType.UPDATE : BillHeaderEventType.CREATE;
      sendEvent(this.billHeaderEvent, eventType, { billFields: this.getFormData() });
    }
  }


  onDeleteButtonClicked() {
    this.showConfirmMessage(BillHeaderEventType.DELETE);
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;

    if (!this.editionMode && this.isSaved) {
      this.setFormData();
    }

    const disable = this.isSaved && (!this.editionMode || !this.actions.canUpdate);

    setTimeout(() => FormHelper.setDisableForm(this.form, disable));
  }


  private loadDataLists() {

  }


  private validateDataLists() {
    this.managedByList =
      ArrayLibrary.insertIfNotExist(this.managedByList ?? [], this.bill.managedBy, 'uid');
    this.categoriesList =
      ArrayLibrary.insertIfNotExist(this.categoriesList ?? [], this.bill.category, 'uid');
    this.billTypesList =
      ArrayLibrary.insertIfNotExist(this.billTypesList ?? [], this.bill.billType, 'uid');
    this.issuedByList =
      ArrayLibrary.insertIfNotExist(this.issuedByList ?? [], this.bill.issuedBy, 'uid');
    this.issuedToList =
      ArrayLibrary.insertIfNotExist(this.issuedToList ?? [], this.bill.issuedTo, 'uid');
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      managedByUID: [''],
      categoryUID: [''],
      billTypeUID: [''],
      issueDate: [null],
      issuedByUID: [''],
      issuedToUID: [''],
      currencyCode: [''],
      subtotal: [''],
      discount: [''],
      total: [''],
    });
  }


  private setFormData() {
    setTimeout(() => {
      this.form.reset({
        managedByUID: isEmpty(this.bill.managedBy) ? null : this.bill.managedBy.uid,
        categoryUID: isEmpty(this.bill.category) ? null : this.bill.category.uid,
        billTypeUID: isEmpty(this.bill.billType) ? null : this.bill.billType.uid,
        issueDate: this.bill.issueDate ?? '',
        issuedByUID: isEmpty(this.bill.issuedBy) ? null : this.bill.issuedBy.uid,
        issuedToUID: isEmpty(this.bill.issuedTo) ? null : this.bill.issuedTo.uid,
        currencyCode: this.bill.currencyCode ?? '',
        subtotal: this.bill.subtotal > 0 ? FormatLibrary.numberWithCommas(this.bill.subtotal, '1.2-2') : null,
        discount: this.bill.discount > 0 ? FormatLibrary.numberWithCommas(this.bill.discount, '1.2-2') : null,
        total: this.bill.total > 0 ? FormatLibrary.numberWithCommas(this.bill.total, '1.2-2') : null,
      });
    });
  }


  private getFormData(): BillFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const data: BillFields = {

    };

    return data;
  }


  private showConfirmMessage(eventType: BillHeaderEventType) {
    const confirmType = this.getConfirmType(eventType);
    const title = this.getConfirmTitle(eventType);
    const message = this.getConfirmMessage(eventType);

    this.messageBox.confirm(message, title, confirmType)
      .firstValue()
      .then(x => sendEventIf(x, this.billHeaderEvent, eventType, { billUID: this.bill.uid }));
  }


  private getConfirmType(eventType: BillHeaderEventType): 'AcceptCancel' | 'DeleteCancel' {
    switch (eventType) {
      case BillHeaderEventType.DELETE:
        return 'DeleteCancel';
      default:
        return 'AcceptCancel';
    }
  }


  private getConfirmTitle(eventType: BillHeaderEventType): string {
    switch (eventType) {
      case BillHeaderEventType.DELETE: return 'Eliminar factura';
      default: return '';
    }
  }


  private getConfirmMessage(eventType: BillHeaderEventType): string {
    switch (eventType) {
      case BillHeaderEventType.DELETE:
        const total = FormatLibrary.numberWithCommas(this.bill.total ?? 0, '1.2-2');

        return `Esta operación eliminará la factura
                <strong>${this.bill.billNo} (${this.bill.billType.name})</strong>
                emitida por <strong>${this.bill.issuedBy.name}</strong>
                con importe total de ${total}.
                <br><br>¿Elimino la factura?`;

      default: return '';
    }
  }

}
