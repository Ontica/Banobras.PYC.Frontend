/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { HistoryEntry } from '@app/models';


@Component({
  selector: 'emp-ng-history-table',
  templateUrl: './history-table.component.html',
})
export class HistoryTableComponent implements OnChanges {

  @Input() history: HistoryEntry[] = [];

  displayedColumns: string[] = ['operation', 'partyName', 'description', 'time'];

  dataSource: MatTableDataSource<HistoryEntry>;


  ngOnChanges() {
    this.setDataTable();
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.history);
  }

}
