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

import { Bill, EmptyBill, BaseActions, EmptyBaseActions, BillFields, BaseEntity,
         EmptyBaseEntity } from '@app/models';


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
  subtotal: FormControl<number>;
  discount: FormControl<number>;
  total: FormControl<number>;
  baseEntityTypeUID: FormControl<string>;
  baseEntityUID: FormControl<string>;
}> { }

@Component({
  selector: 'emp-ng-bill-header',
  templateUrl: './bill-header.component.html',
})
export class BillHeaderComponent implements OnInit, OnChanges {

  @Input() isSaved = false;

  @Input() bill: Bill = EmptyBill;

  @Input() baseEntity: BaseEntity = EmptyBaseEntity;

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

  baseEntityTypesList: Identifiable[] = [];

  baseEntitiesList: Identifiable[] = [];


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
    this.baseEntitiesList =
      ArrayLibrary.insertIfNotExist(this.baseEntitiesList ?? [], this.baseEntity, 'uid');
    this.baseEntityTypesList =
      ArrayLibrary.insertIfNotExist(this.baseEntityTypesList ?? [], this.baseEntity.type, 'uid');
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
      subtotal: [null],
      discount: [null],
      total: [null],
      baseEntityTypeUID: [''],
      baseEntityUID: [''],
    });
  }


  private setFormData() {
    setTimeout(() => {
      this.form.reset({
        managedByUID: FormHelper.getUIDValue(this.bill.managedBy),
        categoryUID: FormHelper.getUIDValue(this.bill.category),
        billTypeUID: FormHelper.getUIDValue(this.bill.billType),
        issuedByUID: FormHelper.getUIDValue(this.bill.issuedBy),
        issuedToUID: FormHelper.getUIDValue(this.bill.issuedTo),
        issueDate: this.bill.issueDate ?? '',
        currencyCode: this.bill.currencyCode ?? '',
        subtotal: FormHelper.getNumberValue(this.bill.subtotal),
        discount: FormHelper.getNumberValue(this.bill.discount),
        total: FormHelper.getNumberValue(this.bill.total),
        baseEntityTypeUID: FormHelper.getUIDValue(this.baseEntity.type),
        baseEntityUID: FormHelper.getUIDValue(this.baseEntity),
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
      case BillHeaderEventType.DELETE: return 'Eliminar comprobante';
      default: return '';
    }
  }


  private getConfirmMessage(eventType: BillHeaderEventType): string {
    switch (eventType) {
      case BillHeaderEventType.DELETE:
        const total = FormatLibrary.numberWithCommas(this.bill.total ?? 0, '1.2-2');

        return `Esta operación eliminará el comprobante
                <strong>${this.bill.billNo} (${this.bill.billType.name})</strong>
                emitida por <strong>${this.bill.issuedBy.name}</strong>
                con importe total de ${total}.
                <br><br>¿Elimino el comprobante?`;

      default: return '';
    }
  }

}
