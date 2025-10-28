/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { STANDALONE_IMPORTS } from '@app/shared/standalone-imports';

import { FormHelper } from '@app/shared/utils';

import { FinancialProjectGoals, EmptyFinancialProjectGoals, buildFinancialProjectGoals } from '@app/models';


@Component({
  selector: 'emp-financial-project-goals',
  templateUrl: './project-goals.component.html',
  standalone: true,
  imports: [
    ...STANDALONE_IMPORTS,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FinancialProjectGoalsComponent),
      multi: true
    },
  ]
})
export class FinancialProjectGoalsComponent implements ControlValueAccessor {

  @Input() showError = false;

  @Input() errors = null;

  @Input() required = false;

  @Input() editionMode = false;

  @Output() changes = new EventEmitter<any>();

  value: FinancialProjectGoals;

  onChange: (value: FinancialProjectGoals) => void;

  onTouched: () => void;

  disabled: boolean;

  selectedData: FinancialProjectGoals = EmptyFinancialProjectGoals;

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


  writeValue(value: FinancialProjectGoals) {
    const data = !value ? EmptyFinancialProjectGoals : value;
    this.setSelectedData(data);
    this.value = data;
  }


  onSelectedDataChanged() {
    const value = buildFinancialProjectGoals(this.selectedData);
    this.onChange(value);
    this.changes.emit(value);
  }


  private setSelectedData(data: FinancialProjectGoals) {
    this.selectedData = Object.assign({}, EmptyFinancialProjectGoals, data);
  }

}
