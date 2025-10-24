/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, Identifiable } from '@app/core';

import { CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { FinancialAccountOperationFields } from '@app/models';


export enum OperationAssignerEventType {
  ASSIGN_BUTTON_CLICKED = 'FinancialAccountOperationAssignerComponent.Event.AssignButtonClicked',
}

interface OperationAssignerFormModel extends FormGroup<{
  operationAccountTypeUID: FormControl<string>;
  accountNo: FormControl<string>;
  currencyUID: FormControl<string>;
}> { }

@Component({
  selector: 'emp-financial-operation-assigner',
  templateUrl: './operation-assigner.component.html',
})
export class FinancialAccountOperationAssignerComponent implements OnChanges, OnInit, OnDestroy {

  @Input() accountUID = '';

  @Input() operations: Identifiable[] = [];

  @Output() operationAssignerEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: OperationAssignerFormModel;

  formHelper = FormHelper;

  isLoading = false;

  currenciesList: Identifiable[] = [];


  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnChanges() {
    this.resetFormData();
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onAssignClicked() {
    if (FormHelper.isFormReadyAndInvalidate(this.form)) {
      sendEvent(this.operationAssignerEvent, OperationAssignerEventType.ASSIGN_BUTTON_CLICKED,
        { accountUID: this.accountUID, dataFields: this.getFormData() });
    }
  }


  private loadDataLists() {
    this.isLoading = true;

    this.helper.select<Identifiable[]>(CataloguesStateSelector.CURRENCIES)
      .subscribe(x => {
        this.currenciesList = x;
        this.isLoading = false;
      });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      operationAccountTypeUID: ['', Validators.required],
      currencyUID: ['', Validators.required],
      accountNo: ['', Validators.required],
    });
  }


  private resetFormData() {
    this.form.reset();
  }


  private getFormData(): FinancialAccountOperationFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const data: FinancialAccountOperationFields = {
      operationAccountTypeUID: this.form.value.operationAccountTypeUID ?? null,
      currencyUID: this.form.value.currencyUID ?? null,
      accountNo: this.form.value.accountNo ?? null,
    };

    return data;
  }

}
