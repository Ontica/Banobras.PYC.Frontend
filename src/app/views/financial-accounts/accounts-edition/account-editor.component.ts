/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo, isEmpty } from '@app/core';

import { EmptyFinancialAccount, FinancialAccount } from '@app/models';

import { AccountHeaderEventType } from './account-header.component';


export enum AccountEditorEventType {

}

@Component({
  selector: 'emp-financial-account-editor',
  templateUrl: './account-editor.component.html',
})
export class FinancialAccountEditorComponent {

  @Input() projectUID = '';

  @Input() organizationalUnitUID = '';

  @Input() account: FinancialAccount = EmptyFinancialAccount;

  @Input() canUpdate = false;

  @Output() accountEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  get isSaved(): boolean {
    return !isEmpty(this.account);
  }


  onAccountHeaderEvent(event: EventInfo) {
    switch (event.type as AccountHeaderEventType) {

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
