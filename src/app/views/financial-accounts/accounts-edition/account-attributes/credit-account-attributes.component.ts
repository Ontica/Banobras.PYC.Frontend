/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { FormHelper } from '@app/shared/utils';

import { AccountAttributes, buildCreditAttributes, CreditAttributes,
         EmptyCreditAttributes } from '@app/models';


@Component({
  selector: 'emp-cf-credit-account-attributes',
  templateUrl: './credit-account-attributes.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CreditAccountAttributesComponent),
      multi: true
    },
  ]
})
export class CreditAccountAttributesComponent implements ControlValueAccessor {

  @Input() showError = false;

  @Input() errors = null;

  @Input() required = false;

  @Input() editionMode = false;

  @Output() changes = new EventEmitter<any>();

  value: AccountAttributes;

  onChange: (value: CreditAttributes) => void;

  onTouched: () => void;

  disabled: boolean;

  selectedData: CreditAttributes = EmptyCreditAttributes;

  formHelper = FormHelper;

  creditTypesList = [];

  creditStagesList = [];


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

}
