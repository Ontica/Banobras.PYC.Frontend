/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { SkipIf } from '@app/shared/decorators';

import { FormatLibrary, sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { OrderHolder, PaymentOrderDescriptor, PaymentOrderRequestFields } from '@app/models';

import { OrdersDataService, PayablesDataService } from '@app/data-services';

import { PaymentOrderRequestEventType } from './payment-order-request.component';

import { PaymentsOrdersTableEventType } from './payments-orders-table.component';


export enum PaymentsOrdersEditionEventType {
  UPDATED = 'PaymentsOrdersEditionComponent.Event.Updated',
}

@Component({
  selector: 'emp-pmt-payments-orders-edition',
  templateUrl: './payments-orders-edition.component.html',
})
export class PaymentsOrdersEditionComponent {

  @Input() entityUID: string = null;

  @Input() entityName: string = 'la orden';

  @Input() entityTotal: number = 0;

  @Input() supplierUID: string = null;

  @Input() paymentsOrders: PaymentOrderDescriptor[] = [];

  @Input() displayType = false;

  @Input() canRequestPayment = false;

  @Input() canSendToPay = false;

  @Output() paymentsOrdersEditionEvent = new EventEmitter<EventInfo>();

  displayPaymentRequest = false;

  submitted = false;


  constructor(private ordersData: OrdersDataService,
              private payablesData: PayablesDataService,
              private messageBox: MessageBoxService) { }


  @SkipIf('submitted')
  onRequestPaymentClicked() {
    this.displayPaymentRequest = true;
  }


  @SkipIf('submitted')
  onSendToPayClicked() {
    this.showConfirmSendToPayMessage();
  }


  @SkipIf('submitted')
  onPaymentsOrdersTableEvent(event: EventInfo) {
    switch (event.type as PaymentsOrdersTableEventType) {
      case PaymentsOrdersTableEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.data.uid, 'event.payload.data.uid');
        return;
      case PaymentsOrdersTableEventType.REMOVE_CLICKED:
        Assertion.assertValue(event.payload.data.uid, 'event.payload.data.uid');
        this.messageBox.showInDevelopment('Cancelar pago', event.payload.data);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  @SkipIf('submitted')
  onPaymentOrderRequestEvent(event: EventInfo) {
    switch (event.type as PaymentOrderRequestEventType) {
      case PaymentOrderRequestEventType.CLOSE_MODAL_CLICKED:
        this.displayPaymentRequest = false;
        return;
      case PaymentOrderRequestEventType.REQUEST_CLICKED:
        Assertion.assertValue(event.payload.entityUID, 'event.payload.entityUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.requestPayment(event.payload.entityUID, event.payload.dataFields as PaymentOrderRequestFields);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private requestPayment(dataUID: string, dataFields: PaymentOrderRequestFields) {
    this.submitted = true;

    this.ordersData.requestPayment(dataUID, dataFields)
      .firstValue()
      .then(x => this.resolveRequestPayment(x))
      .finally(() => this.submitted = false);
  }


  private resolveRequestPayment(data: OrderHolder) {
    sendEvent(this.paymentsOrdersEditionEvent, PaymentsOrdersEditionEventType.UPDATED, { data })
    this.displayPaymentRequest = false;
  }


  private sendToPay(dataUID: string) {
    this.submitted = true;

    this.payablesData.sendToPay(dataUID)
      .firstValue()
      .then(x =>
        sendEvent(this.paymentsOrdersEditionEvent, PaymentsOrdersEditionEventType.UPDATED, { data: x })
      )
      .finally(() => this.submitted = false);
  }


  private showConfirmSendToPayMessage() {
    const total = FormatLibrary.numberWithCommas(this.entityTotal, '1.2-2');

    const message = `Esta operación enviará al sistema de pagos ${this.entityName.toLowerCase()} ` +
                    `por un total de <strong>${total}</strong>.<br><br>` +
                    `¿Envio al sistema de pagos?`;

    this.messageBox.confirm(message, 'Enviar a sistema de pagos')
      .firstValue()
      .then(x => x ? this.sendToPay(this.entityUID) : null);
  }

}
