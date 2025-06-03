/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { FinancialProjectAccountDescriptor } from '@app/models';


export enum ProjectAccountsTableEventType {
  SELECT_CLICKED          = 'FinancialProjectAccountsTableComponent.Event.SelectClicked',
  REMOVE_CLICKED          = 'FinancialProjectAccountsTableComponent.Event.RemoveClicked',
  EDIT_OPERATIONS_CLICKED = 'FinancialProjectAccountsTableComponent.Event.EditOperationsClicked',
}

@Component({
  selector: 'emp-cf-project-accounts-table',
  templateUrl: './project-accounts-table.component.html',
})
export class FinancialProjectAccountsTableComponent implements OnChanges {

  @Input() accounts: FinancialProjectAccountDescriptor[] = [];

  @Input() canEdit = false;

  @Output() projectAccountsTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['accountNo', 'organizationalUnitName', 'financialAccountTypeName',
    'description', 'statusName', 'actionOperations'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<FinancialProjectAccountDescriptor>;


  constructor() { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.accounts) {
      this.setDataTable();
    }
  }


  onSelectAccountClicked(account: FinancialProjectAccountDescriptor) {
    if (window.getSelection().toString().length <= 0) {
      sendEvent(this.projectAccountsTableEvent, ProjectAccountsTableEventType.SELECT_CLICKED,
        { account });
    }
  }


  onEditOperationsClicked(account: FinancialProjectAccountDescriptor) {
    sendEvent(this.projectAccountsTableEvent, ProjectAccountsTableEventType.EDIT_OPERATIONS_CLICKED,
      { account });
  }


  onRemoveAccountClicked(account: FinancialProjectAccountDescriptor) {
    sendEvent(this.projectAccountsTableEvent, ProjectAccountsTableEventType.REMOVE_CLICKED,
      { account });
  }


  private setDataTable() {
    this.resetColumns();
    this.dataSource = new MatTableDataSource(this.accounts);
  }


  private resetColumns() {
    this.displayedColumns = this.canEdit ?
      [...this.displayedColumnsDefault, 'actionDelete'] :
      [...this.displayedColumnsDefault];
  }

}
