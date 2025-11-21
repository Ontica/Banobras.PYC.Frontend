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

import { FormatLibrary, sendEvent, sendEventIf } from '@app/shared/utils';

import { Bill, DocumentsEntityTypes, FileReport, FileType } from '@app/models';


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

  @Input() bills: Bill[] = [];

  @Input() canEdit = false;

  @Output() billsTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['billType', 'billNo', 'name', 'currencyCode',
                                       'subtotal', 'discount', 'total', 'actionShow'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<Bill>;

  FileType = FileType;


  constructor(private messageBox: MessageBoxService) {

  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.bills) {
      this.setDataTable();
    }
  }


  onSelectClicked(bill: Bill) {
    if (window.getSelection().toString().length <= 0) {
      sendEvent(this.billsTableEvent, BillsTableEventType.SELECT_CLICKED, { bill });
    }
  }


  onShowFileClicked(bill: Bill, file: FileReport) {
    sendEvent(this.billsTableEvent, BillsTableEventType.SHOW_FILE_CLICKED, { bill, file });
  }


  onRemoveClicked(bill: Bill) {
    const message = this.getConfirmMessage(bill);

    this.messageBox.confirm(message, 'Eliminar factura', 'DeleteCancel')
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
    this.dataSource = new MatTableDataSource(this.bills);
    this.resetColumns();
  }


  private resetColumns() {
    this.displayedColumns = [...this.displayedColumnsDefault];

    if (this.canEdit) {
      this.displayedColumns.push('actionDelete');
    }
  }


  private getConfirmMessage(bill: Bill): string {
    return `
      Esta operación eliminará la factura: <br><br>
      <table class='confirm-data'>
        <tr><td class='nowrap'>Tipo de documento fiscal: </td><td><strong>
          ${bill.billType.name}
        </strong></td></tr>

        <tr><td class='nowrap'>Documento: </td><td><strong>
          (${bill.billNo}) ${bill.name}
        </strong></td></tr>

        <tr><td class='nowrap'>Total: </td><td><strong>
          ${FormatLibrary.numberWithCommas(bill.total, '1.2-2')}
        </strong></td></tr>
      </table>

     <br>¿Elimino la factura?`;
  }

}
