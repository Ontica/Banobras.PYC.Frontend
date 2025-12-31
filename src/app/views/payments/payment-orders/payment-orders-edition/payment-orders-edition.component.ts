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

import { BasePaymentDescriptor, OrderHolder, PaymentOrderRequestFields } from '@app/models';

import { OrdersDataService, PaymentOrdersDataService } from '@app/data-services';

import { PaymentOrderRequestEventType } from './payment-order-request.component';

import { PaymentOrdersTableEventType } from './payment-orders-table.component';


export enum PaymentOrdersEditionEventType {
  UPDATED = 'PaymentOrdersEditionComponent.Event.Updated',
}

@Component({
  selector: 'emp-pmt-payment-orders-edition',
  templateUrl: './payment-orders-edition.component.html',
})
export class PaymentOrdersEditionComponent {

  @Input() entityUID: string = null;

  @Input() entityName: string = 'la orden';

  @Input() entityTotal: number = 0;

  @Input() supplierUID: string = null;

  @Input() totalRequired = false;

  @Input() items: BasePaymentDescriptor[] = [];

  @Input() displayType = false;

  @Input() canRequestPayment = false;

  @Input() canGeneratePaymentInstruction = false;

  @Output() paymentOrdersEditionEvent = new EventEmitter<EventInfo>();

  displayPaymentRequest = false;

  submitted = false;


  constructor(private ordersData: OrdersDataService,
              private paymentOrdersData: PaymentOrdersDataService,
              private messageBox: MessageBoxService) { }


  @SkipIf('submitted')
  onRequestPaymentClicked() {
    this.displayPaymentRequest = true;
  }


  @SkipIf('submitted')
  onGeneratePaymentInstructionClicked() {
    this.showConfirmGeneratePaymentInstructionMessage();
  }


  @SkipIf('submitted')
  onPaymentOrdersTableEvent(event: EventInfo) {
    switch (event.type as PaymentOrdersTableEventType) {
      case PaymentOrdersTableEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.data.uid, 'event.payload.data.uid');
        return;
      case PaymentOrdersTableEventType.REMOVE_CLICKED:
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
    sendEvent(this.paymentOrdersEditionEvent, PaymentOrdersEditionEventType.UPDATED, { data })
    this.displayPaymentRequest = false;
  }


  private generatePaymentInstruction(dataUID: string) {
    this.submitted = true;

    this.paymentOrdersData.generatePaymentInstruction(dataUID)
      .firstValue()
      .then(x =>
        sendEvent(this.paymentOrdersEditionEvent, PaymentOrdersEditionEventType.UPDATED, { data: x })
      )
      .finally(() => this.submitted = false);
  }


  private showConfirmGeneratePaymentInstructionMessage() {
    const total = FormatLibrary.numberWithCommas(this.entityTotal, '1.2-2');

    const message = `Esta operación generará la instrucción de pago de ${this.entityName.toLowerCase()} ` +
                    `por un total de <strong>${total}</strong>.<br><br>` +
                    `¿Genero la instrucción de pago?`;

    this.messageBox.confirm(message, 'Generar instrucción de pago')
      .firstValue()
      .then(x => x ? this.generatePaymentInstruction(this.entityUID) : null);
  }

}
