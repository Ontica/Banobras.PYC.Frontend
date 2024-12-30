/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { PaymentInstructionLog } from '@app/models';


@Component({
  selector: 'emp-pmt-instruction-log-table',
  templateUrl: './instruction-log-table.component.html',
})
export class InstructionLogTableComponent implements OnChanges {

  @Input() log: PaymentInstructionLog[] = [];

  displayedColumns: string[] = ['requestTime', 'paymentOrdeNo', 'paymentMethod', 'total', 'currency',
                                'requestCode', 'description', 'statusName'];

  dataSource: MatTableDataSource<PaymentInstructionLog>;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.log) {
      this.setDataTable();
    }
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.log);
  }

}
