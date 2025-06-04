/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo, Identifiable } from '@app/core';

import { sendEventIf } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';


export enum ProjectAccountOperationsTableEventType {
  REMOVE_CLICKED = 'FinancialProjectAccountOperationsTableComponent.Event.RemoveClicked',
}

@Component({
  selector: 'emp-cf-account-operations-table',
  templateUrl: './account-operations-table.component.html',
})
export class FinancialProjectAccountOperationsTableComponent implements OnChanges {

  @Input() projectUID = '';

  @Input() accountUID = '';

  @Input() operations: Identifiable[] = [];

  @Input() canEdit = false;

  @Output() projectAccountOperationsTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['operacion'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<Identifiable>;


  constructor(private messageBox: MessageBoxService) { }


  get hasOperations(): boolean {
    return this.operations.length > 0;
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.operations) {
      this.setDataTable();
    }

    if (changes.canEdit) {
      this.resetColumns();
    }
  }


  onRemoveClicked(operation: Identifiable) {
    const message = this.getConfirmDeleteMessage(operation);

    this.messageBox.confirm(message, 'Eliminar concepto', 'DeleteCancel')
      .firstValue()
      .then(x =>
        sendEventIf(x, this.projectAccountOperationsTableEvent,
          ProjectAccountOperationsTableEventType.REMOVE_CLICKED,
          { projectUID: this.projectUID, accountUID: this.accountUID, operationUID: operation.uid })
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


  private getConfirmDeleteMessage(operation: Identifiable): string {
    return `
      <table class="confirm-data">
        <tr><td class="nowrap">Concepto: </td><td><strong>
          ${operation.name}
        </strong></td></tr>
      </table>

     <br>¿Elimino el conceptos?`;
  }

}
