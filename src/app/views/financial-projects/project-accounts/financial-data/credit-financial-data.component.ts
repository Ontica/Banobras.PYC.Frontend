/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
export class CreditFinancialDataComponent implements ControlValueAccessor {

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

}
