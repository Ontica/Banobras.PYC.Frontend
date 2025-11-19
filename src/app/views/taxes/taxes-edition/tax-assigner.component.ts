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

import { TaxEntry, TaxEntryFields } from '@app/models';


export enum TaxAssignerEventType {
  ASSIGN_BUTTON_CLICKED = 'TaxAssignerComponent.Event.AssignButtonClicked',
}

interface TaxAssignerFormModel extends FormGroup<{
  taxTypeUID: FormControl<string>;
  total: FormControl<number>;
}> { }

@Component({
  selector: 'emp-financial-tax-assigner',
  templateUrl: './tax-assigner.component.html',
})
export class TaxAssignerComponent implements OnChanges, OnInit, OnDestroy {

  @Input() orderUID = null;

  @Input() taxes: TaxEntry[] = [];

  @Output() taxAssignerEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: TaxAssignerFormModel;

  formHelper = FormHelper;

  isLoading = false;

  taxTypesList: Identifiable[] = [];


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
      sendEvent(this.taxAssignerEvent, TaxAssignerEventType.ASSIGN_BUTTON_CLICKED,
        { orderUID: this.orderUID, dataFields: this.getFormData() });
    }
  }


  private loadDataLists() {
    this.isLoading = true;

    this.helper.select<Identifiable[]>(CataloguesStateSelector.TAX_TYPES)
      .subscribe(x => {
        this.taxTypesList = x;
        this.isLoading = false;
      });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      taxTypeUID: ['', Validators.required],
      total: [null as number, Validators.required],
    });
  }


  private resetFormData() {
    this.form.reset();
  }


  private getFormData(): TaxEntryFields {
    Assertion.assert(!!this.orderUID, 'Programming error: orderUID must be valid.');
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const data: TaxEntryFields = {
      orderUID: this.orderUID,
      taxTypeUID: this.form.value.taxTypeUID ?? null,
      total: this.form.value.total ?? 0,
    };

    return data;
  }

}
