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

import { FinancialProjectsDataService } from '@app/data-services';

import { FinancialAccountDescriptor, FinancialAccount, EmptyFinancialAccount, FinancialAccountFields,
         EmptyFinancialAccountDescriptor, OperacionSelectData, EmptyOperacionSelectData} from '@app/models';

import { FinancialAccountsControlsEventType } from './financial-accounts-controls.component';

import { FinancialAccountsTableEventType } from './financial-accounts-table.component';

import { FinancialAccountEditorEventType } from './financial-account-editor.component';

import { OperationsEditionEventType } from '../operations/operations-edition.component';

import { ProjectModalEventType } from '@app/views/financial-projects/project/project-modal.component';


export enum FinancialAccountsEditionEventType {
  UPDATED = 'FinancialAccountsEditionComponent.Event.Updated',
}


@Component({
  selector: 'emp-cf-financial-accounts-edition',
  templateUrl: './financial-accounts-edition.component.html',
})
export class FinancialAccountsEditionComponent implements OnChanges {

  @Input() projectUID = '';

  @Input() organizationalUnitUID = '';

  @Input() accounts: FinancialAccountDescriptor[] = [];

  @Input() canUpdate = false;

  @Input() queryType: 'financial-project' | 'standard-accounts' = null;

  @Output() financialAccountsEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;

  filter = '';

  displayAccountEditor = false;

  displayProjectEditor = false;

  displayOperations = false;

  selectedAccount: FinancialAccount = EmptyFinancialAccount;

  selectedOperationData: OperacionSelectData = EmptyOperacionSelectData;

  createAccount = false;


  constructor(private projectsData: FinancialProjectsDataService,
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


  onFinancialAccountsControlsEvent(event: EventInfo) {
    switch (event.type as FinancialAccountsControlsEventType) {
      case FinancialAccountsControlsEventType.FILTER_CHANGED:
        this.filter = event.payload.filter as string;
        return;
      case FinancialAccountsControlsEventType.CREATE_CLICKED:
        this.setSelectedAccount(EmptyFinancialAccount, true);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  @SkipIf('submitted')
  onFinancialAccountEditorEvent(event: EventInfo) {
    switch (event.type as FinancialAccountEditorEventType) {
      case FinancialAccountEditorEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedAccount(EmptyFinancialAccount);
        return;
      case FinancialAccountEditorEventType.CREATE_CLICKED:
        Assertion.assertValue(event.payload.projectUID, 'event.payload.projectUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.createFinancialAccount(event.payload.projectUID,
                                    event.payload.dataFields);
        return;
      case FinancialAccountEditorEventType.UPDATE_CLICKED:
        Assertion.assertValue(event.payload.projectUID, 'event.payload.projectUID');
        Assertion.assertValue(event.payload.accountUID, 'event.payload.accountUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.updateFinancialAccount(event.payload.projectUID,
                                    event.payload.accountUID,
                                    event.payload.dataFields);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  @SkipIf('submitted')
  onFinancialAccountsTableEvent(event: EventInfo) {
    switch (event.type as FinancialAccountsTableEventType) {
      case FinancialAccountsTableEventType.ACCOUNT_CLICKED:
        Assertion.assertValue(event.payload.account.projectUID, 'event.payload.account.projectUID');
        Assertion.assertValue(event.payload.account.uid, 'event.payload.account.uid');
        this.getFinancialAccount(event.payload.account.projectUID, event.payload.account.uid);
        return;
      case FinancialAccountsTableEventType.PROJECT_CLICKED:
        Assertion.assertValue(event.payload.account.projectUID, 'event.payload.account.projectUID');
        Assertion.assertValue(event.payload.account.uid, 'event.payload.account.uid');
        this.setSelectedProject(event.payload.account)
        return;
      case FinancialAccountsTableEventType.REMOVE_CLICKED:
        Assertion.assertValue(event.payload.account.uid, 'event.payload.account.uid');
        this.confirmRemoveFinancialAccount(event.payload.account as FinancialAccountDescriptor);
        return;
      case FinancialAccountsTableEventType.OPERATIONS_CLICKED:
        Assertion.assertValue(event.payload.account.uid, 'event.payload.account.uid');
        this.setSelectedOperation(event.payload.account)
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


  onOperationsEditionEvent(event: EventInfo) {
    switch (event.type as OperationsEditionEventType) {
      case OperationsEditionEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedOperation(EmptyFinancialAccountDescriptor);
        return;
      case OperationsEditionEventType.UPDATED:
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private getFinancialAccount(projectUID: string, accountUID: string) {
    this.submitted = true;

    this.projectsData.getProjectAccount(projectUID, accountUID)
      .firstValue()
      .then(x => this.setSelectedAccount(x))
      .finally(() => this.submitted = false);
  }


  private createFinancialAccount(projectUID: string, dataFields: FinancialAccountFields) {
    this.submitted = true;

    this.projectsData.createProjectAccount(projectUID, dataFields)
      .firstValue()
      .then(x => this.resolveAccountUpdated(projectUID))
      .finally(() => this.submitted = false);
  }


  private updateFinancialAccount(projectUID: string, accountUID: string, dataFields: FinancialAccountFields) {
    this.submitted = true;

    this.projectsData.updateProjectAccount(projectUID, accountUID, dataFields)
      .firstValue()
      .then(x => this.resolveAccountUpdated(projectUID))
      .finally(() => this.submitted = false);
  }


  private removeFinancialAccount(projectUID: string, accountUID: string) {
    this.submitted = true;

    this.projectsData.removeProjectAccount(projectUID, accountUID)
      .firstValue()
      .then(x => this.resolveAccountUpdated(projectUID))
      .finally(() => this.submitted = false);
  }


  private setSelectedAccount(data: FinancialAccount, display?: boolean) {
    this.createAccount = isEmpty(data) && display;
    this.selectedAccount = data;
    this.displayAccountEditor = display ?? !isEmpty(data);
  }


  private setSelectedProject(data: FinancialAccountDescriptor, display?: boolean) {
    this.selectedOperationData = { projectUID: data.projectUID, accountUID: data.uid, operationsUID: null };
    this.displayProjectEditor = display ?? !isEmpty(data);
  }


  private setSelectedOperation(data: FinancialAccountDescriptor, display?: boolean) {
    this.selectedOperationData = {projectUID: data.projectUID, accountUID: data.uid, operationsUID: null};
    this.displayOperations = display ?? !isEmpty(data);
  }


  private confirmRemoveFinancialAccount(account: FinancialAccountDescriptor) {
    const title = 'Eliminar cuenta';
    const message = this.getConfirmRemoveAccountMessage(account);

    this.messageBox.confirm(message, title, 'DeleteCancel')
      .firstValue()
      .then(x => x ? this.removeFinancialAccount(account.projectUID, account.uid) : null);
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
    sendEvent(this.financialAccountsEditionEvent, FinancialAccountsEditionEventType.UPDATED, payload);
    this.setSelectedAccount(EmptyFinancialAccount);
  }

}
