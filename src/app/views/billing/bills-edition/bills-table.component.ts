/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { SkipIfSelection } from '@app/shared/decorators';

import { MessageBoxService } from '@app/shared/services';

import { ArrayLibrary, FormatLibrary, sendEvent, sendEventIf } from '@app/shared/utils';

import { Bill, BillsStructure, DocumentsEntityTypes, EmptyBillsStructure, FileReport,
         FileType } from '@app/models';


export enum BillsTableEventType {
  SELECT_CLICKED      = 'BillsTableComponent.Event.SelectClicked',
  SHOW_FILE_CLICKED   = 'BillsTableComponent.Event.ShowFileClicked',
  REMOVE_CLICKED      = 'BillsTableComponent.Event.RemoveClicked',
}

@Component({
  selector: 'emp-ng-bills-table',
  templateUrl: './bills-table.component.html',
})
export class BillsTableComponent implements OnChanges {

  @Input() entityType: DocumentsEntityTypes = null;

  @Input() entityUID: string = null;

  @Input() data: BillsStructure = EmptyBillsStructure;

  @Input() canEdit = false;

  @Output() billsTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['billType', 'billNo', 'name', 'currencyCode',
                                       'subtotal', 'discount', 'total', 'actionShow'];

  displayedColumns = [...this.displayedColumnsDefault];

  displayedTotalColumns = ['spaceLeft', 'tax', 'taxTotal'];

  dataSource: MatTableDataSource<Bill>;

  FileType = FileType;


  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.setDataTable();
    }
  }


  @SkipIfSelection()
  onSelectClicked(bill: Bill) {
    sendEvent(this.billsTableEvent, BillsTableEventType.SELECT_CLICKED, { bill });
  }


  onShowFileClicked(bill: Bill, file: FileReport) {
    sendEvent(this.billsTableEvent, BillsTableEventType.SHOW_FILE_CLICKED, { bill, file });
  }


  onRemoveClicked(bill: Bill) {
    const message = this.getConfirmMessage(bill);

    this.messageBox.confirm(message, 'Eliminar comprobante', 'DeleteCancel')
      .firstValue()
      .then(x =>
          sendEventIf(x, this.billsTableEvent, BillsTableEventType.REMOVE_CLICKED, {
            entityType: this.entityType,
            entityUID: this.entityUID,
            bill,
          })
      );
  }


  private setDataTable() {
    const data = this.getDataWithOrdererFiles();
    this.dataSource = new MatTableDataSource(data);
    this.resetColumns();
    this.resetTaxesColumns();
  }


  private getDataWithOrdererFiles() {
    return this.data.bills.map(bill => (
      {...bill, files: ArrayLibrary.sortByKey([...(bill.files ?? [])], 'type')}
    ));
  }


  private resetColumns() {
    let columns = [...this.displayedColumnsDefault];
    if (this.canEdit) columns.push('actionDelete');
    this.displayedColumns = columns;
  }


  private resetTaxesColumns() {
    let columns = ['spaceLeft', 'tax', 'taxTotal', 'spaceRight'];
    this.displayedTotalColumns = columns;
  }



  private getConfirmMessage(bill: Bill): string {
    return `
      Esta operación eliminará el comprobante: <br><br>
      <table class='confirm-data'>
        <tr><td class='nowrap'>Tipo de comprobante: </td><td><strong>
          ${bill.billType.name}
        </strong></td></tr>

        <tr><td class='nowrap'>Comprobante: </td><td><strong>
          (${bill.billNo}) ${bill.name}
        </strong></td></tr>

        <tr><td class='nowrap'>Total: </td><td><strong>
          ${FormatLibrary.numberWithCommas(bill.total, '1.2-2')}
        </strong></td></tr>
      </table>

     <br>¿Elimino el comprobante?`;
  }

}
