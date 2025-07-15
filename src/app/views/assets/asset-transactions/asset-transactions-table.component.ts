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

export enum TransactionsTableEventType {
  SELECT_CLICKED = 'AssetTransactionsTableComponent.Event.SelectClicked',
  REMOVE_CLICKED = 'AssetTransactionsTableComponent.Event.RemoveClicked',
}

@Component({
  selector: 'emp-inv-asset-transactions-table',
  templateUrl: './asset-transactions-table.component.html',
})
export class AssetTransactionsTableComponent implements OnChanges {

  @Input() transactions: AssetTransactionDescriptor[] = [];

  @Input() canEdit = false;

  @Input() displayAssignmentData = true;

  @Output() transactionsTableEvent = new EventEmitter<EventInfo>();

  displayedColumns = ['transactionType', 'transactionNo', 'requestedTime', 'assignedTo', 'description'];

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
      sendEvent(this.transactionsTableEvent, TransactionsTableEventType.SELECT_CLICKED, { transaction });
    }
  }


  onRemoveTransactionClicked(transaction: AssetTransactionDescriptor) {
    const message = this.getConfirmMessage(transaction);

    this.messageBox.confirm(message, 'Eliminar transacción', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.transactionsTableEvent, TransactionsTableEventType.REMOVE_CLICKED, { transaction });
        }
      });
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.transactions);
    this.resetColumns();
  }


  private resetColumns() {
    let columns = this.displayAssignmentData ?
      ['transactionType', 'transactionNo', 'requestedTime', 'assignedTo', 'description'] :
      ['transactionType', 'transactionNo', 'requestedTime', 'description'];

    if (this.canEdit) {
      columns.push('actionDelete');
    }

    this.displayedColumns = columns;
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
