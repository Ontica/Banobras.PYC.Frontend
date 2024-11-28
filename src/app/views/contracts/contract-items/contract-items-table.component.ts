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

import { sendEvent } from '@app/shared/utils';

import { ContractItem } from '@app/models';


export enum ContractItemsTableEventType {
  SELECT_ITEM_CLICKED = 'ContractItemsTableComponent.Event.SelectItemClicked',
  REMOVE_ITEM_CLICKED = 'ContractItemsTableComponent.Event.RemoveItemClicked',
}

@Component({
  selector: 'emp-pmt-contract-items-table',
  templateUrl: './contract-items-table.component.html',
})
export class ContractItemsTableComponent implements OnChanges {

  @Input() items: ContractItem[] = [];

  @Input() canDelete = false;

  @Input() canSelect = false;

  @Output() contractItemsTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['product', 'project', 'description', 'unit', 'fromQuantity',
    'toQuantity', 'unitPrice', 'periodicity'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<ContractItem>;


  constructor(private messageBox: MessageBoxService) {

  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.items) {
      this.setDataTable();
    }
  }


  onSelectItemClicked(item: ContractItem) {
    if (this.canSelect && window.getSelection().toString().length <= 0) {
      sendEvent(this.contractItemsTableEvent, ContractItemsTableEventType.SELECT_ITEM_CLICKED,
        { item });
    }
  }


  onRemoveItemClicked(item: ContractItem) {
    const message = this.getConfirmMessage(item);

    this.messageBox.confirm(message, 'Eliminar concepto', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.contractItemsTableEvent, ContractItemsTableEventType.REMOVE_ITEM_CLICKED,
            { item });
        }
      });
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.items);
    this.resetColumns();
  }


  private resetColumns() {
    this.displayedColumns = [...this.displayedColumnsDefault];

    if (this.canDelete) {
      this.displayedColumns.push('actionDelete');
    }
  }


  private getConfirmMessage(item: ContractItem): string {
    return `
      <table class='confirm-data'>
        <tr><td class='nowrap'>Concepto: </td><td><strong>
          ${item.description}
        </strong></td></tr>

        <tr><td class='nowrap'>Producto: </td><td><strong>
          ${item.product.name} (${item.periodicity.name})
        </strong></td></tr>
      </table>

     <br>¿Elimino el concepto?`;
  }

}
