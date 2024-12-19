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

import { EmptyOrderTypeConfig, ObjectTypes, OrderItem, OrderTypeConfig, PayableOrderItem } from '@app/models';


export enum OrderItemsTableEventType {
  SELECT_ITEM_CLICKED = 'OrderItemsTableComponent.Event.SelectItemClicked',
  REMOVE_ITEM_CLICKED = 'OrderItemsTableComponent.Event.RemoveItemClicked',
}

@Component({
  selector: 'emp-ng-order-items-table',
  templateUrl: './order-items-table.component.html',
})
export class OrderItemsTableComponent implements OnChanges {

  @Input() config: OrderTypeConfig = EmptyOrderTypeConfig;

  @Input() items: OrderItem[] = [];

  @Input() isForMultipleBeneficiaries = false;

  @Input() isMultipleProviders = false;

  @Input() canDelete = false;

  @Output() orderItemsTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['product', 'productUnit', 'quantity'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<OrderItem>;


  constructor(private messageBox: MessageBoxService) {}


  ngOnChanges(changes: SimpleChanges) {
    if (changes.items) {
      this.setDataTable();
    }
  }


  get isPayableOrder(): boolean {
    return this.config.orderType === ObjectTypes.PayableOrder;
  }


  onSelectItemClicked(item: OrderItem) {
    if (window.getSelection().toString().length <= 0) {
      sendEvent(this.orderItemsTableEvent, OrderItemsTableEventType.SELECT_ITEM_CLICKED,
        { item });
    }
  }


  onRemoveItemClicked(item: OrderItem) {
    const message = this.getConfirmMessage(item);

    this.messageBox.confirm(message, 'Eliminar concepto', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.orderItemsTableEvent, OrderItemsTableEventType.REMOVE_ITEM_CLICKED,
            { item });
        }
      });
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.items);
    this.resetColumns();
  }


  private resetColumns() {
    let columns = [];

    if (this.isPayableOrder) {
      columns = ['product', 'budgetAccount', 'productUnit', 'quantity', 'unitPrice', 'total']
    } else {
      columns = ['product', 'productUnit', 'quantity']
    }

    if (this.canDelete) columns.push('actionDelete');

    this.displayedColumns = columns;
  }


  private getConfirmMessage(item: OrderItem): string {
    return `
      <table class='confirm-data'>
        <tr><td class='nowrap'>Producto: </td><td><strong>
          ${item.product.name} (${item.productUnit.name})
        </strong></td></tr>
        <tr><td class='nowrap'>Cantidad: </td><td><strong>
          ${FormatLibrary.numberWithCommas(item.quantity)}
        </strong></td></tr>
        ${this.budgetAccountText(item)}
      </table>
     <br>¿Elimino el concepto?`;
  }


  private budgetAccountText(item: OrderItem): string {
    if (!this.isPayableOrder) {
      return '';
    }

    const payableOrderItem = item as PayableOrderItem;

    return `<tr><td class='nowrap'>Cuenta presupuestal: </td><td><strong>
              ${payableOrderItem.budgetAccount.name}
            </strong></td></tr>
            <tr><td class='nowrap'>Precio unitario: </td><td><strong>
              ${FormatLibrary.numberWithCommas(payableOrderItem.unitPrice)} (${payableOrderItem.productUnit.name})
            </strong></td></tr>
            <tr><td class='nowrap'>Total: </td><td><strong>
              ${FormatLibrary.numberWithCommas(payableOrderItem.total)}
            </strong></td></tr>`;

  }

}
