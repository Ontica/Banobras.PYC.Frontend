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

import { SkipIfSelection } from '@app/shared/decorators';

import { MessageBoxService } from '@app/shared/services';

import { sendEvent, sendEventIf } from '@app/shared/utils';

import { FinancialAccountDescriptor } from '@app/models';


export enum AccountsTableEventType {
  ACCOUNT_CLICKED    = 'FinancialAccountsTableComponent.Event.AccountClicked',
  PROJECT_CLICKED    = 'FinancialAccountsTableComponent.Event.ProjectClicked',
  OPERATIONS_CLICKED = 'FinancialAccountsTableComponent.Event.OperationsClicked',
  REMOVE_CLICKED     = 'FinancialAccountsTableComponent.Event.RemoveClicked',
  SUSPEND_CLICKED    = 'FinancialAccountsTableComponent.Event.SuspendClicked',
  ACTIVATE_CLICKED     = 'FinancialAccountsTableComponent.Event.ActivateClicked',
}

@Component({
  selector: 'emp-financial-accounts-table',
  templateUrl: './accounts-table.component.html',
})
export class FinancialAccountsTableComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() accounts: FinancialAccountDescriptor[] = [];

  @Input() filter = '';

  @Input() showProject = false;

  @Input() showOperations = false;

  @Input() canDelete = false;

  @Input() canEditStatus = false;

  @Input() canEditOperations = false;

  @Output() accountsTableEvent = new EventEmitter<EventInfo>();

  displayedColumns = ['accountNo', 'organizationalUnitName', 'financialAccountTypeName',
    'description', 'statusName', 'actionOperations'];

  dataSource: TableVirtualScrollDataSource<FinancialAccountDescriptor>;


  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.accounts) {
      this.setDataTable();
      this.scrollToTop();
    }

    if (changes.filter) {
      this.applyFilter(this.filter);
    }
  }


  @SkipIfSelection()
  onSelectAccountClicked(account: FinancialAccountDescriptor) {
    sendEvent(this.accountsTableEvent, AccountsTableEventType.ACCOUNT_CLICKED, { account });
  }


  @SkipIfSelection()
  onSelectProjectClicked(account: FinancialAccountDescriptor) {
    sendEvent(this.accountsTableEvent, AccountsTableEventType.PROJECT_CLICKED, { account });
  }


  onOperationsClicked(account: FinancialAccountDescriptor) {
    sendEvent(this.accountsTableEvent, AccountsTableEventType.OPERATIONS_CLICKED, { account });
  }


  onActivateAccountClicked(account: FinancialAccountDescriptor) {
    this.showConfirmMessage(AccountsTableEventType.ACTIVATE_CLICKED, account);
  }


  onSuspendAccountClicked(account: FinancialAccountDescriptor) {
    this.showConfirmMessage(AccountsTableEventType.SUSPEND_CLICKED, account);
  }


  onRemoveAccountClicked(account: FinancialAccountDescriptor) {
    this.showConfirmMessage(AccountsTableEventType.REMOVE_CLICKED, account);
  }


  private setDataTable() {
    this.resetColumns();
    this.dataSource = new TableVirtualScrollDataSource(this.accounts);
  }


  private resetColumns() {
    const columns = [];

    if (this.showProject) {
      columns.push('accountNo', 'organizationalUnitName', 'financialAccountTypeName', 'projectNo',
        'description', 'statusName');
    } else {
      columns.push('accountNo', 'organizationalUnitName', 'financialAccountTypeName',
        'description', 'statusName');
    }

    if (this.canEditStatus) columns.push('actionStatus');
    if (this.showOperations) columns.push('actionOperations');
    if (this.canDelete) columns.push('actionDelete');

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


  private showConfirmMessage(eventType: AccountsTableEventType, account: FinancialAccountDescriptor) {
    const confirmType = this.getConfirmType(eventType);
    const title = this.getConfirmTitle(eventType);
    const message = this.getConfirmMessage(eventType, account);

    this.messageBox.confirm(message, title, confirmType)
      .firstValue()
      .then(x => sendEventIf(x, this.accountsTableEvent, eventType, { account }));
  }


  private getConfirmType(eventType: AccountsTableEventType): 'AcceptCancel' | 'DeleteCancel' {
    switch (eventType) {
      case AccountsTableEventType.REMOVE_CLICKED:
      case AccountsTableEventType.SUSPEND_CLICKED:
        return 'DeleteCancel';
      default:
        return 'AcceptCancel';
    }
  }


  private getConfirmTitle(eventType: AccountsTableEventType): string {
    switch (eventType) {
      case AccountsTableEventType.REMOVE_CLICKED:   return 'Eliminar cuenta';
      case AccountsTableEventType.SUSPEND_CLICKED:  return 'Suspender cuenta';
      case AccountsTableEventType.ACTIVATE_CLICKED: return 'Activar cuenta';
      default: return '';
    }
  }


  private getConfirmMessage(eventType: AccountsTableEventType, account: FinancialAccountDescriptor): string {
    const accountData = `<br><br>
      <table class='confirm-data'>
        <tr><td class='nowrap'>No. cuenta: </td><td><strong>${account.accountNo}</strong></td></tr>
        <tr><td class='nowrap'>Área: </td><td><strong>${account.organizationalUnitName}</strong></td></tr>
        <tr><td class='nowrap'>Tipo: </td><td><strong>${account.financialAccountTypeName}</strong></td></tr>
        <tr><td class='nowrap'>Descripción: </td><td><strong>${account.description}</strong></td></tr>
      </table><br>`;

    switch (eventType) {
      case AccountsTableEventType.REMOVE_CLICKED:
        return 'Esta operación eliminará la cuenta:' + accountData + '¿Elimino la cuenta?';
      case AccountsTableEventType.ACTIVATE_CLICKED:
        return 'Esta operación activará la cuenta:' + accountData + '¿Activo la cuenta?';
      case AccountsTableEventType.SUSPEND_CLICKED:
        return 'Esta operación suspenderá la cuenta:' + accountData + '¿Suspendo la cuenta?';
      default:
        return '';
    }
  }

}
