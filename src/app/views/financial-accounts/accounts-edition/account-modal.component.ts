/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyFinancialAccount, FinancialAccount } from '@app/models';

import { AccountHeaderEventType } from './account-header.component';


export enum AccountModalEventType {
  CLOSE_MODAL_CLICKED      = 'FinancialAccountModalComponent.Event.CloseModalClicked',
  CREATE_CLICKED           = 'FinancialAccountModalComponent.Event.CreateClicked',
  UPDATE_CLICKED           = 'FinancialAccountModalComponent.Event.UpdateClicked',
  CREATE_EXTERNAL_CLICKED  = 'FinancialAccountModalComponent.Event.CreateExternalClicked',
  REFRESH_EXTERNAL_CLICKED = 'FinancialAccountModalComponent.Event.RefreshExternalClicked',
}

@Component({
  selector: 'emp-cf-account-modal',
  templateUrl: './account-modal.component.html',
})
export class FinancialAccountModalComponent {

  @Input() projectUID = '';

  @Input() organizationalUnitUID = '';

  @Input() account: FinancialAccount = EmptyFinancialAccount;

  @Input() canUpdate = false;

  @Output() accountModalEvent = new EventEmitter<EventInfo>();


  get isSaved(): boolean {
    return !isEmpty(this.account);
  }


  get title(): string {
    if (!this.isSaved) return 'Agregar cuenta';

    return `${this.canUpdate ?
      'Editar cuenta' :
      'Cuenta'} - ${this.account.accountNo}`;
  }


  onCloseModalClicked() {
    sendEvent(this.accountModalEvent, AccountModalEventType.CLOSE_MODAL_CLICKED);
  }


  onAccountHeaderEvent(event: EventInfo) {
    switch (event.type as AccountHeaderEventType) {
      case AccountHeaderEventType.CREATE_CLICKED:
        Assertion.assertValue(event.payload.projectUID, 'event.payload.projectUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        sendEvent(this.accountModalEvent, AccountModalEventType.CREATE_CLICKED, event.payload);
        return;
      case AccountHeaderEventType.UPDATE_CLICKED:
        Assertion.assertValue(event.payload.projectUID, 'event.payload.projectUID');
        Assertion.assertValue(event.payload.accountUID, 'event.payload.accountUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        sendEvent(this.accountModalEvent, AccountModalEventType.UPDATE_CLICKED, event.payload);
        return;
      case AccountHeaderEventType.CREATE_EXTERNAL_CLICKED:
        Assertion.assertValue(event.payload.projectUID, 'event.payload.projectUID');
        Assertion.assertValue(event.payload.dataFields.attributes.externalCreditNo, 'event.payload.dataFields.attributes.externalCreditNo');
        sendEvent(this.accountModalEvent, AccountModalEventType.CREATE_EXTERNAL_CLICKED, event.payload);
        return;
      case AccountHeaderEventType.REFRESH_EXTERNAL_CLICKED:
        Assertion.assertValue(event.payload.accountUID, 'event.payload.accountUID');
        sendEvent(this.accountModalEvent, AccountModalEventType.REFRESH_EXTERNAL_CLICKED, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
