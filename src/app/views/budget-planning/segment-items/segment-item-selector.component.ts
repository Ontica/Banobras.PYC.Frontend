/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, forwardRef } from '@angular/core';

import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { BudgetSegmentItem } from '@app/models';

import { BudgetPlanningStateSelector } from '@app/presentation/exported.presentation.types';

@Component({
  selector: 'emp-budg-segment-item-selector',
  templateUrl: './segment-item-selector.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SegmentItemSelectorComponent),
      multi: true
    },
  ]
})

export class SegmentItemSelectorComponent implements OnInit, OnDestroy {

  @Input() segmentType = '';

  @Input() showError = false;

  @Input() multiple = true;

  @Input() required = true;

  @Input() placeholder = 'Seleccionar';

  @Output() valueChange = new EventEmitter<string | string[]>();

  isLoading = false;

  segmentItems: Identifiable[] = [];

  disabled: boolean;

  value: any;

  propagateChange = (_: any) => { };

  propagateTouch = () => { };

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.getSegmentItemsByType();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onBlur() {
    this.propagateTouch();
  }


  onSelectChange(value: BudgetSegmentItem | BudgetSegmentItem[]) {
    this.setValue(value)
    this.propagateChange(this.value);
    this.valueChange.emit(this.value);
    this.onBlur();
  }


  writeValue(value: any) {
    if (value) {
      this.value = value;
    } else {
      this.value = this.multiple ? [] : '';
    }
  }


  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }


  registerOnTouched(fn: any) {
    this.propagateTouch = fn;
  }


  setDisabledState?(isDisabled: boolean) {
    this.disabled = isDisabled;
  }


  private setValue(value: BudgetSegmentItem | BudgetSegmentItem[]) {
    if (value instanceof Array) {
      this.value = value ? value.map(x => x.uid) : [];
      return;
    }

    if (typeof value === 'string') {
      this.value = value ? value : '';
      return;
    }

    this.value = this.multiple ? [] : '';
  }


  private getSegmentItemsByType() {
    this.isLoading = true;

    this.helper.select<BudgetSegmentItem[]>(BudgetPlanningStateSelector.SEGMENT_ITEMS_BY_TYPE,
      {segmentType: this.segmentType})
      .subscribe(x => {
        this.segmentItems = x.map(x => this.mapBudgetSegmentItemToIdentifiable(x));
        this.isLoading = x.length === 0;
      });
  }


  private mapBudgetSegmentItemToIdentifiable(item: BudgetSegmentItem) {
    return {
      uid: item.uid,
      name: item.code + ' - ' + item.name,
    };
  }

}
