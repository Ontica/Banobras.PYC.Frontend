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

import { ArrayLibrary, FormatLibrary, FormHelper, sendEvent } from '@app/shared/utils';

import { Contract, ContractFields, DateRange, EmptyContract, EmptyDateRange } from '@app/models';


export enum ContractHeaderEventType {
  CREATE = 'ContractHeaderComponent.Event.CreateContract',
  UPDATE = 'ContractHeaderComponent.Event.UpdateContract',
  DELETE = 'ContractHeaderComponent.Event.DeleteContract',
}

interface ContractFormModel extends FormGroup<{
  managedByOrgUnitUID: FormControl<string>;
  budgetTypeUID: FormControl<string>;
  datePeriod: FormControl<DateRange>;
  signDate: FormControl<DateString>;
  contractTypeUID: FormControl<string>;
  supplierUID: FormControl<string>;
  contractNo: FormControl<string>;
  name: FormControl<string>;
  total: FormControl<string>;
  currencyUID: FormControl<string>;
  description: FormControl<string>;
}> { }

@Component({
  selector: 'emp-pmt-contract-header',
  templateUrl: './contract-header.component.html',
})
export class ContractHeaderComponent implements OnInit, OnChanges {

  @Input() isSaved = false;

  @Input() contract: Contract = EmptyContract;

  @Input() canEdit = false;

  @Output() contractHeaderEvent = new EventEmitter<EventInfo>();

  form: ContractFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  organizationalUnitsList: Identifiable[] = [];

  budgetTypesList: Identifiable[] = [];

  contractTypesList: Identifiable[] = [];

  suppliersList: Identifiable[] = [];

  currenciesList: Identifiable[] = [];


  constructor(private messageBox: MessageBoxService) {
    this.initForm();
    this.enableEditor(true);
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.contract && this.isSaved) {
      this.enableEditor(false);
      this.validateDataLists();
    }
  }


  get hasActions(): boolean {
    return false; // Object.values(this.actions).some(x => !!x);
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      let eventType = ContractHeaderEventType.CREATE;

      if (this.isSaved) {
        eventType = ContractHeaderEventType.UPDATE;
      }

      sendEvent(this.contractHeaderEvent, eventType, { contractFields: this.getFormData() });
    }
  }


  onDeleteButtonClicked() {
    this.showConfirmMessage(ContractHeaderEventType.DELETE);
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;

    if (!this.editionMode && this.isSaved) {
      this.setFormData();
    }

    const disable = this.isSaved && !this.editionMode //(!this.editionMode || !this.actions.canUpdate);

    setTimeout(() => this.formHelper.setDisableForm(this.form, disable));
  }


  private loadDataLists() {

  }


  private validateDataLists() {
    this.organizationalUnitsList =
      ArrayLibrary.insertIfNotExist(this.organizationalUnitsList ?? [], this.contract.managedByOrgUnit, 'uid');
    this.budgetTypesList =
      ArrayLibrary.insertIfNotExist(this.budgetTypesList ?? [], this.contract.budgetType, 'uid');
    this.contractTypesList =
      ArrayLibrary.insertIfNotExist(this.contractTypesList ?? [], this.contract.contractType, 'uid');
    this.suppliersList =
      ArrayLibrary.insertIfNotExist(this.suppliersList ?? [], this.contract.supplier, 'uid');
    this.currenciesList =
      ArrayLibrary.insertIfNotExist(this.currenciesList ?? [], this.contract.currency, 'uid');
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      managedByOrgUnitUID: [''],
      budgetTypeUID: [''],
      datePeriod: [EmptyDateRange],
      signDate: ['' as DateString],
      contractTypeUID: [''],
      supplierUID: [''],
      contractNo: [''],
      name: [''],
      total: [''],
      currencyUID: [''],
      description: [''],
    });
  }


  private setFormData() {
    setTimeout(() => {
      this.form.reset({
        managedByOrgUnitUID: isEmpty(this.contract.managedByOrgUnit) ? null : this.contract.managedByOrgUnit.uid,
        budgetTypeUID: isEmpty(this.contract.budgetType) ? null : this.contract.budgetType.uid,
        datePeriod: { fromDate: this.contract.fromDate ?? null, toDate: this.contract.toDate ?? null },
        signDate: this.contract.signDate ?? '',
        contractTypeUID: isEmpty(this.contract.contractType) ? null : this.contract.contractType.uid,
        supplierUID: isEmpty(this.contract.supplier) ? null : this.contract.supplier.uid,
        contractNo: this.contract.contractNo ?? '',
        name: this.contract.name ?? '',
        total: FormatLibrary.numberWithCommas(this.contract.total, '1.2-2'),
        currencyUID: isEmpty(this.contract.currency) ? null : this.contract.currency.uid,
        description: this.contract.description ?? '',
      });
    });
  }


  private getFormData(): ContractFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const data: ContractFields = {
      contractTypeUID: this.form.value.contractTypeUID ?? null,
      contractNo: this.form.value.contractNo ?? null,
      name: this.form.value.name ?? null,
      description: this.form.value.description ?? null,
      budgetTypeUID: this.form.value.budgetTypeUID ?? null,
      managedByOrgUnitUID: this.form.value.managedByOrgUnitUID ?? null,
      fromDate: this.form.value.datePeriod.fromDate ?? null,
      toDate: this.form.value.datePeriod.toDate ?? null,
      signDate: this.form.value.signDate ?? null,
      supplierUID: this.form.value.supplierUID ?? null,
      currencyUID: this.form.value.currencyUID ?? null,
      total: !this.form.value.total ? null : FormatLibrary.stringToNumber(this.form.value.total),
    };

    return data;
  }


  private showConfirmMessage(eventType: ContractHeaderEventType) {
    const confirmType = this.getConfirmType(eventType);
    const title = this.getConfirmTitle(eventType);
    const message = this.getConfirmMessage(eventType);

    this.messageBox.confirm(message, title, confirmType)
      .firstValue()
      .then(x => this.validateAndSendEvent(eventType, x));
  }


  private getConfirmType(eventType: ContractHeaderEventType): 'AcceptCancel' | 'DeleteCancel' {
    switch (eventType) {
      case ContractHeaderEventType.DELETE:
        return 'DeleteCancel';
      default:
        return 'AcceptCancel';
    }
  }


  private getConfirmTitle(eventType: ContractHeaderEventType): string {
    switch (eventType) {
      case ContractHeaderEventType.DELETE: return 'Eliminar contrato';
      default: return '';
    }
  }


  private getConfirmMessage(eventType: ContractHeaderEventType): string {
    switch (eventType) {
      case ContractHeaderEventType.DELETE:
        return `Esta operación eliminará el contrato
                <strong>${this.contract.contractNo}: ${this.contract.contractType.name}</strong>
                (${this.contract.contractType.name})
                del proveedor <strong>${this.contract.supplier.name}</strong>.

                <br><br>¿Elimino el contrato?`;

      default: return '';
    }
  }


  private validateAndSendEvent(eventType: ContractHeaderEventType, send: boolean) {
    if (send) {
      sendEvent(this.contractHeaderEvent, eventType, { contractUID: this.contract.uid });
    }
  }

}
