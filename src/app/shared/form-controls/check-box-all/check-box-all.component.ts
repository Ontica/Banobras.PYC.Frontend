/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';

import { MatCheckboxChange } from '@angular/material/checkbox';


@Component({
  selector: 'emp-ng-check-box-all',
  template: `
  <span class="checkbox-tooltip" [title]="getTooltip()">

    <mat-checkbox empNgStopPropagation
      [color]="showWarning ? 'warn' : 'primary'"
      [checked]="isChecked()"
      [indeterminate]="isIndeterminate()"
      [disabled]="isDisabled()"
      [class.no-label]="!text"
      (change)="toggleSelection($event)">
      {{text}}
    </mat-checkbox>

  </span>
  `
})
export class CheckboxAllComponent {

  @Input() selection: SelectionModel<any>;

  @Input() values: any[] = [];

  @Input() filteredValues: any[] = null;

  @Input() text = '';

  @Input() disabled = false;

  @Input() indeterminated = false;

  @Input() showWarning = false;

  @Output() selectionChange = new EventEmitter<SelectionModel<any>>();


  get displayedValues(): any[] {
    return this.filteredValues !== null ? this.filteredValues : this.values;
  }


  getTooltip(): string {
    if (this.disabled) {
      return '';
    }

    if (this.filteredValues !== null && this.filteredValues?.length === 0 && this.values?.length > 0) {
      return 'No hay resultados visibles para seleccionar';
    }

    return 'Todos';
  }


  isChecked(): boolean {
    return this.selection.hasValue() && this.displayedValues.length > 0 &&
           this.displayedValues.every(v => this.selection.isSelected(v));
  }


  isIndeterminate(): boolean {
    const selectedInView = this.displayedValues.filter(v => this.selection.isSelected(v)).length;
    return this.selection.hasValue() && selectedInView > 0 && selectedInView < this.displayedValues.length;
  }


  isDisabled(): boolean {
    return this.disabled ||
      (this.filteredValues !== null && this.filteredValues?.length === 0 && this.values?.length > 0);
  }


  toggleSelection(change: MatCheckboxChange) {
    if (change.checked) {
      this.displayedValues.forEach(value => this.selection.select(value));
    } else {
      this.displayedValues.forEach(value => this.selection.deselect(value));
    }

    this.selectionChange.emit(this.selection);
  }

}
