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

import { PayableItem } from '@app/models';


export enum PayableItemsTableEventType {
  SELECT_ITEM_CLICKED = 'PayableItemsTableComponent.Event.SelectItemClicked',
  REMOVE_ITEM_CLICKED = 'PayableItemsTableComponent.Event.RemoveItemClicked',
}

@Component({
  selector: 'emp-pmt-payable-items-table',
  templateUrl: './payable-items-table.component.html',
})
export class PayableItemsTableComponent implements OnChanges {

  @Input() items: PayableItem[] = [];

  @Input() canEdit = false;

  @Output() payableItemsTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['name', 'budgetAccount', 'billConcept', 'quantity', 'unit', 'total'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<PayableItem>;


  constructor(private messageBox: MessageBoxService) {

  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.items) {
      this.setDataTable();
    }
  }


  onSelectItemClicked(item: PayableItem) {
    if (window.getSelection().toString().length <= 0) {
      sendEvent(this.payableItemsTableEvent, PayableItemsTableEventType.SELECT_ITEM_CLICKED, { item });
    }
  }


  onRemoveItemClicked(item: PayableItem) {
    const message = this.getConfirmMessage(item);

    this.messageBox.confirm(message, 'Eliminar concepto', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.payableItemsTableEvent, PayableItemsTableEventType.REMOVE_ITEM_CLICKED, { item });
        }
      });
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


  private getConfirmMessage(item: PayableItem): string {
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
