/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { SkipIf } from '@app/shared/decorators';

import { FinancialProject, EmptyFinancialProject, FinancialProjectAccountDescriptor } from '@app/models';

import { ProjectAccountsTableEventType } from './project-accounts-table.component';


export enum ProjectAccountsEditionEventType {
  UPDATED = 'FinancialProjectAccountsEditionComponent.Event.Updated',
}

@Component({
  selector: 'emp-cf-project-accounts-edition',
  templateUrl: './project-accounts-edition.component.html',
})
export class FinancialProjectAccountsEditionComponent {

  @Input() project: FinancialProject = EmptyFinancialProject;

  @Input() accounts: FinancialProjectAccountDescriptor[] = [];

  @Input() canEdit = false;

  @Output() projectAccountsEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private messageBox: MessageBoxService) { }


  onAddProjectAccountButtonClicked() {
    this.messageBox.showInDevelopment('Agregar cuenta');
  }


  @SkipIf('submitted')
  onProjectAccountsTableEvent(event: EventInfo) {
    switch (event.type as ProjectAccountsTableEventType) {
      case ProjectAccountsTableEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.account.uid, 'event.payload.account.uid');

        return;
      case ProjectAccountsTableEventType.REMOVE_CLICKED:
        Assertion.assertValue(event.payload.account.uid, 'event.payload.account.uid');
        this.confirmRemoveProjectAccount(event.payload.account as FinancialProjectAccountDescriptor);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private confirmRemoveProjectAccount(account: FinancialProjectAccountDescriptor) {
    const title = 'Eliminar cuenta';
    const message = this.getConfirmRemoveAccountMessage(account);

    this.messageBox.confirm(message, title, 'DeleteCancel')
      .firstValue()
      .then(x => x ? this.removeProjectAccount(account) : null);
  }


  private getConfirmRemoveAccountMessage(account: FinancialProjectAccountDescriptor): string {
    return `
      <table class='confirm-data'>
        <tr><td class='nowrap'>No. cuenta: </td><td><strong>${account.accountNo}</strong></td></tr>
        <tr><td class='nowrap'>Área: </td><td><strong>${account.organizationalUnitName}</strong></td></tr>
        <tr><td class='nowrap'>Descripción: </td><td><strong>${account.description}</strong></td></tr>
      </table>
      <br>¿Elimino la cuenta?`;
  }


  private removeProjectAccount(account: FinancialProjectAccountDescriptor) {
    this.messageBox.showInDevelopment('Eliminar cuenta', account);
  }

}
