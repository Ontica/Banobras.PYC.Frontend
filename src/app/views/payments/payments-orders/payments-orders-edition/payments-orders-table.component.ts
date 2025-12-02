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

  @Input() canEdit = false;

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


  onSelectItemClicked(paymentOrder: PaymentOrderDescriptor) {
    if (window.getSelection().toString().length <= 0) {
      sendEvent(this.paymentsOrdersTableEvent, PaymentsOrdersTableEventType.SELECT_CLICKED, { paymentOrder });
    }
  }


  onRemoveItemClicked(paymentOrder: PaymentOrderDescriptor) {
    const message = this.getConfirmMessage(paymentOrder);

    this.messageBox.confirm(message, 'Cancelar pago', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.paymentsOrdersTableEvent, PaymentsOrdersTableEventType.REMOVE_CLICKED, { paymentOrder });
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

    if (this.canEdit) {
      columns.push('action');
    }

    this.displayedColumns = [...columns];
  }


  private getConfirmMessage(paymentOrder: PaymentOrderDescriptor): string {
    const total = !paymentOrder.total ? '-' : FormatLibrary.numberWithCommas(paymentOrder.total, '1.2-2');

    return `
      Esta operacion cancelara el pago<br><br>

      <table class='confirm-data'>
        <tr><td class='nowrap'>Pago: </td><td><strong>
          ${paymentOrder.paymentOrderNo}
        </strong></td></tr>

        <tr><td class='nowrap'>Pagar a: </td><td><strong>
          ${paymentOrder.payTo}
        </strong></td></tr>

        <tr><td class='nowrap'>Cuenta: </td><td><strong>
          ${paymentOrder.paymentAccount}
        </strong></td></tr>

        <tr><td class='nowrap'>Método de pago: </td><td><strong>
          ${paymentOrder.paymentMethod}
        </strong></td></tr>

        <tr><td class='nowrap'>Total: </td><td><strong>
          ${total} (${paymentOrder.currencyCode})
        </strong></td></tr>
      </table> <br>

      ¿Cancelo el pago?`;
  }

}
