/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { PERMISSIONS } from '@app/main-layout';

import { sendEvent } from '@app/shared/utils';

import { EmptyPaymentsOrdersQuery, PaymentOrderDescriptor, PaymentsOrdersQuery } from '@app/models';

import { PaymentsOrdersFilterEventType } from './payments-orders-filter.component';

import { PaymentsOrdersListEventType } from './payments-orders-list.component';


export enum PaymentsOrdersExplorerEventType {
  CREATE_CLICKED            = 'PaymentsOrdersExplorerComponent.Event.CreateClicked',
  SEARCH_CLICKED            = 'PaymentsOrdersExplorerComponent.Event.SearchClicked',
  CLEAR_CLICKED             = 'PaymentsOrdersExplorerComponent.Event.ClearClicked',
  EXECUTE_OPERATION_CLICKED = 'PaymentsOrdersExplorerComponent.Event.ExecuteOperationClicked',
  SELECT_CLICKED            = 'PaymentsOrdersExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-pmt-payments-orders-explorer',
  templateUrl: './payments-orders-explorer.component.html',
})
export class PaymentsOrdersExplorerComponent implements OnChanges {

  @Input() query: PaymentsOrdersQuery = Object.assign({}, EmptyPaymentsOrdersQuery);

  @Input() dataList: PaymentOrderDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() paymentsOrdersExplorerEvent = new EventEmitter<EventInfo>();

  cardTitle = 'Ordenes de pago';

  cardHint = 'Seleccionar los filtros';

  showFilters = false;

  PERMISSION_TO_CREATE = PERMISSIONS.NOT_REQUIRED;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.setText();
      this.showFilters = false;
    }
  }


  onCreatePaymentOrderClicked() {
    sendEvent(this.paymentsOrdersExplorerEvent, PaymentsOrdersExplorerEventType.CREATE_CLICKED);
  }


  onPaymentsOrdersFilterEvent(event: EventInfo) {
    switch (event.type as PaymentsOrdersFilterEventType) {
      case PaymentsOrdersFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.paymentsOrdersExplorerEvent, PaymentsOrdersExplorerEventType.SEARCH_CLICKED,
          event.payload);
        return;

      case PaymentsOrdersFilterEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.paymentsOrdersExplorerEvent, PaymentsOrdersExplorerEventType.CLEAR_CLICKED,
          event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onPaymentsOrdersListEvent(event: EventInfo) {
    switch (event.type as PaymentsOrdersListEventType) {
      case PaymentsOrdersListEventType.SELECT_ITEM:
        Assertion.assertValue(event.payload.item, 'event.payload.item');
        sendEvent(this.paymentsOrdersExplorerEvent, PaymentsOrdersExplorerEventType.SELECT_CLICKED,
          event.payload);
        return;

      case PaymentsOrdersListEventType.EXECUTE_OPERATION:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        sendEvent(this.paymentsOrdersExplorerEvent, PaymentsOrdersExplorerEventType.EXECUTE_OPERATION_CLICKED,
          event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setText() {
    if (!this.queryExecuted) {
      this.cardHint = 'Seleccionar los filtros';
      return;
    }

    this.cardHint = `${this.dataList.length} registros encontrados`;
  }

}
