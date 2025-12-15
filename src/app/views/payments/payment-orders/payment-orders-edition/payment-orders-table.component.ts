/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { FormatLibrary, sendEvent, sendEventIf } from '@app/shared/utils';

import { BasePaymentDescriptor } from '@app/models';


export enum PaymentOrdersTableEventType {
  SELECT_CLICKED = 'PaymentOrdersTableComponent.Event.SelectClicked',
  REMOVE_CLICKED = 'PaymentOrdersTableComponent.Event.RemoveClicked',
}

@Component({
  selector: 'emp-pmt-payment-orders-table',
  templateUrl: './payment-orders-table.component.html',
})
export class PaymentOrdersTableComponent implements OnChanges {

  @Input() items: BasePaymentDescriptor[] = [];

  @Input() canRequestPayment = false;

  @Input() canGeneratePaymentInstruction = false;

  @Input() displayType = false;

  @Output() paymentOrdersTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['paymentOrderNo', 'payTo', 'paymentAccount', 'paymentMethod',
                                       'requestedTime', 'requestedBy', 'dueTime', 'total',];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<BasePaymentDescriptor>;


  constructor(private messageBox: MessageBoxService) {

  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.items) {
      this.setDataTable();
    }
  }


  onSelectItemClicked(data: BasePaymentDescriptor) {
    if (window.getSelection().toString().length <= 0) {
      sendEvent(this.paymentOrdersTableEvent, PaymentOrdersTableEventType.SELECT_CLICKED, { data });
    }
  }


  onRemoveItemClicked(data: BasePaymentDescriptor) {
    const message = this.getConfirmMessage(data);

    this.messageBox.confirm(message, 'Cancelar pago', 'DeleteCancel')
      .firstValue()
      .then(x =>
        sendEventIf(x, this.paymentOrdersTableEvent, PaymentOrdersTableEventType.REMOVE_CLICKED, { data })
      );
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.items);
    this.resetColumns();
  }


  private resetColumns() {
    let columns = this.displayType ? ['type', ...this.displayedColumnsDefault] :
      [...this.displayedColumnsDefault];

    if (this.canRequestPayment) {
      columns.push('action');
    }

    this.displayedColumns = [...columns];
  }


  private getConfirmMessage(data: BasePaymentDescriptor): string {
    const total = !data.total ? '-' : FormatLibrary.numberWithCommas(data.total, '1.2-2');
    const paymentOrderNoName = this.canGeneratePaymentInstruction ? 'Instrucción de pago' : 'No. pago';

    return `
      Esta operacion cancelara el pago<br><br>

      <table class='confirm-data'>
        <tr><td class='nowrap'>${paymentOrderNoName}: </td><td><strong>
          ${data.paymentOrderNo}
        </strong></td></tr>

        <tr><td class='nowrap'>Pagar a: </td><td><strong>
          ${data.payTo}
        </strong></td></tr>

        <tr><td class='nowrap'>Cuenta: </td><td><strong>
          ${data.paymentAccount}
        </strong></td></tr>

        <tr><td class='nowrap'>Método de pago: </td><td><strong>
          ${data.paymentMethod}
        </strong></td></tr>

        <tr><td class='nowrap'>Total: </td><td><strong>
          ${total} (${data.currencyCode})
        </strong></td></tr>
      </table> <br>

      ¿Cancelo el pago?`;
  }

}
