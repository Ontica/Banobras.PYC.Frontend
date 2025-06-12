/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, forwardRef } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { FormHelper } from '@app/shared/utils';

import { buildCreditFinancialData, CreditFinancialData, EmptyCreditFinancialData,
         FinancialData } from '@app/models';


@Component({
  selector: 'emp-cf-credit-financial-data',
  templateUrl: './credit-financial-data.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CreditFinancialDataComponent),
      multi: true
    },
  ]
})
export class CreditFinancialDataComponent implements ControlValueAccessor, OnInit, OnDestroy {

  @Input() showError = false;

  @Input() errors = null;

  @Input() required = false;

  @Input() editionMode = false;

  @Output() changes = new EventEmitter<any>();

  value: FinancialData;

  onChange: (value: CreditFinancialData) => void;

  onTouched: () => void;

  disabled: boolean;

  selectedData: CreditFinancialData = EmptyCreditFinancialData;

  formHelper = FormHelper;

  isLoading = false;

  interestRateTypesList: Identifiable[] = [];

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


  writeValue(value: CreditFinancialData) {
    const data = !value ? EmptyCreditFinancialData : value;
    this.setSelectedData(data);
    this.value = data;
  }


  onSelectedDataChanged() {
    const value = buildCreditFinancialData(this.selectedData);
    this.onChange(value);
    this.changes.emit(value);
  }


  private setSelectedData(data: CreditFinancialData) {
    this.selectedData = Object.assign({}, EmptyCreditFinancialData, data);
  }


  private loadDataLists() {
    this.isLoading = true;

    this.helper.select<Identifiable[]>(CataloguesStateSelector.INTEREST_RATE_TYPES)
      .subscribe(x => {
        this.interestRateTypesList = x;
        this.isLoading = x.length === 0;
      });
  }

}
