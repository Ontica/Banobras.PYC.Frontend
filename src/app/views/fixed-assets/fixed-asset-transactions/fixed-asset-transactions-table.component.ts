/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { FixedAssetTransaction } from '@app/models';

export enum FixedAssetTransactionsTableEventType {
  SELECT_TRANSACTION_CLICKED = 'FixedAssetTransactionsTableComponent.Event.SelectTransactionClicked',
  REMOVE_TRANSACTION_CLICKED = 'FixedAssetTransactionsTableComponent.Event.RemoveTransactionClicked',
}

@Component({
  selector: 'emp-pmt-fixed-asset-transactions-table',
  templateUrl: './fixed-asset-transactions-table.component.html',
})
export class FixedAssetTransactionsTableComponent implements OnChanges {

  @Input() transactions: FixedAssetTransaction[] = [];

  @Input() canEdit = false;

  @Output() fixedAssetTransactionsTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['transactionNo', 'requestedDate', 'transaction', 'resposable', 'involved',
    'notes'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<FixedAssetTransaction>;


  constructor(private messageBox: MessageBoxService) {

  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.transactions) {
      this.setDataTable();
    }
  }


  onSelectTransactionClicked(transaction: FixedAssetTransaction) {
    if (this.canEdit && window.getSelection().toString().length <= 0) {
      sendEvent(this.fixedAssetTransactionsTableEvent,
        FixedAssetTransactionsTableEventType.SELECT_TRANSACTION_CLICKED, { transaction });
    }
  }


  onRemoveTransactionClicked(transaction: FixedAssetTransaction) {
    const message = this.getConfirmMessage(transaction);

    this.messageBox.confirm(message, 'Eliminar transacción', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.fixedAssetTransactionsTableEvent,
            FixedAssetTransactionsTableEventType.REMOVE_TRANSACTION_CLICKED, { transaction });
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


  private getConfirmMessage(transaction: FixedAssetTransaction): string {
    return `
      <table class='confirm-data'>
        <tr><td class='nowrap'>Transacción: </td><td><strong>
          ${transaction.transactionNo}: ${transaction.name}
        </strong></td></tr>

        <tr><td class='nowrap'>Resguardatario: </td><td><strong>
          ${transaction.resposable.name}
        </strong></td></tr>
      </table>

     <br>¿Elimino la transacción?`;
  }

}
