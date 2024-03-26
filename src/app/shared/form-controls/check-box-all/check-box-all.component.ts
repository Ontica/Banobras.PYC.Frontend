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
    <mat-checkbox
      [color]="showWarning ? 'warn' : 'primary'"
      [checked]="isChecked()"
      [indeterminate]="isIndeterminate()"
      [disabled]="disabled"
      [class.no-label]="!text"
      (change)="toggleSelection($event)"
      (click)="$event.stopPropagation()">
      {{text}}
    </mat-checkbox>
  `
})
export class CheckboxAllComponent {

  @Input() selection: SelectionModel<any>;
  @Input() values = [];
  @Input() text = '';
  @Input() disabled = false;
  @Input() indeterminated = false;
  @Input() showWarning = false;
  @Output() selectionChange = new EventEmitter<SelectionModel<any>>();

  isChecked(): boolean {
    return this.selection.hasValue() && this.selection.selected.length === this.values.length;
  }

  isIndeterminate(): boolean {
    return (this.selection.hasValue() && this.selection.selected.length !== this.values.length) ||
      (this.disabled && this.indeterminated);
  }

  toggleSelection(change: MatCheckboxChange): void {
    if (change.checked) {
      this.values.forEach(value => this.selection.select(value));
    } else {
      this.selection.clear();
    }

    this.selectionChange.emit(this.selection);
  }

}
