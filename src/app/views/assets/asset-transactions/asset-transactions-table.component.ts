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

import { AssetTransactionDescriptor } from '@app/models';

export enum AssetTransactionsTableEventType {
  SELECT_CLICKED = 'AssetTransactionsTableComponent.Event.SelectClicked',
  REMOVE_CLICKED = 'AssetTransactionsTableComponent.Event.RemoveClicked',
}

@Component({
  selector: 'emp-pyc-asset-transactions-table',
  templateUrl: './asset-transactions-table.component.html',
})
export class AssetTransactionsTableComponent implements OnChanges {

  @Input() transactions: AssetTransactionDescriptor[] = [];

  @Input() canEdit = false;

  @Output() assetTransactionsTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['transactionType', 'transactionNo', 'requestedTime', 'assignedTo',
    'description'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<AssetTransactionDescriptor>;


  constructor(private messageBox: MessageBoxService) {

  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.transactions) {
      this.setDataTable();
    }
  }


  onSelectTransactionClicked(transaction: AssetTransactionDescriptor) {
    if (this.canEdit && window.getSelection().toString().length <= 0) {
      sendEvent(this.assetTransactionsTableEvent,
        AssetTransactionsTableEventType.SELECT_CLICKED, { transaction });
    }
  }


  onRemoveTransactionClicked(transaction: AssetTransactionDescriptor) {
    const message = this.getConfirmMessage(transaction);

    this.messageBox.confirm(message, 'Eliminar transacción', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.assetTransactionsTableEvent,
            AssetTransactionsTableEventType.REMOVE_CLICKED, { transaction });
        }
      });
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.transactions);
    this.resetColumns();
  }


  private resetColumns() {
    this.displayedColumns = [...this.displayedColumnsDefault];

    if (this.canEdit) {
      this.displayedColumns.push('actionDelete');
    }
  }


  private getConfirmMessage(transaction: AssetTransactionDescriptor): string {
    return `
      <table class='confirm-data'>
        <tr><td class='nowrap'>Transacción: </td><td><strong>
          ${transaction.transactionNo}: ${transaction.transactionTypeName}
        </strong></td></tr>

        <tr><td class='nowrap'>Responsable: </td><td><strong>
          ${transaction.assignedToName} (${transaction.assignedToOrgUnitName})
        </strong></td></tr>
      </table>

     <br>¿Elimino la transacción?`;
  }

}
