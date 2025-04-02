/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';

import { Assertion, EventInfo } from '@app/core';

import { AssetTransactionEntry, AssetTransactionEntryFields, isEntityStatusInWarning } from '@app/models';

import { sendEvent, sendEventIf } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';


export enum TransactionEntriesTableEventType {
  SELECT_CLICKED = 'AssetTransactionEntriesTableComponent.Event.SelectClicked',
  UPDATE_CLICKED = 'AssetTransactionEntriesTableComponent.Event.UpdateClicked',
  DELETE_CLICKED = 'AssetTransactionEntriesTableComponent.Event.DeleteClicked',
}

@Component({
  selector: 'emp-pyc-transaction-entries-table',
  templateUrl: './transaction-entries-table.component.html',
})
export class AssetTransactionEntriesTableComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() transactionUID = '';

  @Input() entries: AssetTransactionEntry[] = [];

  @Input() filter = '';

  @Input() canEdit = false;

  @Output() transactionEntriesTableEvent = new EventEmitter<EventInfo>();

  editionMode = false;

  rowInEdition: AssetTransactionEntry = null;

  displayedColumnsDefault: string[] = ['assetNo', 'name', 'description'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: TableVirtualScrollDataSource<AssetTransactionEntry>;

  isEntityStatusInWarning = isEntityStatusInWarning;


  constructor(private messageBox: MessageBoxService) {}


  ngOnChanges(changes: SimpleChanges) {
    if (changes.entries) {
      this.resetEditionMode();
      this.setDataSource();
      this.scrollToTop();
    }

    if (changes.filter) {
      this.applyFilter(this.filter);
    }
  }


  get isEntryInEditionValid(): boolean {
    return this.rowInEdition.description !== '';
  }


  isRowInEdition(rowInEditionUID: string): boolean {
    return this.editionMode && rowInEditionUID === this.rowInEdition?.uid;
  }


  onSelectButtonClicked(entry: AssetTransactionEntry) {
    sendEvent(this.transactionEntriesTableEvent, TransactionEntriesTableEventType.SELECT_CLICKED, { entry });
  }


  onEditEntryClicked(event, entry: AssetTransactionEntry) {
    event.stopPropagation();
    this.rowInEdition = { ...{}, ...entry };
    this.editionMode = true;
  }


  onCancelEditionClicked(event) {
    event.stopPropagation();
    this.editionMode = false;
    this.rowInEdition = null;
  }


  onUpdateEntryClicked(event) {
    event.stopPropagation();

    const payload = {
      entryUID: this.rowInEdition.uid,
      dataFields: this.getDataFields(),
    };

    sendEvent(this.transactionEntriesTableEvent, TransactionEntriesTableEventType.UPDATE_CLICKED,
      payload);
  }


  onDeleteEntryClicked(event, entry: AssetTransactionEntry) {
    event.stopPropagation();

    const message = this.getConfirmMessage(entry);

    this.messageBox.confirm(message, 'Eliminar movimiento', 'DeleteCancel')
      .firstValue()
      .then(x => {
        sendEventIf(x, this.transactionEntriesTableEvent, TransactionEntriesTableEventType.DELETE_CLICKED,
          { entry });
      });
  }


  private setDataSource() {
    this.resetColumns();
    this.dataSource = new TableVirtualScrollDataSource(this.entries);
    this.dataSource.filterPredicate = this.getFilterPredicate();
  }


  private resetColumns() {
    this.displayedColumns = this.canEdit ?
      [...this.displayedColumnsDefault, 'actions'] :
      [...this.displayedColumnsDefault];
  }


  private resetEditionMode() {
    this.editionMode = false;
    this.rowInEdition = null;
  }


  private applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
    this.scrollToTop();
  }


  private getFilterPredicate() {
    return (row: AssetTransactionEntry, filter: string) => (
      row.asset.assetNo.toLowerCase().includes(filter) || row.asset.name.toLowerCase().includes(filter) ||
      row.description.toLowerCase().includes(filter)
    );
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(-1);
    }
  }


  private getConfirmMessage(entry: AssetTransactionEntry): string {
    return `
      <table class='confirm-data'>
        <tr><td class='nowrap'>No. inventario: </td><td><strong>
          ${entry.asset.assetNo}
        </strong></td></tr>
        <tr><td class='nowrap'>Activo fijo: </td><td><strong>
          ${entry.asset.name}
        </strong></td></tr>
      </table>
      <br>¿Elimino el movimiento?`;
  }


  private getDataFields(): AssetTransactionEntryFields {
    Assertion.assert(this.isEntryInEditionValid, 'Programming error: form must be validated before command execution.');

    const data: AssetTransactionEntryFields = {
      uid: this.rowInEdition.uid,
      transactionUID: this.rowInEdition.transaction.uid,
      assetUID: this.rowInEdition.asset.uid,
      entryTypeUID: this.rowInEdition.entryType.uid,
      description: this.rowInEdition.description,
    };

    return data;
  }

}
