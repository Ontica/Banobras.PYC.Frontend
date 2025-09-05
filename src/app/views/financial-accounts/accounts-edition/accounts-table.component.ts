/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { FinancialAccountDescriptor } from '@app/models';


export enum AccountsTableEventType {
  ACCOUNT_CLICKED    = 'FinancialAccountsTableComponent.Event.AccountClicked',
  PROJECT_CLICKED    = 'FinancialAccountsTableComponent.Event.ProjectClicked',
  OPERATIONS_CLICKED = 'FinancialAccountsTableComponent.Event.OperationsClicked',
  REMOVE_CLICKED     = 'FinancialAccountsTableComponent.Event.RemoveClicked',
}

@Component({
  selector: 'emp-cf-accounts-table',
  templateUrl: './accounts-table.component.html',
})
export class FinancialAccountsTableComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() accounts: FinancialAccountDescriptor[] = [];

  @Input() filter = '';

  @Input() displayProject = false;

  @Input() canEditAccounts = false;

  @Input() canEditOperations = false;

  @Output() accountsTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['accountNo', 'organizationalUnitName', 'financialAccountTypeName',
    'description', 'statusName', 'actionOperations'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: TableVirtualScrollDataSource<FinancialAccountDescriptor>;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.accounts) {
      this.setDataTable();
      this.scrollToTop();
    }

    if (changes.filter) {
      this.applyFilter(this.filter);
    }
  }


  onSelectAccountClicked(account: FinancialAccountDescriptor) {
    if (window.getSelection().toString().length <= 0) {
      sendEvent(this.accountsTableEvent, AccountsTableEventType.ACCOUNT_CLICKED, { account });
    }
  }


  onSelectProjectClicked(account: FinancialAccountDescriptor) {
    if (window.getSelection().toString().length <= 0) {
      sendEvent(this.accountsTableEvent, AccountsTableEventType.PROJECT_CLICKED, { account });
    }
  }


  onOperationsClicked(account: FinancialAccountDescriptor) {
    sendEvent(this.accountsTableEvent, AccountsTableEventType.OPERATIONS_CLICKED, { account });
  }


  onRemoveAccountClicked(account: FinancialAccountDescriptor) {
    sendEvent(this.accountsTableEvent, AccountsTableEventType.REMOVE_CLICKED, { account });
  }


  private setDataTable() {
    this.resetColumns();
    this.dataSource = new TableVirtualScrollDataSource(this.accounts);
  }


  private resetColumns() {
    const columns = [];

    if (this.displayProject) {
      columns.push('projectNo');
    }

    columns.push('accountNo', 'organizationalUnitName', 'financialAccountTypeName', 'description',
      'statusName', 'actionOperations');

    if (this.canEditAccounts) {
      columns.push('actionDelete');
    }

    this.displayedColumns = [...[], ...columns];
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(-1);
    }
  }


  private applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }

}
