/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { SkipIf } from '@app/shared/decorators';

import { sendEvent } from '@app/shared/utils';

import { FinancialProjectsDataService } from '@app/data-services';

import { FinancialAccountDescriptor, FinancialAccount, EmptyFinancialAccount,
         FinancialAccountFields } from '@app/models';

import { ProjectAccountEditorEventType } from './project-account-editor.component';

import { ProjectAccountsTableEventType } from './project-accounts-table.component';

import {
  ProjectAccountOperationsEditionEventType
} from './account-operations/account-operations-edition.component';


export enum ProjectAccountsEditionEventType {
  UPDATED = 'FinancialProjectAccountsEditionComponent.Event.Updated',
}

@Component({
  selector: 'emp-cf-project-accounts-edition',
  templateUrl: './project-accounts-edition.component.html',
})
export class FinancialProjectAccountsEditionComponent {

  @Input() projectUID = '';

  @Input() accounts: FinancialAccountDescriptor[] = [];

  @Input() canEdit = false;

  @Output() projectAccountsEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;

  displayAccountEditor = false;

  displayAccountOperations = false;

  selectedAccount: FinancialAccount = EmptyFinancialAccount;

  selectedAccountOperationsUID = '';


  constructor(private projectsData: FinancialProjectsDataService,
              private messageBox: MessageBoxService) { }


  onAddProjectAccountButtonClicked() {
    this.setSelectedAccount(EmptyFinancialAccount, true);
  }


  @SkipIf('submitted')
  onProjectAccountEditorEvent(event: EventInfo) {
    switch (event.type as ProjectAccountEditorEventType) {
      case ProjectAccountEditorEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedAccount(EmptyFinancialAccount);
        return;
      case ProjectAccountEditorEventType.CREATE_CLICKED:
        Assertion.assertValue(event.payload.projectUID, 'event.payload.projectUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.createProjectAccount(event.payload.projectUID,
                                  event.payload.dataFields);
        return;
      case ProjectAccountEditorEventType.UPDATE_CLICKED:
        Assertion.assertValue(event.payload.projectUID, 'event.payload.projectUID');
        Assertion.assertValue(event.payload.accountUID, 'event.payload.accountUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.updateProjectAccount(event.payload.projectUID,
                                  event.payload.accountUID,
                                  event.payload.dataFields);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  @SkipIf('submitted')
  onProjectAccountsTableEvent(event: EventInfo) {
    switch (event.type as ProjectAccountsTableEventType) {
      case ProjectAccountsTableEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.account.uid, 'event.payload.account.uid');
        this.getProjectAccount(this.projectUID, event.payload.account.uid);
        return;
      case ProjectAccountsTableEventType.REMOVE_CLICKED:
        Assertion.assertValue(event.payload.account.uid, 'event.payload.account.uid');
        this.confirmRemoveProjectAccount(event.payload.account as FinancialAccountDescriptor);
        return;
      case ProjectAccountsTableEventType.EDIT_OPERATIONS_CLICKED:
        Assertion.assertValue(event.payload.account.uid, 'event.payload.account.uid');
        this.setSelectedAccountOperation(event.payload.account.uid)
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onProjectAccountOperationsEditionEvent(event: EventInfo) {
    switch (event.type as ProjectAccountOperationsEditionEventType) {
      case ProjectAccountOperationsEditionEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedAccountOperation(null);
        return;
      case ProjectAccountOperationsEditionEventType.UPDATED:
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private getProjectAccount(projectUID: string, accountUID: string) {
    this.submitted = true;

    this.projectsData.getProjectAccount(projectUID, accountUID)
      .firstValue()
      .then(x => this.setSelectedAccount(x))
      .finally(() => this.submitted = false);
  }


  private createProjectAccount(projectUID: string, dataFields: FinancialAccountFields) {
    this.submitted = true;

    this.projectsData.createProjectAccount(projectUID, dataFields)
      .firstValue()
      .then(x => this.resolveAccountUpdated())
      .finally(() => this.submitted = false);
  }


  private updateProjectAccount(projectUID: string, accountUID: string, dataFields: FinancialAccountFields) {
    this.submitted = true;

    this.projectsData.updateProjectAccount(projectUID, accountUID, dataFields)
      .firstValue()
      .then(x => this.resolveAccountUpdated())
      .finally(() => this.submitted = false);
  }


  private removeProjectAccount(projectUID: string, accountUID: string) {
    this.submitted = true;

    this.projectsData.removeProjectAccount(projectUID, accountUID)
      .firstValue()
      .then(x => this.resolveAccountUpdated())
      .finally(() => this.submitted = false);
  }


  private setSelectedAccount(data: FinancialAccount, display?: boolean) {
    this.selectedAccount = data;
    this.displayAccountEditor = display ?? !isEmpty(data);
  }


  private setSelectedAccountOperation(accountUID: string, display?: boolean) {
    this.selectedAccountOperationsUID = accountUID;
    this.displayAccountOperations = display ?? !!accountUID;
  }


  private confirmRemoveProjectAccount(account: FinancialAccountDescriptor) {
    const title = 'Eliminar cuenta';
    const message = this.getConfirmRemoveAccountMessage(account);

    this.messageBox.confirm(message, title, 'DeleteCancel')
      .firstValue()
      .then(x => x ? this.removeProjectAccount(this.projectUID, account.uid) : null);
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


  private resolveAccountUpdated() {
    const payload = { dataUID: this.projectUID };
    sendEvent(this.projectAccountsEditionEvent, ProjectAccountsEditionEventType.UPDATED, payload);
    this.setSelectedAccount(EmptyFinancialAccount);
  }

}
