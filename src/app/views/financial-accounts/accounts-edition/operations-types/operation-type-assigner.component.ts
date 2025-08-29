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

import { FinancialAccountOperationTypeFields } from '@app/models';


export enum OperationTypeAssignerEventType {
  ASSIGN_BUTTON_CLICKED = 'FinancialAccountOperationTypeAssignerComponent.Event.AssignButtonClicked',
}

interface OperationTypeAssignerFormModel extends FormGroup<{
  operationTypeUID: FormControl<string>;
  operationNo: FormControl<string>;
  currencyUID: FormControl<string>;
}> { }

@Component({
  selector: 'emp-cf-operation-type-assigner',
  templateUrl: './operation-type-assigner.component.html',
})
export class FinancialAccountOperationTypeAssignerComponent implements OnChanges, OnInit, OnDestroy {

  @Input() accountUID = '';

  @Input() operationsTypes: Identifiable[] = [];

  @Output() operationTypeAssignerEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: OperationTypeAssignerFormModel;

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
      sendEvent(this.operationTypeAssignerEvent, OperationTypeAssignerEventType.ASSIGN_BUTTON_CLICKED,
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
      operationTypeUID: ['', Validators.required],
      operationNo: ['', Validators.required],
      currencyUID: ['', Validators.required],
    });
  }


  private resetFormData() {
    this.form.reset();
  }


  private getFormData(): FinancialAccountOperationTypeFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const data: FinancialAccountOperationTypeFields = {
      operationUID: this.form.value.operationTypeUID ?? null,
      operationNo: this.form.value.operationNo ?? null,
      currencyUID: this.form.value.currencyUID ?? null,
    };

    return data;
  }

}
