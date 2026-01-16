/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { FormatLibrary, sendEvent, sendEventIf } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { TaxEntry, TaxEntryFields } from '@app/models';


export enum TaxesTableEventType {
  UPDATE_CLICKED = 'TaxesTableComponent.Event.UpdateClicked',
  REMOVE_CLICKED = 'TaxesTableComponent.Event.RemoveClicked',
}

@Component({
  selector: 'emp-financial-taxes-table',
  templateUrl: './taxes-table.component.html',
  styles: `
    .cell-total {
      width: 150px;
    }

    .cell-total-enabled {
      width: 150px;
      padding: 2px 0 2px 0;
      vertical-align: middle;
    }
  `,
})
export class TaxesTableComponent implements OnChanges {

  @Input() orderUID = null;

  @Input() taxes: TaxEntry[] = [];

  @Input() canEdit = false;

  @Output() taxesTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['taxType', 'total'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<TaxEntry>;

  editionMode = false;

  rowInEdition: TaxEntry = null;


  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.taxes) {
      this.resetEditionMode();
      this.setDataTable();
    }

    if (changes.canEdit) {
      this.resetColumns();
    }
  }


  get isEditionValid(): boolean {
    return !!this.rowInEdition.totalEdit && this.rowInEdition.totalEdit !== 0;
  }


  isRowInEdition(rowUID: string): boolean {
    return this.editionMode && rowUID === this.rowInEdition?.uid;
  }


  onEditionClicked(entry: TaxEntry) {
    const totalEdit = entry.total;
    this.rowInEdition = { ...{}, ...entry, totalEdit };
    this.editionMode = true;
  }


  onCancelEditionClicked() {
    this.editionMode = false;
    this.rowInEdition = null;
  }


  onUpdateClicked() {
    if (!this.isEditionValid) {
      return;
    }

    const dataFields: TaxEntryFields = {
      orderUID: this.orderUID,
      taxTypeUID: this.rowInEdition.taxType.name,
      total: this.rowInEdition.totalEdit,
    };

    sendEvent(this.taxesTableEvent, TaxesTableEventType.UPDATE_CLICKED,
      { orderUID: this.orderUID, taxEntryUID: this.rowInEdition.uid, dataFields });
  }


  onRemoveClicked(tax: TaxEntry) {
    const message = this.getConfirmDeleteMessage(tax);

    this.messageBox.confirm(message, 'Eliminar impuesto', 'DeleteCancel')
      .firstValue()
      .then(x =>
        sendEventIf(x, this.taxesTableEvent,
          TaxesTableEventType.REMOVE_CLICKED,
          { orderUID: this.orderUID, taxEntryUID: tax.uid })
       );
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.taxes ?? []);
    this.resetColumns();
  }


  private resetColumns() {
    this.displayedColumns = [...this.displayedColumnsDefault];

    if (this.canEdit) {
      this.displayedColumns.push('actions');
    }
  }


  private resetEditionMode() {
    this.editionMode = false;
    this.rowInEdition = null;
  }


  private getConfirmDeleteMessage(tax: TaxEntry): string {
    const total = FormatLibrary.numberWithCommas(tax.total, '1.2-2');

    return `
      Esta operación eliminará el impuesto:<br><br>

      <table class="confirm-data">
        <tr><td class="nowrap">Tipo de impuesto: </td><td><strong>${tax.taxType.name}</strong></td></tr>
        <tr><td class="nowrap">Total: </td><td><strong>${total}</strong></td></tr>
      </table>

     <br>¿Elimino el impuesto?`;
  }

}
