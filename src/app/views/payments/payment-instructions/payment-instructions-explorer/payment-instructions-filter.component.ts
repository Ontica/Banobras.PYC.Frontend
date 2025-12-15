/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { combineLatest } from 'rxjs';

import { DateString, EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { CataloguesStateSelector, PaymentsStateSelector } from '@app/presentation/exported.presentation.types';

import { FormHelper, sendEvent, empExpandCollapse } from '@app/shared/utils';

import { EmptyPaymentInstructionsQuery, PaymentInstructionStatusList, PaymentInstructionsQuery,
         PaymentInstructionsStatus, RequestsList } from '@app/models';


export enum PaymentInstructionsFilterEventType {
  SEARCH_CLICKED = 'PaymentInstructionsFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'PaymentInstructionsFilterComponent.Event.ClearClicked',
}

interface PaymentInstructionsFilterFormModel extends FormGroup<{
  status: FormControl<PaymentInstructionsStatus>;
  requesterOrgUnitUID: FormControl<string>;
  paymentOrderType: FormControl<string>;
  paymentMethod: FormControl<string>;
  keywords: FormControl<string>;
  fromDate: FormControl<DateString>;
  toDate: FormControl<DateString>;
}> { }

@Component({
  selector: 'emp-pmt-payment-instructions-filter',
  templateUrl: './payment-instructions-filter.component.html',
  animations: [empExpandCollapse],
})
export class PaymentInstructionsFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() query: PaymentInstructionsQuery = Object.assign({}, EmptyPaymentInstructionsQuery);

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() paymentInstructionsFilterEvent = new EventEmitter<EventInfo>();

  form: PaymentInstructionsFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  statusList: Identifiable<PaymentInstructionsStatus>[] = PaymentInstructionStatusList;

  requesterOrgUnitsList: Identifiable[] = [];

  paymentInstructionTypesList: Identifiable[] = [];

  paymentMethodsList: Identifiable[] = [];

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.query) {
      this.setFormData();
    }
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onShowFiltersClicked() {
    this.showFilters = !this.showFilters;
    this.showFiltersChange.emit(this.showFilters);
  }


  onSearchClicked() {
    if (this.form.valid) {
      sendEvent(this.paymentInstructionsFilterEvent, PaymentInstructionsFilterEventType.SEARCH_CLICKED,
        { query: this.getFormData() });
    }
  }


  onClearFilters() {
    this.clearFilters();
    sendEvent(this.paymentInstructionsFilterEvent, PaymentInstructionsFilterEventType.CLEAR_CLICKED,
      { query: this.getFormData() });
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS,
        { requestsList: RequestsList.payments }),
      // this.helper.select<Identifiable[]>(PaymentsStateSelector.PAYMENT_INSTRUCTION_TYPES),
      this.helper.select<Identifiable[]>(CataloguesStateSelector.PAYMENTS_METHODS),
    ])
    .subscribe(([a, b]) => {
      this.requesterOrgUnitsList = a;
      // this.paymentInstructionTypesList = b;
      this.paymentMethodsList = b;
      this.isLoading = false;
    });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      status: [null],
      requesterOrgUnitUID: [null],
      paymentOrderType: [null],
      paymentMethod: [null],
      keywords: [null],
      fromDate: [null],
      toDate: [null],
    });
  }


  private setFormData() {
    this.form.reset({
      status: this.query.status,
      requesterOrgUnitUID: this.query.requesterOrgUnitUID,
      paymentOrderType: this.query.paymentOrderTypeUID,
      paymentMethod: this.query.paymentMethodUID,
      keywords: this.query.keywords,
      fromDate: this.query.fromDate,
      toDate: this.query.toDate,
    });
  }


  private getFormData(): PaymentInstructionsQuery {
    const query: PaymentInstructionsQuery = {
      status: this.form.value.status ?? null,
      requesterOrgUnitUID: this.form.value.requesterOrgUnitUID ?? null,
      paymentOrderTypeUID: this.form.value.paymentOrderType ?? null,
      paymentMethodUID: this.form.value.paymentMethod ?? null,
      keywords: this.form.value.keywords ?? null,
      fromDate: this.form.value.fromDate,
      toDate: this.form.value.toDate,
    };

    return query;
  }


  private clearFilters() {
    this.form.reset();
  }

}
