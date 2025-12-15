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

import { buildExplorerHint, EmptyPaymentInstructionsQuery, PaymentInstructionDescriptor,
         PaymentInstructionsQuery } from '@app/models';

import { PaymentInstructionsFilterEventType } from './payment-instructions-filter.component';

import { PaymentInstructionsListEventType } from './payment-instructions-list.component';


export enum PaymentInstructionsExplorerEventType {
  SEARCH_CLICKED            = 'PaymentInstructionsExplorerComponent.Event.SearchClicked',
  CLEAR_CLICKED             = 'PaymentInstructionsExplorerComponent.Event.ClearClicked',
  EXECUTE_OPERATION_CLICKED = 'PaymentInstructionsExplorerComponent.Event.ExecuteOperationClicked',
  SELECT_CLICKED            = 'PaymentInstructionsExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-pmt-payment-instructions-explorer',
  templateUrl: './payment-instructions-explorer.component.html',
})
export class PaymentInstructionsExplorerComponent implements OnChanges {

  @Input() query: PaymentInstructionsQuery = Object.assign({}, EmptyPaymentInstructionsQuery);

  @Input() dataList: PaymentInstructionDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() paymentInstructionsExplorerEvent = new EventEmitter<EventInfo>();

  hint = 'Seleccionar los filtros';

  showFilters = false;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.setText();
      this.showFilters = false;
    }
  }


  onPaymentInstructionsFilterEvent(event: EventInfo) {
    switch (event.type as PaymentInstructionsFilterEventType) {
      case PaymentInstructionsFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.paymentInstructionsExplorerEvent, PaymentInstructionsExplorerEventType.SEARCH_CLICKED,
          event.payload);
        return;
      case PaymentInstructionsFilterEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.paymentInstructionsExplorerEvent, PaymentInstructionsExplorerEventType.CLEAR_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onPaymentInstructionsListEvent(event: EventInfo) {
    switch (event.type as PaymentInstructionsListEventType) {
      case PaymentInstructionsListEventType.SELECT_ITEM:
        Assertion.assertValue(event.payload.item, 'event.payload.item');
        sendEvent(this.paymentInstructionsExplorerEvent, PaymentInstructionsExplorerEventType.SELECT_CLICKED,
          event.payload);
        return;
      case PaymentInstructionsListEventType.EXECUTE_OPERATION:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        sendEvent(this.paymentInstructionsExplorerEvent, PaymentInstructionsExplorerEventType.EXECUTE_OPERATION_CLICKED,
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
