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

import { EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { BudgetingStateSelector, CataloguesStateSelector,
         PaymentsStateSelector } from '@app/presentation/exported.presentation.types';

import { empExpandCollapse, FormHelper, sendEvent } from '@app/shared/utils';

import { BudgetType, DateRange, EmptyDateRange, EmptyPaymentOrdersQuery, PaymentOrdersQuery,
         PaymentOrderStatus, PaymentOrderStatusList, RequestsList } from '@app/models';


export enum PaymentOrdersFilterEventType {
  SEARCH_CLICKED = 'PaymentOrdersFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'PaymentOrdersFilterComponent.Event.ClearClicked',
}

interface PaymentOrdersFilterFormModel extends FormGroup<{
  status: FormControl<PaymentOrderStatus>;
  requesterOrgUnitUID: FormControl<string>;
  paymentOrderTypeUID: FormControl<string>;
  paymentMethod: FormControl<string>;
  budgetUID: FormControl<string>;
  datePeriod: FormControl<DateRange>;
  keywords: FormControl<string>;
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

  budgetTypesList: BudgetType[] = [];

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
      this.helper.select<Identifiable[]>(PaymentsStateSelector.PAYMENT_ORDER_TYPES),
      this.helper.select<Identifiable[]>(CataloguesStateSelector.PAYMENTS_METHODS),
    ])
    .subscribe(([a, b, c, d]) => {
      this.orgUnitsList = a;
      this.budgetTypesList = b;
      this.paymentOrderTypesList = c;
      this.paymentMethodsList = d;
      this.isLoading = false;
    });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      status: [null],
      requesterOrgUnitUID: [null],
      budgetUID: [null],
      paymentOrderTypeUID: [null],
      paymentMethod: [null],
      keywords: [null],
      datePeriod: [EmptyDateRange],
    });
  }


  private setFormData() {
    this.form.reset({
      status: this.query.status,
      requesterOrgUnitUID: this.query.requesterOrgUnitUID,
      budgetUID: this.query.budgetUID,
      paymentOrderTypeUID: this.query.paymentOrderTypeUID,
      paymentMethod: this.query.paymentMethodUID,
      keywords: this.query.keywords,
      datePeriod: { fromDate: this.query.fromDate ?? null, toDate: this.query.toDate ?? null },
    });
  }


  private getFormData(): PaymentOrdersQuery {
    const query: PaymentOrdersQuery = {
      status: this.form.value.status ?? null,
      requesterOrgUnitUID: this.form.value.requesterOrgUnitUID ?? null,
      keywords: this.form.value.keywords ?? null,
      fromDate: this.form.value.datePeriod?.fromDate ?? '',
      toDate: this.form.value.datePeriod?.toDate ?? '',
      paymentOrderTypeUID: this.form.value.paymentOrderTypeUID ?? null,
      paymentMethodUID: this.form.value.paymentMethod ?? null,
      budgetUID: this.form.value.budgetUID ?? null,

      payToUID: null,
    };

    return query;
  }


  private clearFilters() {
    this.form.reset();
  }

}
