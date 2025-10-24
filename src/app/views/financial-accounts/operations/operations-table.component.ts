/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { sendEventIf } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { FinancialAccountOperation } from '@app/models';


export enum OperationsTableEventType {
  REMOVE_CLICKED = 'FinancialAccountOperationsTableComponent.Event.RemoveClicked',
}

@Component({
  selector: 'emp-financial-operations-table',
  templateUrl: './operations-table.component.html',
})
export class FinancialAccountOperationsTableComponent implements OnChanges {

  @Input() accountUID = '';

  @Input() operations: FinancialAccountOperation[] = [];

  @Input() canEdit = false;

  @Output() operationsTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['operationType', 'accountNo', 'currency'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<FinancialAccountOperation>;


  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.operations) {
      this.setDataTable();
    }

    if (changes.canEdit) {
      this.resetColumns();
    }
  }


  onRemoveClicked(operation: FinancialAccountOperation) {
    const message = this.getConfirmDeleteMessage(operation);

    this.messageBox.confirm(message, 'Eliminar concepto', 'DeleteCancel')
      .firstValue()
      .then(x =>
        sendEventIf(x, this.operationsTableEvent,
          OperationsTableEventType.REMOVE_CLICKED,
          { accountUID: this.accountUID, operationUID: operation.uid })
       );
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.operations ?? []);
    this.resetColumns();
  }


  private resetColumns() {
    this.displayedColumns = [...this.displayedColumnsDefault];

    if (this.canEdit) {
      this.displayedColumns.push('actionDelete');
    }
  }


  private getConfirmDeleteMessage(operation: FinancialAccountOperation): string {
    return `
      <table class="confirm-data">
        <tr><td class="nowrap">Cuenta: </td><td><strong>${operation.operationTypeName}</strong></td></tr>
        <tr><td class="nowrap">Concepto: </td><td><strong>${operation.accountNo ?? '-'}</strong></td></tr>
        <tr><td class="nowrap">Moneda: </td><td><strong>${operation.currencyName ?? '-'}</strong></td></tr>
      </table>

     <br>¿Elimino el conceptos?`;
  }

}
