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

import { FinancialAccountOperationType } from '@app/models';


export enum OperationsTypesTableEventType {
  REMOVE_CLICKED = 'FinancialAccountOperationsTypesTableComponent.Event.RemoveClicked',
}

@Component({
  selector: 'emp-cf-operations-types-table',
  templateUrl: './operations-types-table.component.html',
})
export class FinancialAccountOperationsTypesTableComponent implements OnChanges {

  @Input() accountUID = '';

  @Input() operationsTypes: FinancialAccountOperationType[] = [];

  @Input() canEdit = false;

  @Output() operationsTypesTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['operationType', 'operationTypeNo', 'currency'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<FinancialAccountOperationType>;


  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.operationsTypes) {
      this.setDataTable();
    }

    if (changes.canEdit) {
      this.resetColumns();
    }
  }


  onRemoveClicked(operationType: FinancialAccountOperationType) {
    const message = this.getConfirmDeleteMessage(operationType);

    this.messageBox.confirm(message, 'Eliminar concepto', 'DeleteCancel')
      .firstValue()
      .then(x =>
        sendEventIf(x, this.operationsTypesTableEvent,
          OperationsTypesTableEventType.REMOVE_CLICKED,
          { accountUID: this.accountUID, operationTypeUID: operationType.uid })
       );
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.operationsTypes ?? []);
    this.resetColumns();
  }


  private resetColumns() {
    this.displayedColumns = [...this.displayedColumnsDefault];

    if (this.canEdit) {
      this.displayedColumns.push('actionDelete');
    }
  }


  private getConfirmDeleteMessage(operationType: FinancialAccountOperationType): string {
    return `
      <table class="confirm-data">
        <tr><td class="nowrap">Cuenta: </td><td><strong>${operationType.operation ?? operationType.name}</strong></td></tr>
        <tr><td class="nowrap">Concepto: </td><td><strong>${operationType.operationNo ?? '-'}</strong></td></tr>
        <tr><td class="nowrap">Moneda: </td><td><strong>${operationType.currencyName ?? '-'}</strong></td></tr>
      </table>

     <br>¿Elimino el conceptos?`;
  }

}
