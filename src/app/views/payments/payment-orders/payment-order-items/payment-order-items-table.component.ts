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

import { PaymentOrderItem } from '@app/models';


export enum PaymentOrderItemsTableEventType {
  SELECT_ITEM_CLICKED = 'PaymentOrderItemsTableComponent.Event.SelectItemClicked',
  REMOVE_ITEM_CLICKED = 'PaymentOrderItemsTableComponent.Event.RemoveItemClicked',
}

@Component({
  selector: 'emp-pmt-payment-order-items-table',
  templateUrl: './payment-order-items-table.component.html',
})
export class PaymentOrderItemsTableComponent implements OnChanges {

  @Input() items: PaymentOrderItem[] = [];

  @Input() canEdit = false;

  @Output() paymentOrderItemsTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['name', 'budgetAccount', 'billConcept', 'quantity', 'unit', 'total'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<PaymentOrderItem>;


  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.items) {
      this.setDataTable();
    }
  }


  onSelectItemClicked(item: PaymentOrderItem) {
    if (window.getSelection().toString().length <= 0) {
      sendEvent(this.paymentOrderItemsTableEvent, PaymentOrderItemsTableEventType.SELECT_ITEM_CLICKED, { item });
    }
  }


  onRemoveItemClicked(item: PaymentOrderItem) {
    const message = this.getConfirmMessage(item);

    this.messageBox.confirm(message, 'Eliminar concepto', 'DeleteCancel')
      .firstValue()
      .then(x =>
        sendEventIf(x, this.paymentOrderItemsTableEvent, PaymentOrderItemsTableEventType.REMOVE_ITEM_CLICKED, { item })
      );
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.items);
    this.resetColumns();
  }


  private resetColumns() {
    this.displayedColumns = [...this.displayedColumnsDefault];

    if (this.canEdit) {
      this.displayedColumns.push('actionDelete');
    }
  }


  private getConfirmMessage(item: PaymentOrderItem): string {
    const quantity = !item.quantity ? '-' : FormatLibrary.numberWithCommas(item.quantity, '1.2-2');
    const total = !item.total ? '-' : FormatLibrary.numberWithCommas(item.total, '1.2-2');


    return `
      <table class='confirm-data'>
        <tr><td class='nowrap'>Concepto: </td><td><strong>
          ${item.name}
        </strong></td></tr>

        <tr><td class='nowrap'>Partida: </td><td><strong>
          ${item.budgetAccount.name}
        </strong></td></tr>

        <tr><td class='nowrap'>Concepto factura: </td><td><strong>
          ${item.billConcept}
        </strong></td></tr>

        <tr><td class='nowrap'>Cantidad: </td><td><strong>
          ${quantity} ${item.unit}
        </strong></td></tr>

        <tr><td class='nowrap'>Total: </td><td><strong>
          ${total}
        </strong></td></tr>
      </table>

     <br>¿Elimino el concepto?`;
  }

}
