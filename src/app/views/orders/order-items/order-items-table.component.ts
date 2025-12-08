/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { FormatLibrary, sendEvent, sendEventIf } from '@app/shared/utils';

import { EmptyOrderExplorerTypeConfig, ObjectTypes, OrderItem, OrderExplorerTypeConfig, PayableOrderItem,
         TaxEntry } from '@app/models';


export enum OrderItemsTableEventType {
  SELECT_ITEM_CLICKED = 'OrderItemsTableComponent.Event.SelectItemClicked',
  REMOVE_ITEM_CLICKED = 'OrderItemsTableComponent.Event.RemoveItemClicked',
}

@Component({
  selector: 'emp-ng-order-items-table',
  templateUrl: './order-items-table.component.html',
})
export class OrderItemsTableComponent implements OnChanges {

  @Input() config: OrderExplorerTypeConfig<ObjectTypes> = EmptyOrderExplorerTypeConfig;

  @Input() items: OrderItem[] = [];

  @Input() taxes: TaxEntry[] = [];

  @Input() orderSubtotal: number = 0;

  @Input() orderTotal: number = 0;

  @Input() isForMultipleBeneficiaries = false;

  @Input() isMultipleProviders = false;

  @Input() canDelete = false;

  @Output() orderItemsTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['cucop', 'description', 'productUnit', 'quantity'];

  displayedColumns = [...this.displayedColumnsDefault];

  displayedTotalColumns = ['spaceLeft', 'tax', 'taxTotal'];

  dataSource: MatTableDataSource<OrderItem>;


  constructor(private messageBox: MessageBoxService) {}


  ngOnChanges(changes: SimpleChanges) {
    if (changes.items) {
      this.setDataTable();
    }
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
      .then(x =>
        sendEventIf(x, this.orderItemsTableEvent, OrderItemsTableEventType.REMOVE_ITEM_CLICKED, { item })
      );
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.items);
    this.resetColumns();
    this.resetTaxesColumns();
  }


  private resetColumns() {
    let columns = [];

    switch (this.config.type) {
      case ObjectTypes.CONTRACT_ORDER:
      case ObjectTypes.EXPENSE:
      case ObjectTypes.PURCHASE:
        columns = ['budgetAccount', 'cucop', 'budgetControlNo', 'description', 'productUnit',
                   'quantity', 'unitPrice', 'discount', 'total'];
        break;
      case ObjectTypes.REQUISITION:
        columns = ['budgetAccount', 'cucop', 'budgetControlNo', 'description', 'productUnit',
                   'quantity', 'unitPrice', 'total'];
        break;
      default:
        columns = ['cucop', 'description', 'productUnit', 'quantity', 'unitPrice', 'total']
        break;
    }

    if (this.canDelete) columns.push('actionDelete');

    this.displayedColumns = columns;
  }


  private resetTaxesColumns() {
    let columns = ['spaceLeft', 'tax', 'taxTotal'];
    if (this.canDelete) columns.push('spaceRight');
    this.displayedTotalColumns = columns;
  }


  private getConfirmMessage(item: OrderItem): string {
    let budgetAccountText = '';

    if ([ObjectTypes.CONTRACT_ORDER,
         ObjectTypes.EXPENSE,
         ObjectTypes.PURCHASE,
         ObjectTypes.REQUISITION].includes(this.config.type)) {
      const budgetAccount = (item as PayableOrderItem)?.budgetAccount?.name ?? 'N/D';
      budgetAccountText = `<tr><td class='nowrap'>Partida: </td><td><strong>
                             ${budgetAccount}
                           </strong></td></tr>`;
    }

    return `
      <table class='confirm-data'>
        ${budgetAccountText}
        <tr><td class='nowrap'>Descripción: </td><td><strong>
          ${isEmpty(item.product) ? item.description : item.product.name} (${item.productUnit.name})
        </strong></td></tr>
        <tr><td class='nowrap'>Cantidad: </td><td><strong>
          ${FormatLibrary.numberWithCommas(item.quantity, '1.0-2')}
        </strong></td></tr>
        <tr><td class='nowrap'>Precio unitario: </td><td><strong>
          ${FormatLibrary.numberWithCommas(item.unitPrice, '1.2-2')}
        </strong></td></tr>
        <tr><td class='nowrap'>Total: </td><td><strong>
          ${FormatLibrary.numberWithCommas(item.total, '1.2-2')}
        </strong></td></tr>
      </table>
    <br>¿Elimino el concepto?`;
  }

}
