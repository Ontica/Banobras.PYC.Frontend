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

import { RequestsStateSelector } from '@app/presentation/exported.presentation.types';

import { FormHelper, sendEvent, empExpandCollapse } from '@app/shared/utils';

import { CataloguesDataService } from '@app/data-services';

import { EmptyPaymentsOrdersQuery, PaymentOrderStatus, PaymentOrderStatusList, PaymentsOrdersQuery,
         PaymentsOrdersStatus, RequestsList } from '@app/models';


export enum PaymentsOrdersFilterEventType {
  SEARCH_CLICKED = 'PaymentsOrdersFilterComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'PaymentsOrdersFilterComponent.Event.ClearClicked',
}

interface PaymentsOrdersFilterFormModel extends FormGroup<{
  status: FormControl<PaymentsOrdersStatus>;
  requesterOrgUnitUID: FormControl<string>;
  paymentOrderType: FormControl<string>;
  paymentMethod: FormControl<string>;
  keywords: FormControl<string>;
  fromDate: FormControl<DateString>;
  toDate: FormControl<DateString>;
}> { }

@Component({
  selector: 'emp-payments-orders-filter',
  templateUrl: './payments-orders-filter.component.html',
  animations: [empExpandCollapse],
})
export class PaymentsOrdersFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() query: PaymentsOrdersQuery = Object.assign({}, EmptyPaymentsOrdersQuery);

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() paymentsOrdersFilterEvent = new EventEmitter<EventInfo>();

  form: PaymentsOrdersFilterFormModel;

  formHelper = FormHelper;

  isLoading = false;

  paymentOrderStatusList: PaymentOrderStatus[] = PaymentOrderStatusList;

  requesterOrgUnitsList: Identifiable[] = [];

  paymentOrderTypesList: Identifiable[] = [];

  paymentMethodsList: Identifiable[] = [];

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private cataloguesData: CataloguesDataService) {
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
      sendEvent(this.paymentsOrdersFilterEvent, PaymentsOrdersFilterEventType.SEARCH_CLICKED,
        { query: this.getFormData() });
    }
  }


  onClearFilters() {
    this.clearFilters();
    sendEvent(this.paymentsOrdersFilterEvent, PaymentsOrdersFilterEventType.CLEAR_CLICKED,
      { query: this.getFormData() });
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(RequestsStateSelector.ORGANIZATIONAL_UNITS,
        { requestsList: RequestsList.payments }),
      this.cataloguesData.getPaymentOrderTypes(),
      this.cataloguesData.getPaymentMethods(),
    ])
    .subscribe(([a, b, c]) => {
      this.requesterOrgUnitsList = a;
      this.paymentOrderTypesList = b;
      this.paymentMethodsList = c;
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


  private getFormData(): PaymentsOrdersQuery {
    const query: PaymentsOrdersQuery = {
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
