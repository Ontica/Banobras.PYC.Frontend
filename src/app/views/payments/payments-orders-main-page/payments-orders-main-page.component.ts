/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { PaymentOrdersDataService } from '@app/data-services';

import { EmptyPaymentOrder, EmptyPaymentsOrdersQuery, PaymentOrder, PaymentOrderDescriptor,
         PaymentsOrdersQuery } from '@app/models';

import {
  PaymentsOrdersExplorerEventType
} from '../payments-orders-explorer/payments-orders-explorer.component';


@Component({
  selector: 'emp-payments-orders-main-page',
  templateUrl: './payments-orders-main-page.component.html',
})
export class PaymentsOrdersMainPageComponent implements OnDestroy {

  query: PaymentsOrdersQuery = Object.assign({}, EmptyPaymentsOrdersQuery);

  paymentsOrdersList: PaymentOrderDescriptor[] = [];

  selectedPaymentOrder: PaymentOrder = EmptyPaymentOrder;

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private paymentOrdersData: PaymentOrdersDataService,
              private messageBox: MessageBoxService)  {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onPaymentsOrdersExplorerEvent(event: EventInfo) {
    switch (event.type as PaymentsOrdersExplorerEventType) {
      case PaymentsOrdersExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as PaymentsOrdersQuery);
        this.searchPaymentsOrders(this.query);
        return;

      case PaymentsOrdersExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as PaymentsOrdersQuery);
        return;

      case PaymentsOrdersExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, ' event.payload.item');
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        this.messageBox.showInDevelopment('Detalle del pago', event.payload);
        return;

      case PaymentsOrdersExplorerEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        this.messageBox.showInDevelopment('Ejecutar operación', event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchPaymentsOrders(query: PaymentsOrdersQuery) {
    this.isLoading = true;

    this.paymentOrdersData.searchPaymentsOrders(query)
      .firstValue()
      .then(x => this.resolveSearchPaymentsOrders(x))
      .finally(() => this.isLoading = false);
  }


  private resolveSearchPaymentsOrders(data: PaymentOrderDescriptor[]) {
    this.setPaymentsOrdersList(data, true);
  }


  private setQueryAndClearExplorerData(query: PaymentsOrdersQuery) {
    this.query = Object.assign({}, query);
    this.clearPaymentsOrdersList();
  }


  private clearPaymentsOrdersList() {
    this.setPaymentsOrdersList([], false);
  }


  private setPaymentsOrdersList(data: PaymentOrderDescriptor[], queryExecuted: boolean = true) {
    this.paymentsOrdersList = data ?? [];
    this.queryExecuted = queryExecuted;
  }

}
