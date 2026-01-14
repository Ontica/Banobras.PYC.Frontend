/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { sendEvent, sendEventIf } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { EntityStatus, PayrollDescriptor } from '@app/models';


export enum PayrollsTableEventType {
  DELETE_CLICKED  = 'PayrollsTableComponent.Event.DeleteClicked',
  RESTORE_CLICKED = 'PayrollsTableComponent.Event.RestoreClicked',
  EXPORT_CLICKED  = 'PayrollsTableComponent.Event.ExportClicked',
}

@Component({
  selector: 'emp-pyc-payrolls-table',
  templateUrl: './payrolls-table.component.html',
})
export class PayrollsTableComponent implements OnChanges {

  @Input() dataList: PayrollDescriptor[] = [];

  @Input() queryExecuted = false;

  @Output() payrollsTableEvent = new EventEmitter<EventInfo>();

  displayedColumns = ['payrollNo', 'payrollDate', 'description', 'statusName', 'actionStatus', 'actionExport'];

  dataSource: MatTableDataSource<PayrollDescriptor>;

  EntityStatus = EntityStatus;


  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.setDataTable();
    }
  }


  onDeleteClicked(payroll: PayrollDescriptor) {
    const message = `Esta operación eliminará la nómina
                    <strong>(${payroll.payrollNo}) ${payroll.description}</strong>.
                    <br><br>¿Elimino la nómina?`;

    this.messageBox.confirm(message, 'Eliminar nómina', 'DeleteCancel')
      .firstValue()
      .then(x => sendEventIf(x, this.payrollsTableEvent, PayrollsTableEventType.DELETE_CLICKED, { payroll }));
  }


  onRestoreClicked(payroll: PayrollDescriptor) {
    const message = `Esta operación restaurará la nómina
                    <strong>(${payroll.payrollNo}) ${payroll.description}</strong> a estado pendiente.
                    <br><br>¿Restauro la nómina a estado pendiente?`;

    this.messageBox.confirm(message, 'Restaurar a estado pendiente')
      .firstValue()
      .then(x => sendEventIf(x, this.payrollsTableEvent, PayrollsTableEventType.RESTORE_CLICKED, { payroll }));
  }


  onExportClicked(payroll: PayrollDescriptor) {
    sendEvent(this.payrollsTableEvent, PayrollsTableEventType.EXPORT_CLICKED, { payroll });
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.dataList ?? []);
  }

}
