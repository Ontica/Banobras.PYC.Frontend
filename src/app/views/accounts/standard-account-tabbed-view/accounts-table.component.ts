/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { FinancialAccountDescriptor } from '@app/models';


export enum ProjectAccountsTableEventType {

}

@Component({
  selector: 'emp-cf-accounts-table',
  templateUrl: './accounts-table.component.html',
})
export class AccountsTableComponent implements OnChanges {

  @Input() accounts: FinancialAccountDescriptor[] = [];

  @Output() accountsTableEvent = new EventEmitter<EventInfo>();

  displayedColumns: string[] = ['accountNo', 'organizationalUnitName', 'financialAccountTypeName',
    'description', 'statusName'];

  dataSource: MatTableDataSource<FinancialAccountDescriptor>;


  constructor() { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.accounts) {
      this.setDataTable();
    }
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.accounts);
  }

}
