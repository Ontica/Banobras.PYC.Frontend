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

import { BudgetingStateSelector, CataloguesStateSelector,
         PaymentsStateSelector } from '@app/presentation/exported.presentation.types';

import { empExpandCollapse, FormHelper, sendEvent } from '@app/shared/utils';

import { BudgetType, EmptyPaymentOrdersQuery, PaymentOrdersQuery, PaymentOrderStatus, PaymentOrderStatusList,
         RequestsList } from '@app/models';


export enum PaymentOrdersFilterEventType {
  SEARCH_CLICKED = 'PaymentOrdersFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'PaymentOrdersFilterComponent.Event.ClearClicked',
}

interface PaymentOrdersFilterFormModel extends FormGroup<{
  status: FormControl<PaymentOrderStatus>;
  requesterOrgUnitUID: FormControl<string>;
  paymentOrderTypeUID: FormControl<string>;
  budgetTypeUID: FormControl<string>;
  keywords: FormControl<string>;
  fromDate: FormControl<DateString>;
  toDate: FormControl<DateString>;
}> { }

@Component({
  selector: 'emp-pmt-payment-orders-filter',
  templateUrl: './payment-orders-filter.component.html',
  animations: [empExpandCollapse],
})
export class PaymentOrdersFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() query: PaymentOrdersQuery = Object.assign({}, EmptyPaymentOrdersQuery);

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() paymentOrdersFilterEvent = new EventEmitter<EventInfo>();

  form: PaymentOrdersFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  statusList: Identifiable<PaymentOrderStatus>[] = PaymentOrderStatusList;

  orgUnitsList: Identifiable[] = [];

  paymentOrderTypesList: Identifiable[] = [];

  budgetTypesList: Identifiable[] = [];

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
      sendEvent(this.paymentOrdersFilterEvent, PaymentOrdersFilterEventType.SEARCH_CLICKED,
        { query: this.getFormData() });
    }
  }


  onClearFilters() {
    this.clearFilters();
    sendEvent(this.paymentOrdersFilterEvent, PaymentOrdersFilterEventType.CLEAR_CLICKED,
      { query: this.getFormData() });
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(CataloguesStateSelector.ORGANIZATIONAL_UNITS,
        { requestsList: RequestsList.payments }),
      this.helper.select<BudgetType[]>(BudgetingStateSelector.BUDGET_TYPES),
      this.helper.select<BudgetType[]>(PaymentsStateSelector.PAYMENT_ORDER_TYPES),
    ])
    .subscribe(([a, b, c]) => {
      this.orgUnitsList = a;
      this.budgetTypesList = b;
      this.paymentOrderTypesList = c;
      this.isLoading = false;
    });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      status: [null],
      requesterOrgUnitUID: [null],
      budgetTypeUID: [null],
      paymentOrderTypeUID: [null],
      keywords: [null],
      fromDate: [null],
      toDate: [null],
    });
  }


  private setFormData() {
    this.form.reset({
      status: this.query.status,
      requesterOrgUnitUID: this.query.requesterOrgUnitUID,
      budgetTypeUID: this.query.budgetTypeUID,
      paymentOrderTypeUID: this.query.paymentOrderTypeUID,
      keywords: this.query.keywords,
      fromDate: this.query.fromDate,
      toDate: this.query.toDate,
    });
  }


  private getFormData(): PaymentOrdersQuery {
    const query: PaymentOrdersQuery = {
      status: this.form.value.status ?? null,
      requesterOrgUnitUID: this.form.value.requesterOrgUnitUID ?? null,
      paymentOrderTypeUID: this.form.value.paymentOrderTypeUID ?? null,
      keywords: this.form.value.keywords ?? null,
      fromDate: this.form.value.fromDate,
      toDate: this.form.value.toDate,

      budgetTypeUID: this.form.value.budgetTypeUID ?? null,
      payToUID: null,
      paymentMethodUID: null,
      budgetUID: null,
    };

    return query;
  }


  private clearFilters() {
    this.form.reset();
  }

}
