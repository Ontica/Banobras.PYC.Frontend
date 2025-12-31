/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { SkipIf } from '@app/shared/decorators';

import { sendEvent } from '@app/shared/utils';

import { FinancialAccountsDataService } from '@app/data-services';

import { FinancialAccountDescriptor, FinancialAccount, EmptyFinancialAccount, FinancialAccountFields,
         EmptyFinancialAccountDescriptor, ExternalAccountFields } from '@app/models';

import { AccountsControlsEventType } from './accounts-controls.component';

import { AccountsTableEventType } from './accounts-table.component';

import { AccountModalEventType } from './account-modal.component';

import { OperationsModalEventType } from '../operations/operations-modal.component';

import { ProjectModalEventType } from '@app/views/financial/projects/project/project-modal.component';


export enum AccountsEditionEventType {
  UPDATED = 'FinancialAccountsEditionComponent.Event.Updated',
}

@Component({
  selector: 'emp-financial-accounts-edition',
  templateUrl: './accounts-edition.component.html',
})
export class FinancialAccountsEditionComponent implements OnChanges {

  @Input() chartOfAccountsUID = '';

  @Input() projectUID = '';

  @Input() organizationalUnitUID = '';

  @Input() accounts: FinancialAccountDescriptor[] = [];

  @Input() accountTypesList: Identifiable[] = [];

  @Input() canUpdate = false;

  @Input() canDelete = false;

  @Input() canSuspend = false;

  @Input() canActivate = false;

  @Input() canEditOperations = false;

  @Input() showOperations = false;

  @Input() showProject = false;

  @Input() queryType: 'financial-project' | 'standard-accounts-with-project' |
                      'standard-accounts-without-project' = null;

  @Output() accountsEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;

  filter = '';

  displayAccountModal = false;

  displayProjectModal = false;

  displayOperationsModal = false;

  selectedAccount: FinancialAccount = EmptyFinancialAccount;

  selectedData: { projectUID: string; accountUID: string; } = { projectUID: null, accountUID: null };

  createAccountMode = false;


  constructor(private accountsData: FinancialAccountsDataService) { }


  ngOnChanges() {
    this.filter = '';
  }


  get isFinancialProject(): boolean {
    return this.queryType === 'financial-project';
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
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.createAccount(event.payload.dataFields);
        return;
      case AccountModalEventType.UPDATE_CLICKED:
        Assertion.assertValue(event.payload.accountUID, 'event.payload.accountUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.updateAccount(event.payload.accountUID,
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
        Assertion.assertValue(event.payload.account.uid, 'event.payload.account.uid');
        this.getAccount(event.payload.account.uid);
        return;
      case AccountsTableEventType.PROJECT_CLICKED:
        Assertion.assertValue(event.payload.account.projectUID, 'event.payload.account.projectUID');
        Assertion.assertValue(event.payload.account.uid, 'event.payload.account.uid');
        this.setSelectedProject(event.payload.account)
        return;
      case AccountsTableEventType.ACTIVATE_CLICKED:
        Assertion.assertValue(event.payload.account.uid, 'event.payload.account.uid');
        this.activateAccount(event.payload.account.uid);
        return;
      case AccountsTableEventType.SUSPEND_CLICKED:
        Assertion.assertValue(event.payload.account.uid, 'event.payload.account.uid');
        this.suspendAccount(event.payload.account.uid);
        return;
      case AccountsTableEventType.REMOVE_CLICKED:
        Assertion.assertValue(event.payload.account.uid, 'event.payload.account.uid');
        this.removeAccount(event.payload.account.uid);
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


  private getAccount(accountUID: string) {
    const observable = this.isFinancialProject ?
      this.accountsData.getProjectAccount(this.projectUID, accountUID) :
      this.accountsData.getAccount(accountUID);

    this.submitted = true;

    observable
      .firstValue()
      .then(x => this.setSelectedAccount(x))
      .finally(() => this.submitted = false);
  }


  private createAccount(dataFields: FinancialAccountFields) {
    const observable = this.isFinancialProject ?
      this.accountsData.createProjectAccount(this.projectUID, dataFields) :
      this.accountsData.createAccount(dataFields);

    this.submitted = true;

    observable
      .firstValue()
      .then(x => this.resolveAccountUpdated(this.projectUID, x.uid, x))
      .finally(() => this.submitted = false);
  }


  private updateAccount(accountUID: string, dataFields: FinancialAccountFields) {
    const observable = this.isFinancialProject ?
      this.accountsData.updateProjectAccount(this.projectUID, accountUID, dataFields) :
      this.accountsData.updateAccount(accountUID, dataFields);

    this.submitted = true;

    observable
      .firstValue()
      .then(x => this.resolveAccountUpdated(this.projectUID, x.uid, x))
      .finally(() => this.submitted = false);
  }


  private removeAccount(accountUID: string) {
    const observable = this.isFinancialProject ?
      this.accountsData.removeProjectAccount(this.projectUID, accountUID) :
      this.accountsData.removeAccount(accountUID);

    this.submitted = true;

    observable
      .firstValue()
      .then(x => this.resolveAccountUpdated(this.projectUID, accountUID, x))
      .finally(() => this.submitted = false);
  }


  private activateAccount(accountUID: string) {
    this.submitted = true;

    this.accountsData.activateAccount(accountUID)
      .firstValue()
      .then(x => this.resolveAccountUpdated(x.project.uid, accountUID))
      .finally(() => this.submitted = false);
  }


  private suspendAccount(accountUID: string) {
    this.submitted = true;

    this.accountsData.suspendAccount(accountUID)
      .firstValue()
      .then(x => this.resolveAccountUpdated(x.project.uid, accountUID))
      .finally(() => this.submitted = false);
  }


  private createAccountFromCreditSystem(accountNo: string, dataFields: ExternalAccountFields) {
    this.submitted = true;

    this.accountsData.createAccountFromCreditSystem(accountNo, dataFields)
      .firstValue()
      .then(x => this.resolveAccountUpdated(x.project.uid, x.uid))
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


  private resolveAccountUpdated(projectUID: string, accountUID: string,  response: FinancialAccount | void) {
    const payload = { projectUID, accountUID, response };
    sendEvent(this.accountsEditionEvent, AccountsEditionEventType.UPDATED, payload);
    this.setSelectedAccount(EmptyFinancialAccount);
  }


  private resolveAccountRefreshed(account: FinancialAccount) {
    const payload = { projectUID: account.project.uid, accountUID: account.uid};
    sendEvent(this.accountsEditionEvent, AccountsEditionEventType.UPDATED, payload);
    this.setSelectedAccount(account);
  }

}
