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

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountsStateSelector, CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { ArrayLibrary, FormHelper, sendEvent } from '@app/shared/utils';

import { FinancialProjectsDataService } from '@app/data-services';

import { AccountAttributes, CreditAttributes, EmptyFinancialAccount, FinancialAccount, FinancialAccountFields,
         FinancialData, ObjectTypes, RequestsList } from '@app/models';

import { ExternalCreditSearcherEventType } from './external-credit/external-credit-searcher.component';


export enum AccountHeaderEventType {
  CREATE_CLICKED           = 'FinancialAccountHeaderComponent.Event.CreateClicked',
  UPDATE_CLICKED           = 'FinancialAccountHeaderComponent.Event.UpdateClicked',
  CREATE_EXTERNAL_CLICKED  = 'FinancialAccountHeaderComponent.Event.CreateExternalClicked',
  REFRESH_EXTERNAL_CLICKED = 'FinancialAccountHeaderComponent.Event.RefreshExternalClicked',
}

interface AccountFormModel extends FormGroup<{
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
  selector: 'emp-cf-account-header',
  templateUrl: './account-header.component.html',
})
export class FinancialAccountHeaderComponent implements OnChanges, OnInit, OnDestroy {

  @Input() projectUID = '';

  @Input() organizationalUnitUID = '';

  @Input() account: FinancialAccount = EmptyFinancialAccount;

  @Input() canUpdate = false;

  @Output() accountHeaderEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: AccountFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  orgUnitsList: Identifiable[] = [];

  accountTypesList: Identifiable[] = [];

  standardAccountsList: Identifiable[] = [];

  currenciesList: Identifiable[] = [];

  hasExternalData = false;


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


  get displayCreditAccountSearcher(): boolean {
    return !this.isSaved && this.isCreditAccount;
  }


  get submitTextButton(): string {
    if (!this.isSaved) {
      return 'Agregar';
    } else {
      return this.isCreditAccount ? 'Refrescar' : 'Guardar';
    }
  }


  get isFormReady(): boolean {
    if (this.isSaved) {
      return this.isCreditAccount ? true : FormHelper.isFormReady(this.form);
    } else {
      return this.isCreditAccount ?
        this.hasExternalData && !!this.form.value.financialAccountTypeUID :
        FormHelper.isFormReady(this.form);
    }
  }


  onFinancialAccountTypeChanges(type: Identifiable) {
    this.resetCreditData(EmptyFinancialAccount);
    this.validateDisabledControls();
  }


  onExternalCreditSearcherEvent(event: EventInfo) {
    switch (event.type as ExternalCreditSearcherEventType) {
      case ExternalCreditSearcherEventType.DATA_CHANGED:
        this.resetCreditData(!event.payload.data ? EmptyFinancialAccount : event.payload.data);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onSubmitButtonClicked() {
    if (!this.isFormReady) {
      FormHelper.isFormReadyAndInvalidate(this.form)
      return;
    }

    const eventType = this.getEventType();
    const payload = this.buildPayload();

    sendEvent(this.accountHeaderEvent, eventType, payload);
  }


  private getEventType(): AccountHeaderEventType {
    const eventMap = {
      create: this.isCreditAccount ? AccountHeaderEventType.CREATE_EXTERNAL_CLICKED : AccountHeaderEventType.CREATE_CLICKED,
      update: this.isCreditAccount ? AccountHeaderEventType.REFRESH_EXTERNAL_CLICKED: AccountHeaderEventType.UPDATE_CLICKED,
    };

    return this.isSaved ? eventMap.update : eventMap.create;
  }


  private buildPayload() {
    return {
      projectUID: this.projectUID,
      accountUID: this.isSaved ? this.account?.uid : null,
      dataFields: this.getFormData(),
    };
  }


  private enableUpdateMode() {
    this.editionMode = this.canUpdate;

    if (this.isSaved) {
      this.setFormData(this.account);
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
      this.helper.select<Identifiable[]>(AccountsStateSelector.ACCOUNTS_TYPES_LIST),
      this.projectsData.getStandardAccounts(this.projectUID),
    ])
    .subscribe(([a, b, c, d]) => {
      this.orgUnitsList = a;
      this.currenciesList = b,
      this.accountTypesList = c;
      this.standardAccountsList = d;
      this.validateDataLists(this.account);
      this.isLoading = false;
    });
  }


  private validateDataLists(account: FinancialAccount) {
    this.orgUnitsList =
      ArrayLibrary.insertIfNotExist(this.orgUnitsList ?? [], account.organizationalUnit, 'uid');
    this.standardAccountsList =
      ArrayLibrary.insertIfNotExist(this.standardAccountsList ?? [], account.standardAccount, 'uid');
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
        organizationalUnitUID: isEmpty({uid: this.organizationalUnitUID}) ? '' : this.organizationalUnitUID,
      });
    });
  }


  private setFormData(account: FinancialAccount) {
    setTimeout(() => {
      this.validateDataLists(account);

      this.form.reset({
        financialAccountTypeUID: isEmpty(account.financialAccountType) ? null : account.financialAccountType.uid,
        organizationalUnitUID: isEmpty(account.organizationalUnit) ? null : account.organizationalUnit.uid,
        standardAccountUID: isEmpty(account.standardAccount) ? null : account.standardAccount.uid,
        currencyUID: isEmpty(account.currency) ? null : account.currency.uid,
        tags: account.tags ?? [],
        description: account.description ?? null,
        attributes: account.attributes ?? null,
        financialData: account.financialData ?? null,
      });
    });
  }


  private resetCreditData(account: FinancialAccount) {
    setTimeout(() => {
      this.hasExternalData = !!(account?.attributes as CreditAttributes)?.externalCreditNo;
      this.validateDataLists(account);

      const financialAccountTypeUID = this.form.value.financialAccountTypeUID;
      const organizationalUnitUID = this.isCreditAccount ?
        isEmpty(account.organizationalUnit) ? null : account.organizationalUnit.uid :
        this.form.value.organizationalUnitUID;

      this.form.reset({
        financialAccountTypeUID,
        organizationalUnitUID,
        standardAccountUID: isEmpty(account.standardAccount) ? null : account.standardAccount.uid,
        currencyUID: isEmpty(account.currency) ? null : account.currency.uid,
        tags: account.tags ?? [],
        description: account.description ?? null,
        attributes: account.attributes ?? null,
        financialData: account.financialData ?? null,
      });
    });
  }


  private validateFormDisabled() {
    setTimeout(() => {
      if (this.isCreditAccount) FormHelper.setDisableForm(this.form);
      else FormHelper.setDisableForm(this.form, !this.canUpdate);
    })
  }


  private validateDisabledControls() {
    FormHelper.setDisableControl(this.form.controls.organizationalUnitUID, this.isCreditAccount);
    FormHelper.setDisableControl(this.form.controls.currencyUID, this.isCreditAccount);
    FormHelper.setDisableControl(this.form.controls.description, this.isCreditAccount);
    FormHelper.setDisableControl(this.form.controls.financialData, this.isCreditAccount);
  }


  private getFormData(): FinancialAccountFields {
    const formModel = this.form.getRawValue();

    const data: FinancialAccountFields = {
      financialAccountTypeUID: formModel.financialAccountTypeUID ?? '',
      standardAccountUID: formModel.standardAccountUID ?? '',
      organizationalUnitUID: formModel.organizationalUnitUID ?? '',
      currencyUID: formModel.currencyUID ?? null,
      tags: formModel.tags ?? [],
      description: formModel.description ?? '',
      attributes: this.isCreditAccount ? formModel.attributes ?? null : null,
      financialData: this.isCreditAccount ? formModel.financialData ?? null : null,
    };

    return data;
  }

}
