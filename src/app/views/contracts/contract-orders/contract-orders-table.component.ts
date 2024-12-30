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

import { ContractOrderDescriptor } from '@app/models';

export enum ContractOrdersTableEventType {
  SELECT_CLICKED = 'ContractOrdersTableComponent.Event.SelectClicked',
  REMOVE_CLICKED = 'ContractOrdersTableComponent.Event.RemoveClicked',
}

@Component({
  selector: 'emp-pmt-contract-orders-table',
  templateUrl: './contract-orders-table.component.html',
})
export class ContractOrdersTableComponent implements OnChanges {

  @Input() orders: ContractOrderDescriptor[] = [];

  @Input() canDelete = false;

  @Input() canSelect = false;

  @Output() contractOrdersTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['orderNo', 'categoryName', 'budgetName',
                                       'total', 'currencyName', 'description', 'status'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<ContractOrderDescriptor>;


  constructor(private messageBox: MessageBoxService) {

  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.orders) {
      this.setDataTable();
    }
  }


  onSelectOrderClicked(order: ContractOrderDescriptor) {
    if (this.canSelect && window.getSelection().toString().length <= 0) {
      sendEvent(this.contractOrdersTableEvent, ContractOrdersTableEventType.SELECT_CLICKED,
        { order });
    }
  }


  onRemoveOrderClicked(order: ContractOrderDescriptor) {
    const message = this.getConfirmMessage(order);

    this.messageBox.confirm(message, 'Eliminar entrega', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.contractOrdersTableEvent, ContractOrdersTableEventType.REMOVE_CLICKED,
            { order });
        }
      });
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.orders);
    this.resetColumns();
  }


  private resetColumns() {
    this.displayedColumns = [...this.displayedColumnsDefault];

    if (this.canDelete) {
      this.displayedColumns.push('actionDelete');
    }
  }


  private getConfirmMessage(order: ContractOrderDescriptor): string {
    return `
      <table class='confirm-data'>
        <tr><td class='nowrap'>No. entrega: </td><td><strong>
          ${order.orderNo}
        </strong></td></tr>

        <tr><td class='nowrap'>Categoría: </td><td><strong>
          ${order.categoryName}
        </strong></td></tr>

        <tr><td class='nowrap'>Presupuesto: </td><td><strong>
          ${order.budgetName}
        </strong></td></tr>

        <tr><td class='nowrap'>Total: </td><td><strong>
          ${FormatLibrary.numberWithCommas(order.total)} (${order.currencyName})
        </strong></td></tr>
      </table>

     <br>¿Elimino la entrega?`;
  }

}
