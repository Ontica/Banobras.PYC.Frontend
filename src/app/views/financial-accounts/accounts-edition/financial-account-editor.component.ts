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

import { Assertion, EventInfo, Identifiable, isEmpty, Validate } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { FinancialProjectsDataService } from '@app/data-services';

import { AccountAttributes, CreditAttributes, EmptyFinancialAccount, FinancialAccount, FinancialAccountFields,
         FinancialData, ObjectTypes, RequestsList } from '@app/models';


export enum FinancialAccountEditorEventType {
  CLOSE_BUTTON_CLICKED = 'FinancialAccountEditorComponent.Event.CloseButtonClicked',
  CREATE_CLICKED       = 'FinancialAccountEditorComponent.Event.CreateClicked',
  UPDATE_CLICKED       = 'FinancialAccountEditorComponent.Event.UpdateClicked',
}

interface FinancialAccountFormModel extends FormGroup<{
  financialAccountTypeUID: FormControl<string>;
  standardAccountUID: FormControl<string>;
  organizationalUnitUID: FormControl<string>;
  currencyUID: FormControl<string>;
  tags: FormControl<string[]>;
  description: FormControl<string>;
  attributes: FormControl<AccountAttributes>;
  financialData: FormControl<FinancialData>;
}> { }

@Component({
  selector: 'emp-cf-financial-account-editor',
  templateUrl: './financial-account-editor.component.html',
})
export class FinancialAccountEditorComponent implements OnChanges, OnInit, OnDestroy {

  @Input() projectUID = '';

  @Input() organizationalUnitUID = '';

  @Input() account: FinancialAccount = EmptyFinancialAccount;

  @Input() canUpdate = false;

  @Output() financialAccountEditorEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: FinancialAccountFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  orgUnitsList: Identifiable[] = [];

  accountTypesList: Identifiable[] = [];

  standardAccountsList: Identifiable[] = [];

  currenciesList: Identifiable[] = [];


  constructor(private uiLayer: PresentationLayer,
              private projectsData: FinancialProjectsDataService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (!this.isSaved) {
      this.enableCreateMode();
    }

    if (this.isSaved && changes.account) {
      this.enableUpdateMode();
    }
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get title(): string {
    if (!this.isSaved) return 'Agregar cuenta';

    return `${this.canUpdate ?
      'Editar cuenta' :
      'Cuenta'} - ${this.account.accountNo}`;
  }


  get isSaved(): boolean {
    return !isEmpty(this.account);
  }


  get isCreditAccount(): boolean {
    return this.form.value.financialAccountTypeUID === ObjectTypes.CREDIT_ACCOUNT;
  }


  onFinancialAccountTypeChanges(type: Identifiable) {
    const hasCreditTypeId = !!this.form.getRawValue().attributes &&
      !!this.form.getRawValue().attributes['creditTypeId'];

    const creditTypeId = !hasCreditTypeId ? null : this.form.getRawValue().attributes['creditTypeId'];

    this.validateCreditAttributesFieldsRequired(!creditTypeId ? null : creditTypeId);
  }


  onCreditAccountChanges(value: CreditAttributes) {
    this.validateCreditAttributesFieldsRequired(!value.creditTypeId ? null : value.creditTypeId);
  }


  onCloseButtonClicked() {
    sendEvent(this.financialAccountEditorEvent, FinancialAccountEditorEventType.CLOSE_BUTTON_CLICKED);
  }


  onSubmitButtonClicked() {
    if (FormHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.isSaved ? FinancialAccountEditorEventType.UPDATE_CLICKED :
        FinancialAccountEditorEventType.CREATE_CLICKED;

      const payload = {
        projectUID: this.projectUID,
        accountUID: this.isSaved ? this.account?.uid : null,
        dataFields: this.getFormData()
      };

      sendEvent(this.financialAccountEditorEvent, eventType, payload);
    }
  }


  private enableUpdateMode() {
    this.editionMode = this.canUpdate;

    if (this.isSaved) {
      this.setFormData();
    }

    this.validateFormDisabled();
  }


  private enableCreateMode() {
    this.editionMode = true;
    this.setDefaultFormData();
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS, { requestsList: RequestsList.cashflow }),
      this.helper.select<Identifiable[]>(CataloguesStateSelector.CURRENCIES),
      this.projectsData.getStandardAccounts(this.projectUID),
      this.projectsData.getFinancialAccountsTypes(this.projectUID),
    ])
    .subscribe(([a, b, c, d]) => {
      this.orgUnitsList = a;
      this.currenciesList = b,
      this.standardAccountsList = c;
      this.accountTypesList = d;
      this.isLoading = false;
    });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      financialAccountTypeUID: ['', Validators.required],
      standardAccountUID: ['', Validators.required],
      organizationalUnitUID: ['', Validators.required],
      currencyUID: ['', Validators.required],
      tags: [null],
      description: [''],
      attributes: [null],
      financialData: [null],
    });
  }


  private setDefaultFormData() {
    setTimeout(() => {
      this.form.reset({
        organizationalUnitUID: !this.organizationalUnitUID ? '' : this.organizationalUnitUID,
      });
    });
  }


  private setFormData() {
    setTimeout(() => {
      this.form.reset({
        organizationalUnitUID: isEmpty(this.account.organizationalUnit) ? null : this.account.organizationalUnit.uid,
        financialAccountTypeUID: isEmpty(this.account.financialAccountType) ? null : this.account.financialAccountType.uid,
        standardAccountUID: isEmpty(this.account.standardAccount) ? null : this.account.standardAccount.uid,
        currencyUID: isEmpty(this.account.currency) ? null : this.account.currency.uid,
        tags: this.account.tags ?? [],
        description: this.account.description ?? null,
        attributes: this.account.attributes ?? null,
        financialData: this.account.financialData ?? null,
      });
    });

    const creditTypeId = (this.account.attributes as CreditAttributes).creditTypeId;
    this.validateCreditAttributesFieldsRequired(!creditTypeId ? null : creditTypeId);
  }


  private validateFormDisabled() {
    FormHelper.setDisableForm(this.form, !this.canUpdate);
  }


  private validateCreditAttributesFieldsRequired(creditTypeId: number) {
    if ([].includes(creditTypeId)) {
      FormHelper.setControlValidators(this.form.controls.attributes,
        [Validate.objectFieldsRequired('creditAccountingAccount')]);
    } else {
      FormHelper.clearControlValidators(this.form.controls.attributes);
    }
  }


  private getFormData(): FinancialAccountFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: FinancialAccountFields = {
      financialAccountTypeUID: formModel.financialAccountTypeUID ?? '',
      standardAccountUID: formModel.standardAccountUID ?? '',
      organizationalUnitUID: formModel.organizationalUnitUID ?? '',
      currencyUID: formModel.currencyUID ?? null,
      tags: formModel.tags ?? [],
      description: formModel.description ?? '',
      attributes: formModel.attributes ?? null,
      financialData: formModel.financialData ?? null,
    };

    return data;
  }

}
