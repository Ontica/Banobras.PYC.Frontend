/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { combineLatest } from 'rxjs';

import { Assertion, DateString, EventInfo, Identifiable, isEmpty, Validate } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { BudgetingStateSelector, CataloguesStateSelector,
         PaymentsStateSelector } from '@app/presentation/exported.presentation.types';

import { MessageBoxService } from '@app/shared/services';

import { ArrayLibrary, FormatLibrary, FormHelper, sendEvent } from '@app/shared/utils';

import { SearcherAPIS } from '@app/data-services';

import { ContractActions, Contract, ContractFields, DateRange, EmptyContractActions, EmptyContract,
         EmptyDateRange, RequestsList } from '@app/models';


export enum ContractHeaderEventType {
  CREATE = 'ContractHeaderComponent.Event.CreateContract',
  UPDATE = 'ContractHeaderComponent.Event.UpdateContract',
  DELETE = 'ContractHeaderComponent.Event.DeleteContract',
}

interface ContractFormModel extends FormGroup<{
  managedByOrgUnitUID: FormControl<string>;
  budgetTypeUID: FormControl<string>;
  isForMultipleOrgUnits: FormControl<boolean>;
  contractTypeUID: FormControl<string>;
  currencyUID: FormControl<string>;
  name: FormControl<string>;
  contractNo: FormControl<string>;
  datePeriod: FormControl<DateRange>;
  signDate: FormControl<DateString>;
  supplierUID: FormControl<string>;
  description: FormControl<string>;
}> { }

@Component({
  selector: 'emp-pmt-contract-header',
  templateUrl: './contract-header.component.html',
})
export class ContractHeaderComponent implements OnInit, OnChanges, OnDestroy {

  @Input() isSaved = false;

  @Input() contract: Contract = EmptyContract;

  @Input() actions: ContractActions = EmptyContractActions;

  @Output() contractHeaderEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: ContractFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  orgUnitsList: Identifiable[] = [];

  budgetTypesList: Identifiable[] = [];

  contractTypesList: Identifiable[] = [];

  currenciesList: Identifiable[] = [];

  suppliersAPI = SearcherAPIS.suppliers;


  constructor(private uiLayer: PresentationLayer,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
    this.enableEditor(true);
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.contract && this.isSaved) {
      this.enableEditor(false);
      this.validateDataLists();
    }
  }


  get hasActions(): boolean {
    return this.actions.canUpdate || this.actions.canDelete;
  }


  onContractNoChange() {
    this.validateFieldsRequired();
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      let eventType = ContractHeaderEventType.CREATE;

      if (this.isSaved) {
        eventType = ContractHeaderEventType.UPDATE;
      }

      sendEvent(this.contractHeaderEvent, eventType, { dataFields: this.getFormData() });
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

    this.validateFormDisabled();
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS,
        { requestsList: RequestsList.contracts }),
      this.helper.select<Identifiable[]>(BudgetingStateSelector.BUDGET_TYPES),
      this.helper.select<Identifiable[]>(PaymentsStateSelector.CONTRACTS_TYPES),
      this.helper.select<Identifiable[]>(CataloguesStateSelector.CURRENCIES),
    ])
    .subscribe(([a, b, c, d]) => {
      this.orgUnitsList = a;
      this.budgetTypesList = b;
      this.contractTypesList = c;
      this.currenciesList = d;
      this.isLoading = false;
    });
  }


  private validateDataLists() {
    this.orgUnitsList =
      ArrayLibrary.insertIfNotExist(this.orgUnitsList ?? [], this.contract.managedByOrgUnit, 'uid');
    this.budgetTypesList =
      ArrayLibrary.insertIfNotExist(this.budgetTypesList ?? [], this.contract.budgetType, 'uid');
    this.contractTypesList =
      ArrayLibrary.insertIfNotExist(this.contractTypesList ?? [], this.contract.contractType, 'uid');
    this.currenciesList =
      ArrayLibrary.insertIfNotExist(this.currenciesList ?? [], this.contract.currency, 'uid');
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      managedByOrgUnitUID: ['', Validators.required],
      budgetTypeUID: ['', Validators.required],
      isForMultipleOrgUnits: [false],
      contractTypeUID: ['', Validators.required],
      datePeriod: [EmptyDateRange],
      signDate: ['' as DateString],
      supplierUID: [''],
      contractNo: [''],
      name: ['', Validators.required],
      currencyUID: ['', Validators.required],
      description: [''],
    });
  }


  private setFormData() {
    setTimeout(() => {
      this.form.reset({
        managedByOrgUnitUID: isEmpty(this.contract.managedByOrgUnit) ? null : this.contract.managedByOrgUnit.uid,
        budgetTypeUID: isEmpty(this.contract.budgetType) ? null : this.contract.budgetType.uid,
        isForMultipleOrgUnits: this.contract.isForMultipleOrgUnits,
        contractTypeUID: isEmpty(this.contract.contractType) ? null : this.contract.contractType.uid,
        currencyUID: isEmpty(this.contract.currency) ? null : this.contract.currency.uid,
        name: this.contract.name ?? '',
        contractNo: this.contract.contractNo ?? '',
        datePeriod: { fromDate: this.contract.fromDate ?? null, toDate: this.contract.toDate ?? null },
        signDate: this.contract.signDate ?? '',
        supplierUID: isEmpty(this.contract.supplier) ? null : this.contract.supplier.uid,
        description: this.contract.description ?? '',
      });

      this.validateFieldsRequired();
    });
  }


  private validateFieldsRequired() {
    const fieldsRequired = !!this.form.value.contractNo;

    if (fieldsRequired) {
      this.formHelper.setControlValidators(this.form.controls.contractNo, [Validators.required]);
      this.formHelper.setControlValidators(this.form.controls.supplierUID, [Validators.required]);
      this.formHelper.setControlValidators(this.form.controls.datePeriod, [Validators.required, Validate.periodRequired]);
      this.formHelper.setControlValidators(this.form.controls.signDate, [Validators.required]);
    } else {
      this.formHelper.clearControlValidators(this.form.controls.contractNo);
      this.formHelper.clearControlValidators(this.form.controls.supplierUID);
      this.formHelper.clearControlValidators(this.form.controls.datePeriod);
      this.formHelper.clearControlValidators(this.form.controls.signDate);
    }
  }


  private validateFormDisabled() {
    setTimeout(() => {
      const disable = this.isSaved && (!this.editionMode || !this.actions.canUpdate);
      this.formHelper.setDisableForm(this.form, disable);
    });
  }


  private getFormData(): ContractFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const data: ContractFields = {
      managedByOrgUnitUID: this.form.value.managedByOrgUnitUID ?? null,
      budgetTypeUID: this.form.value.budgetTypeUID ?? null,
      isForMultipleOrgUnits: this.form.value.isForMultipleOrgUnits,
      contractTypeUID: this.form.value.contractTypeUID ?? null,
      currencyUID: this.form.value.currencyUID ?? null,
      name: this.form.value.name ?? null,
      contractNo: this.form.value.contractNo ?? null,
      supplierUID: this.form.value.supplierUID ?? '',
      fromDate: !this.form.value.datePeriod.fromDate ? null : this.form.value.datePeriod.fromDate,
      toDate: !this.form.value.datePeriod.toDate ? null : this.form.value.datePeriod.toDate,
      signDate: !this.form.value.signDate ? null : this.form.value.signDate,
      description: this.form.value.description ?? null,
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
        const contractNo = !this.contract.contractNo ? '' : `${this.contract.contractNo}: `;
        const contractSupplier = isEmpty(this.contract.supplier) ? '' :
          `del proveedor <strong>${this.contract.supplier.name}</strong>`;

        return `Esta operación eliminará el contrato <strong>${contractNo} ${this.contract.name}</strong>
                (${this.contract.contractType.name}) ${contractSupplier}.
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
