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

import { EmptyPaymentOrdersQuery, PaymentOrderDescriptor, PaymentOrdersQuery,
         buildExplorerHint } from '@app/models';

import { PaymentOrdersFilterEventType } from './payment-orders-filter.component';

import { PaymentOrdersListEventType } from './payment-orders-list.component';


export enum PaymentOrdersExplorerEventType {
  CREATE_CLICKED            = 'PaymentOrdersExplorerComponent.Event.CreateClicked',
  SEARCH_CLICKED            = 'PaymentOrdersExplorerComponent.Event.SearchClicked',
  CLEAR_CLICKED             = 'PaymentOrdersExplorerComponent.Event.ClearClicked',
  EXECUTE_OPERATION_CLICKED = 'PaymentOrdersExplorerComponent.Event.ExecuteOperationClicked',
  SELECT_CLICKED            = 'PaymentOrdersExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-pmt-payment-orders-explorer',
  templateUrl: './payment-orders-explorer.component.html',
})
export class PaymentOrdersExplorerComponent implements OnChanges {

  @Input() query: PaymentOrdersQuery = Object.assign({}, EmptyPaymentOrdersQuery);

  @Input() dataList: PaymentOrderDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() paymentOrdersExplorerEvent = new EventEmitter<EventInfo>();

  hint = 'Seleccionar los filtros';

  showFilters = false;

  PERMISSION_TO_CREATE = PERMISSIONS.NOT_REQUIRED;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.setText();
      this.showFilters = false;
    }
  }


  onCreatePaymentOrderClicked() {
    sendEvent(this.paymentOrdersExplorerEvent, PaymentOrdersExplorerEventType.CREATE_CLICKED);
  }


  onPaymentOrdersFilterEvent(event: EventInfo) {
    switch (event.type as PaymentOrdersFilterEventType) {
      case PaymentOrdersFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.paymentOrdersExplorerEvent, PaymentOrdersExplorerEventType.SEARCH_CLICKED,
          event.payload);
        return;
      case PaymentOrdersFilterEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.paymentOrdersExplorerEvent, PaymentOrdersExplorerEventType.CLEAR_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onPaymentOrdersListEvent(event: EventInfo) {
    switch (event.type as PaymentOrdersListEventType) {
      case PaymentOrdersListEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, 'event.payload.item');
        sendEvent(this.paymentOrdersExplorerEvent, PaymentOrdersExplorerEventType.SELECT_CLICKED,
          event.payload);
        return;
      case PaymentOrdersListEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        sendEvent(this.paymentOrdersExplorerEvent, PaymentOrdersExplorerEventType.EXECUTE_OPERATION_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setText() {
    this.hint = buildExplorerHint(this.queryExecuted, this.dataList.length);
  }

}
