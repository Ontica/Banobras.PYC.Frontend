/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { SkipIf } from '@app/shared/decorators';

import { sendEvent } from '@app/shared/utils';

import { FinancialAccountsDataService } from '@app/data-services';

import { FinancialAccountDescriptor, FinancialAccount, EmptyFinancialAccount, FinancialAccountFields,
         EmptyFinancialAccountDescriptor, ExternalAccountFields } from '@app/models';

import { AccountsControlsEventType } from './accounts-controls.component';

import { AccountsTableEventType } from './accounts-table.component';

import { AccountModalEventType } from './account-modal.component';

import { OperationsModalEventType } from '../operations/operations-modal.component';

import { ProjectModalEventType } from '@app/views/financial-projects/project/project-modal.component';


export enum AccountsEditionEventType {
  UPDATED = 'FinancialAccountsEditionComponent.Event.Updated',
}

@Component({
  selector: 'emp-cf-accounts-edition',
  templateUrl: './accounts-edition.component.html',
})
export class FinancialAccountsEditionComponent implements OnChanges {

  @Input() projectUID = '';

  @Input() organizationalUnitUID = '';

  @Input() accounts: FinancialAccountDescriptor[] = [];

  @Input() canUpdate = false;

  @Input() queryType: 'financial-project' | 'standard-accounts' = null;

  @Output() accountsEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;

  filter = '';

  displayAccountModal = false;

  displayProjectModal = false;

  displayOperationsModal = false;

  selectedAccount: FinancialAccount = EmptyFinancialAccount;

  selectedData: { projectUID: string; accountUID: string; } = { projectUID: null, accountUID: null };

  createAccountMode = false;


  constructor(private accountsData: FinancialAccountsDataService,
              private messageBox: MessageBoxService) { }


  ngOnChanges() {
    this.filter = '';
  }


  get displayProject(): boolean {
    return this.queryType === 'standard-accounts';
  }


  get canEditAccounts(): boolean {
    return this.queryType === 'financial-project' && this.canUpdate;
  }


  get canEditOperations(): boolean {
    return this.queryType === 'standard-accounts' && this.canUpdate;
  }


  onAccountsControlsEvent(event: EventInfo) {
    switch (event.type as AccountsControlsEventType) {
      case AccountsControlsEventType.FILTER_CHANGED:
        this.filter = event.payload.filter as string;
        return;
      case AccountsControlsEventType.CREATE_CLICKED:
        this.setSelectedAccount(EmptyFinancialAccount, true);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  @SkipIf('submitted')
  onAccountModalEvent(event: EventInfo) {
    switch (event.type as AccountModalEventType) {
      case AccountModalEventType.CLOSE_MODAL_CLICKED:
        this.setSelectedAccount(EmptyFinancialAccount);
        return;
      case AccountModalEventType.CREATE_CLICKED:
        Assertion.assertValue(event.payload.projectUID, 'event.payload.projectUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.createAccount(event.payload.projectUID,
                           event.payload.dataFields);
        return;
      case AccountModalEventType.UPDATE_CLICKED:
        Assertion.assertValue(event.payload.projectUID, 'event.payload.projectUID');
        Assertion.assertValue(event.payload.accountUID, 'event.payload.accountUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.updateAccount(event.payload.projectUID,
                           event.payload.accountUID,
                           event.payload.dataFields);
        return;
      case AccountModalEventType.CREATE_EXTERNAL_CLICKED:
        Assertion.assertValue(event.payload.projectUID, 'event.payload.projectUID');
        Assertion.assertValue(event.payload.dataFields.standardAccountUID, 'event.payload.dataFields.standardAccountUID');
        Assertion.assertValue(event.payload.dataFields.attributes.externalCreditNo, 'event.payload.dataFields.attributes.externalCreditNo');

        const accountNo = event.payload.dataFields.attributes.externalCreditNo;

        const dataFields: ExternalAccountFields = {
          projectUID: event.payload.projectUID,
          standardAccountUID: event.payload.dataFields.standardAccountUID,
        };

        this.createAccountFromCreditSystem(accountNo, dataFields);
        return;
      case AccountModalEventType.REFRESH_EXTERNAL_CLICKED:
        Assertion.assertValue(event.payload.accountUID, 'event.payload.accountUID');
        this.refreshAccountFromCreditSystem(event.payload.accountUID);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  @SkipIf('submitted')
  onAccountsTableEvent(event: EventInfo) {
    switch (event.type as AccountsTableEventType) {
      case AccountsTableEventType.ACCOUNT_CLICKED:
        Assertion.assertValue(event.payload.account.projectUID, 'event.payload.account.projectUID');
        Assertion.assertValue(event.payload.account.uid, 'event.payload.account.uid');
        this.getAccount(event.payload.account.projectUID, event.payload.account.uid);
        return;
      case AccountsTableEventType.PROJECT_CLICKED:
        Assertion.assertValue(event.payload.account.projectUID, 'event.payload.account.projectUID');
        Assertion.assertValue(event.payload.account.uid, 'event.payload.account.uid');
        this.setSelectedProject(event.payload.account)
        return;
      case AccountsTableEventType.REMOVE_CLICKED:
        Assertion.assertValue(event.payload.account.uid, 'event.payload.account.uid');
        this.confirmRemoveAccount(event.payload.account as FinancialAccountDescriptor);
        return;
      case AccountsTableEventType.OPERATIONS_CLICKED:
        Assertion.assertValue(event.payload.account.uid, 'event.payload.account.uid');
        this.setSelectedOperations(event.payload.account)
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onProjectModalEvent(event: EventInfo) {
    switch (event.type as ProjectModalEventType) {
      case ProjectModalEventType.CLOSE_MODAL_CLICKED:
        this.setSelectedProject(EmptyFinancialAccountDescriptor);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onOperationsModalEvent(event: EventInfo) {
    switch (event.type as OperationsModalEventType) {
      case OperationsModalEventType.CLOSE_MODAL_CLICKED:
        this.setSelectedOperations(EmptyFinancialAccountDescriptor);
        return;
      case OperationsModalEventType.UPDATED:
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private getAccount(projectUID: string, accountUID: string) {
    this.submitted = true;

    this.accountsData.getProjectAccount(projectUID, accountUID)
      .firstValue()
      .then(x => this.setSelectedAccount(x))
      .finally(() => this.submitted = false);
  }


  private createAccount(projectUID: string, dataFields: FinancialAccountFields) {
    this.submitted = true;

    this.accountsData.createProjectAccount(projectUID, dataFields)
      .firstValue()
      .then(x => this.resolveAccountUpdated(projectUID))
      .finally(() => this.submitted = false);
  }


  private updateAccount(projectUID: string, accountUID: string, dataFields: FinancialAccountFields) {
    this.submitted = true;

    this.accountsData.updateProjectAccount(projectUID, accountUID, dataFields)
      .firstValue()
      .then(x => this.resolveAccountUpdated(projectUID))
      .finally(() => this.submitted = false);
  }


  private removeAccount(projectUID: string, accountUID: string) {
    this.submitted = true;

    this.accountsData.removeProjectAccount(projectUID, accountUID)
      .firstValue()
      .then(x => this.resolveAccountUpdated(projectUID))
      .finally(() => this.submitted = false);
  }


  private createAccountFromCreditSystem(accountNo: string, dataFields: ExternalAccountFields) {
    this.submitted = true;

    this.accountsData.createAccountFromCreditSystem(accountNo, dataFields)
      .firstValue()
      .then(x => this.resolveAccountUpdated(x.project.uid))
      .finally(() => this.submitted = false);
  }


  private refreshAccountFromCreditSystem(accountUID: string) {
    this.submitted = true;

    this.accountsData.refreshAccountFromCreditSystem(accountUID)
      .firstValue()
      .then(x => this.resolveAccountRefreshed(x))
      .finally(() => this.submitted = false);
  }


  private setSelectedAccount(data: FinancialAccount, display?: boolean) {
    this.createAccountMode = isEmpty(data) && display;
    this.selectedAccount = data;
    this.displayAccountModal = display ?? !isEmpty(data);
  }


  private setSelectedProject(data: FinancialAccountDescriptor, display?: boolean) {
    this.selectedData = { projectUID: data.projectUID, accountUID: data.uid };
    this.displayProjectModal = display ?? !isEmpty(data);
  }


  private setSelectedOperations(data: FinancialAccountDescriptor, display?: boolean) {
    this.selectedData = { projectUID: data.projectUID, accountUID: data.uid};
    this.displayOperationsModal = display ?? !isEmpty(data);
  }


  private confirmRemoveAccount(account: FinancialAccountDescriptor) {
    const title = 'Eliminar cuenta';
    const message = this.getConfirmRemoveAccountMessage(account);

    this.messageBox.confirm(message, title, 'DeleteCancel')
      .firstValue()
      .then(x => x ? this.removeAccount(account.projectUID, account.uid) : null);
  }


  private getConfirmRemoveAccountMessage(account: FinancialAccountDescriptor): string {
    return `
      <table class='confirm-data'>
        <tr><td class='nowrap'>No. cuenta: </td><td><strong>${account.accountNo}</strong></td></tr>
        <tr><td class='nowrap'>Área: </td><td><strong>${account.organizationalUnitName}</strong></td></tr>
        <tr><td class='nowrap'>Tipo: </td><td><strong>${account.financialAccountTypeName}</strong></td></tr>
        <tr><td class='nowrap'>Descripción: </td><td><strong>${account.description}</strong></td></tr>
      </table>
      <br>¿Elimino la cuenta?`;
  }


  private resolveAccountUpdated(projectUID: string) {
    const payload = { dataUID: projectUID };
    sendEvent(this.accountsEditionEvent, AccountsEditionEventType.UPDATED, payload);
    this.setSelectedAccount(EmptyFinancialAccount);
  }


  private resolveAccountRefreshed(account: FinancialAccount) {
    const payload = { dataUID: account.project.uid };
    sendEvent(this.accountsEditionEvent, AccountsEditionEventType.UPDATED, payload);
    this.setSelectedAccount(account);
  }

}
