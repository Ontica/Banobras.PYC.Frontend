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

import { Assertion, EventInfo, Identifiable, Validate, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { ArrayLibrary, FormHelper, sendEvent } from '@app/shared/utils';

import { EmptyPaymentAccount, PaymentAccount, PaymentAccountFields, PaymentMethod} from '@app/models';


export enum PaymentAccountEditorEventType {
  CLOSE_BUTTON_CLICKED = 'PaymentAccountEditorComponent.Event.CloseButtonClicked',
  CREATE_CLICKED       = 'PaymentAccountEditorComponent.Event.CreateClicked',
  UPDATE_CLICKED       = 'PaymentAccountEditorComponent.Event.UpdateClicked',
}

interface PaymentAccountFormModel extends FormGroup<{
  identificator: FormControl<string>;
  accountNo: FormControl<string>;
  holderName: FormControl<string>;
  referenceNumber: FormControl<string>;
  accountTypeUID: FormControl<string>;
  institutionUID: FormControl<string>;
  paymentMethodUID: FormControl<string>;
  currencyUID: FormControl<string>;
  askForReferenceNumber: FormControl<boolean>;
}> { }

@Component({
  selector: 'emp-ng-payment-account-editor',
  templateUrl: './payment-account-editor.component.html',
})
export class PaymentAccountEditorComponent implements OnChanges, OnInit, OnDestroy {

  @Input() supplierUID = '';

  @Input() paymentAccount: PaymentAccount = EmptyPaymentAccount;

  @Input() canUpdate = false;

  @Output() paymentAccountEditorEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: PaymentAccountFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  accountTypesList: Identifiable[] = [];

  institutionsList: Identifiable[] = [];

  paymentMethodsList: Identifiable[] = [];

  currenciesList: Identifiable[] = [];


  constructor(private uiLayer: PresentationLayer) {
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

    if (this.isSaved && changes.paymentAccount) {
      this.enableUpdateMode();
    }
  }

  ngOnDestroy() {
    this.helper.destroy();
  }


  get title(): string {
    if (!this.isSaved) return 'Agregar cuenta';

    return this.canUpdate ?
      `Editar cuenta - ${this.paymentAccount.name}` :
      `Cuenta - ${this.paymentAccount.name}`;
  }


  get isSaved(): boolean {
    return !isEmpty(this.paymentAccount);
  }


  onCloseButtonClicked() {
    sendEvent(this.paymentAccountEditorEvent, PaymentAccountEditorEventType.CLOSE_BUTTON_CLICKED);
  }


  onSubmitButtonClicked() {
    if (FormHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.isSaved ? PaymentAccountEditorEventType.UPDATE_CLICKED :
        PaymentAccountEditorEventType.CREATE_CLICKED;

      const payload = {
        supplierUID: this.supplierUID,
        paymentAccountUID: this.isSaved ? this.paymentAccount?.uid : null,
        dataFields: this.getFormData(),
      };

      sendEvent(this.paymentAccountEditorEvent, eventType, payload);
    }
  }


  private enableUpdateMode() {
    this.editionMode = this.canUpdate;
    this.setFormDataForUpdate();
    this.validateFormDisabled();
  }


  private enableCreateMode() {
    this.editionMode = true;
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.CURRENCIES),
      this.helper.select<Identifiable[]>(CataloguesStateSelector.FINANCIAL_INSTITUTIONS),
      this.helper.select<Identifiable[]>(CataloguesStateSelector.PAYMENT_ACCOUNT_TYPES),
      this.helper.select<PaymentMethod[]>(CataloguesStateSelector.PAYMENTS_METHODS),
    ])
    .subscribe(([a, b, c, d]) => {
      this.currenciesList = a;
      this.institutionsList = b;
      this.accountTypesList = c;
      this.paymentMethodsList = d;
      this.validateDataLists();
      this.isLoading = false;
    });
  }


  private validateDataLists() {
    if (this.isSaved) {
      this.accountTypesList =
        ArrayLibrary.insertIfNotExist(this.accountTypesList ?? [], this.paymentAccount.accountType, 'uid');
      this.institutionsList =
        ArrayLibrary.insertIfNotExist(this.institutionsList ?? [], this.paymentAccount.institution, 'uid');
      this.paymentMethodsList =
        ArrayLibrary.insertIfNotExist(this.paymentMethodsList ?? [], this.paymentAccount.paymentMethod, 'uid');
      this.currenciesList =
        ArrayLibrary.insertIfNotExist(this.currenciesList ?? [], this.paymentAccount.currency, 'uid');
    }
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      accountTypeUID: ['', Validators.required],
      paymentMethodUID: ['', Validators.required],
      currencyUID: ['', Validators.required],
      accountNo: ['', [Validate.digitsValue, Validators.minLength(18), Validators.maxLength(18)]],
      identificator: [''],
      institutionUID: [''],
      holderName: [''],
      askForReferenceNumber: [false],
      referenceNumber: [''],
    });
  }


  private setFormDataForUpdate() {
    setTimeout(() => {
      this.form.reset({
        identificator: this.paymentAccount.identificator ?? '',
        accountNo: this.paymentAccount.accountNo ?? '',
        holderName: this.paymentAccount.holderName ?? '',
        referenceNumber: this.paymentAccount.referenceNumber ?? '',
        accountTypeUID: FormHelper.getUIDValue(this.paymentAccount.accountType),
        institutionUID: FormHelper.getUIDValue(this.paymentAccount.institution),
        paymentMethodUID: FormHelper.getUIDValue(this.paymentAccount.paymentMethod),
        currencyUID: FormHelper.getUIDValue(this.paymentAccount.currency),
        askForReferenceNumber: this.paymentAccount.askForReferenceNumber,
      });

      this.validateDataLists();
    });
  }


  private validateFormDisabled() {
    setTimeout(() => {
      const disable = this.isSaved && (!this.editionMode || !this.canUpdate);
      FormHelper.setDisableForm(this.form, disable);
    });
  }


  private getFormData(): PaymentAccountFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: PaymentAccountFields = {
      identificator: formModel.identificator ?? '',
      accountNo: formModel.accountNo ?? '',
      holderName: formModel.holderName ?? '',
      accountTypeUID: formModel.accountTypeUID ?? '',
      institutionUID: formModel.institutionUID ?? '',
      paymentMethodUID: formModel.paymentMethodUID ?? '',
      currencyUID: formModel.currencyUID ?? '',
      askForReferenceNumber: formModel.askForReferenceNumber,
      referenceNumber: formModel.askForReferenceNumber ? '' : formModel.referenceNumber ?? '',
    };

    return data;
  }

}
