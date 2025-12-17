/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { PaymentTimeControlDataService } from '@app/data-services';

import { EmptyPaymentTimeWindow, PaymentTimeWindow } from '@app/models';

import { PaymentTimeWindowSelectorEventType } from './time-window-selector.component';


@Component({
  selector: 'emp-pmt-time-control-modal',
  templateUrl: './time-control-modal.component.html',
})
export class PaymentTimeControlModalComponent implements OnInit {

  @Output() closeEvent = new EventEmitter<void>();

  submitted = false;

  data: PaymentTimeWindow = Object.assign({}, EmptyPaymentTimeWindow);


  constructor(private timeControlData: PaymentTimeControlDataService,
              private messageBox: MessageBoxService) { }


  ngOnInit() {
    this.loadInitTimeWindow();
  }


  onPaymentTimeWindowSelectorEvent(event: EventInfo) {
    switch (event.type as PaymentTimeWindowSelectorEventType) {
      case PaymentTimeWindowSelectorEventType.UPDATE:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.updatePaymentOrder(event.payload.dataFields as PaymentTimeWindow);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onCloseModalClicked() {
    this.closeEvent.emit();
  }


  private loadInitTimeWindow() {
    this.submitted = true;

    this.timeControlData.getTimeWindow()
      .firstValue()
      .then(x => this.data = x)
      .finally(() => this.submitted = false);
  }


  private updatePaymentOrder(dataFields: PaymentTimeWindow) {
    this.submitted = true;

    this.timeControlData.updateTimeWindow(dataFields)
      .firstValue()
      .then(x => this.resolveUpdated(x))
      .finally(() => this.submitted = false);
  }


  private resolveUpdated(data: PaymentTimeWindow) {
    this.messageBox.show('El horario de pago se actualizó correctamente.', 'Actualizar horario de pago');
    this.onCloseModalClicked();
  }

}
