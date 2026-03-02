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

import { sendEventIf } from '@app/shared/utils';

import { Budget, BudgetPeriod } from '@app/models';


export enum BudgetPeriodTableEventType {
  CLOSE_CLICKED    = 'BudgetPeriodTableComponent.Event.CloseClicked',
  OPEN_CLICKED     = 'BudgetPeriodTableComponent.Event.OpenClicked',
  GENERATE_CLICKED = 'BudgetPeriodTableComponent.Event.GenerateClicked',
}

@Component({
  selector: 'emp-bdg-budget-period-table',
  templateUrl: './budget-period-table.component.html',
})
export class BudgetPeriodTableComponent implements OnChanges {

  @Input() data: BudgetPeriod[] = [];

  @Input() budget: Budget = null;

  @Input() queryExecuted = false;

  @Input() isLoading = false;

  @Output() budgetPeriodTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = [ 'month',
    'modified', 'requested', 'commited', 'toPay', 'exercised', 'toExercise', 'available'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<BudgetPeriod>;

  eventTypes = BudgetPeriodTableEventType;


  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.setDataTable();
    }
  }


  @SkipIfSelection()
  onEventButtonClicked(eventType: BudgetPeriodTableEventType, data: BudgetPeriod) {
    this.showConfirmMessage(eventType, data);
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.data);
    this.resetColumns();
  }


  private resetColumns() {
    const hasActions = this.data.some(x => x.actions.canClose || x.actions.canOpen);
    const hasActionGenerate = this.data.some(x => x.actions.canGenerate);

    let columns = [...this.displayedColumnsDefault];
    if (hasActions) columns.push('actions');
    if (hasActionGenerate) columns.push('actionGenerate');

    this.displayedColumns = columns;
  }


  private showConfirmMessage(eventType: BudgetPeriodTableEventType, data: BudgetPeriod) {
    const confirmType = this.getConfirmType(eventType);
    const title = this.getConfirmTitle(eventType);
    const message = this.getConfirmMessage(eventType, data);
    const button = this.getConfirmButton(eventType);

    this.messageBox.confirm(message, title, confirmType, button)
      .firstValue()
      .then(x => sendEventIf(x, this.budgetPeriodTableEvent, eventType, { data: data }));
  }


  private getConfirmType(eventType: BudgetPeriodTableEventType): 'AcceptCancel' | 'DeleteCancel' {
    switch (eventType) {
      case BudgetPeriodTableEventType.CLOSE_CLICKED:
      case BudgetPeriodTableEventType.OPEN_CLICKED:
      case BudgetPeriodTableEventType.GENERATE_CLICKED:
      default:
        return 'AcceptCancel';
    }
  }


  private getConfirmTitle(eventType: BudgetPeriodTableEventType): string {
    switch (eventType) {
      case BudgetPeriodTableEventType.CLOSE_CLICKED:    return 'Cerrar período presupuestal';
      case BudgetPeriodTableEventType.OPEN_CLICKED:     return 'Abrir período presupuestal';
      case BudgetPeriodTableEventType.GENERATE_CLICKED: return 'Generar transacciones de traslado';
      default: return '';
    }
  }


  private getConfirmMessage(eventType: BudgetPeriodTableEventType, data: BudgetPeriod): string {
    switch (eventType) {
      case BudgetPeriodTableEventType.CLOSE_CLICKED:
        return `Esta operación cerrará el período presupuestal correspondiente a
                <strong>${this.budget.name}: ${data.monthName}</strong>.
                <br><br>¿Cierro el período presupuestal?`;

      case BudgetPeriodTableEventType.OPEN_CLICKED:
        return `Esta operación abrirá el período presupuestal correspondiente a
                <strong>${this.budget.name}: ${data.monthName}</strong>.
                <br><br>¿Abro el período presupuestal?`;

      case BudgetPeriodTableEventType.GENERATE_CLICKED:
        return `Esta operación generará las transacciones de traslado de saldos correspondiente a
                <strong>${this.budget.name}: ${data.monthName}</strong>.
                <br><br>¿Genero las transacciones de traslado?`;

      default: return '';
    }
  }


  private getConfirmButton(eventType: BudgetPeriodTableEventType): string {
    switch (eventType) {
      case BudgetPeriodTableEventType.CLOSE_CLICKED:    return 'Cerrar';
      case BudgetPeriodTableEventType.OPEN_CLICKED:     return 'Abrir';
      case BudgetPeriodTableEventType.GENERATE_CLICKED: return 'Generar';
      default: return '';
    }
  }

}
