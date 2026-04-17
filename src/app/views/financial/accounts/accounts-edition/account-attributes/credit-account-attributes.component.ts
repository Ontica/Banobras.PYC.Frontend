/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, forwardRef } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { combineLatest } from 'rxjs';

import { Identifiable } from '@app/core';

import { ArrayLibrary, FormHelper } from '@app/shared/utils';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { FinancialStateSelector } from '@app/presentation/exported.presentation.types';

import { AccountAttributes, buildCreditAttributes, CreditAttributes,
         EmptyCreditAttributes } from '@app/models';


@Component({
  selector: 'emp-financial-credit-account-attributes',
  templateUrl: './credit-account-attributes.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CreditAccountAttributesComponent),
      multi: true
    },
  ]
})
export class CreditAccountAttributesComponent implements ControlValueAccessor, OnInit, OnDestroy {

  @Input() showError = false;

  @Input() errors = null;

  @Input() required = false;

  @Input() editionMode = false;

  @Input() canEditExternalData = false;

  @Input() isExternalCredit = false;

  @Output() changes = new EventEmitter<any>();

  value: AccountAttributes;

  onChange: (value: CreditAttributes) => void;

  onTouched: () => void;

  disabled: boolean;

  selectedData: CreditAttributes = EmptyCreditAttributes;

  formHelper = FormHelper;

  isLoading = false;

  creditTypesList = [];

  creditRiskStagesList = [];

  creditProcessStagesList = [];

  creditProjectTypes = [];

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  registerOnChange(fn: any): void {
    this.onChange = fn;
  }


  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }


  setDisabledState?(isDisabled: boolean) {
    this.disabled = isDisabled;
  }


  writeValue(value: CreditAttributes) {
    const data = !value ? EmptyCreditAttributes : value;
    this.setSelectedData(data);
    this.setDefaultDataLists();
    this.value = data;
  }


  onSelectedDataChanged() {
    const value = buildCreditAttributes(this.selectedData);
    this.onChange(value);
    this.changes.emit(value);
  }


  private setSelectedData(data: CreditAttributes) {
    this.selectedData = Object.assign({}, EmptyCreditAttributes, data);
  }


  private setDefaultDataLists() {
    this.creditTypesList =
      ArrayLibrary.insertIfNotExist(this.creditTypesList ?? [], this.selectedData.creditType, 'uid');
    this.creditRiskStagesList =
      ArrayLibrary.insertIfNotExist(this.creditRiskStagesList ?? [], this.selectedData.creditRiskStage, 'uid');
    this.creditProcessStagesList =
      ArrayLibrary.insertIfNotExist(this.creditProcessStagesList ?? [], this.selectedData.creditProcessStage, 'uid');
    this.creditProjectTypes =
      ArrayLibrary.insertIfNotExist(this.creditProjectTypes ?? [], this.selectedData.creditProjectType, 'uid');
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(FinancialStateSelector.CREDIT_PROJECT_TYPES),
      this.helper.select<Identifiable[]>(FinancialStateSelector.CREDIT_TYPES),
      this.helper.select<Identifiable[]>(FinancialStateSelector.CREDIT_RISK_STAGES),
      this.helper.select<Identifiable[]>(FinancialStateSelector.CREDIT_PROCESS_STAGES),
    ])
    .subscribe(([a, b, c, d]) => {
      this.creditProjectTypes = a;
      this.creditTypesList = b;
      this.creditRiskStagesList = c;
      this.creditProcessStagesList = d;
      this.setDefaultDataLists();
      this.isLoading = a.length === 0;
    });
  }

}
