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

import { FormatLibrary, sendEvent } from '@app/shared/utils';

import { PaymentOrderDescriptor } from '@app/models';


export enum PaymentsOrdersTableEventType {
  SELECT_CLICKED = 'PaymentsOrdersTableComponent.Event.SelectClicked',
  REMOVE_CLICKED = 'PaymentsOrdersTableComponent.Event.RemoveClicked',
}

@Component({
  selector: 'emp-pmt-payments-orders-table',
  templateUrl: './payments-orders-table.component.html',
})
export class PaymentsOrdersTableComponent implements OnChanges {

  @Input() paymentsOrders: PaymentOrderDescriptor[] = [];

  @Input() canRequestPayment = false;

  @Input() canSendToPay = false;

  @Input() displayType = false;

  @Output() paymentsOrdersTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['paymentOrderNo', 'payTo', 'paymentAccount', 'paymentMethod',
                                       'requestedDate', 'requestedBy', 'dueTime', 'total',];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<PaymentOrderDescriptor>;


  constructor(private messageBox: MessageBoxService) {

  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.paymentsOrders) {
      this.setDataTable();
    }
  }


  onSelectItemClicked(data: PaymentOrderDescriptor) {
    if (window.getSelection().toString().length <= 0) {
      sendEvent(this.paymentsOrdersTableEvent, PaymentsOrdersTableEventType.SELECT_CLICKED, { data });
    }
  }


  onRemoveItemClicked(data: PaymentOrderDescriptor) {
    const message = this.getConfirmMessage(data);

    this.messageBox.confirm(message, 'Cancelar pago', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.paymentsOrdersTableEvent, PaymentsOrdersTableEventType.REMOVE_CLICKED, { data });
        }
      });
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.paymentsOrders);
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


  private getConfirmMessage(data: PaymentOrderDescriptor): string {
    const total = !data.total ? '-' : FormatLibrary.numberWithCommas(data.total, '1.2-2');
    const paymentOrderNoName = this.canSendToPay ? 'Instrucción de pago' : 'No. pago';

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
