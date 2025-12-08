/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo, isEmpty, StringLibrary } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { sendEventIf } from '@app/shared/utils';

import { FilePreviewComponent } from '@app/shared/containers';

import { AssetsTransactionsDataService } from '@app/data-services';

import { AssetsTransactionDescriptor, FileReport } from '@app/models';

export enum TransactionsTableEventType {
  SELECT_CLICKED = 'AssetTransactionsTableComponent.Event.SelectClicked',
  REMOVE_CLICKED = 'AssetTransactionsTableComponent.Event.RemoveClicked',
}

@Component({
  selector: 'emp-inv-asset-transactions-table',
  templateUrl: './asset-transactions-table.component.html',
})
export class AssetTransactionsTableComponent implements OnChanges {

  @ViewChild('filePreview', { static: true }) filePreview: FilePreviewComponent;

  @Input() transactions: AssetsTransactionDescriptor[] = [];

  @Input() canEdit = false;

  @Input() displayAssignmentData = true;

  @Output() transactionsTableEvent = new EventEmitter<EventInfo>();

  displayedColumns = ['transactionType', 'transactionNo', 'requestedTime', 'assignedTo', 'description'];

  dataSource: MatTableDataSource<AssetsTransactionDescriptor>;

  isLoading = false;


  constructor(private transactionsData: AssetsTransactionsDataService,
              private messageBox: MessageBoxService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.transactions) {
      this.setDataTable();
    }
  }


  onSelectTransactionClicked(transaction: AssetsTransactionDescriptor) {
    if (window.getSelection().toString().length <= 0 && !isEmpty(transaction)) {
      this.getDataForPrint(transaction.uid);
    }
  }


  onRemoveTransactionClicked(transaction: AssetsTransactionDescriptor) {
    const message = this.getConfirmMessage(transaction);

    this.messageBox.confirm(message, 'Eliminar transacción', 'DeleteCancel')
      .firstValue()
      .then(x =>
        sendEventIf(x, this.transactionsTableEvent, TransactionsTableEventType.REMOVE_CLICKED, {transaction})
      );
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


  private getConfirmMessage(transaction: AssetsTransactionDescriptor): string {
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


  private getDataForPrint(transactionUID: string) {
    this.isLoading = true;

    this.transactionsData.getAssetsTransactionForPrint(transactionUID)
      .firstValue()
      .then(x => this.openFilePreview(x))
      .finally(() => this.isLoading = false);
  }


  private openFilePreview(file: FileReport) {
    if (StringLibrary.isValidHttpUrl(file?.url || '')) {
      this.filePreview.open(file.url, file.type);
    }
  }

}
