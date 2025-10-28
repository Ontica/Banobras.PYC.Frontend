/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { DateStringLibrary, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { StandardAccountHolder, EmptyStandardAccountHolder } from '@app/models';

import { StandardAccountViewEventType } from './standard-account-view.component';

import {
  AccountsEditionEventType
} from '@app/views/financial/accounts/accounts-edition/accounts-edition.component';


export enum StandardAccountTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'StandardAccountTabbedViewComponent.Event.CloseButtonClicked',
  DATA_UPDATED         = 'StandardAccountTabbedViewComponent.Event.DataUpdated',
  DATA_DELETED         = 'StandardAccountTabbedViewComponent.Event.DataDeleted',
  REFRESH_DATA         = 'StandardAccountTabbedViewComponent.Event.RefreshData',
}

@Component({
  selector: 'emp-financial-standard-account-tabbed-view',
  templateUrl: './standard-account-tabbed-view.component.html',
})
export class StandardAccountTabbedViewComponent implements OnChanges {

  @Input() data: StandardAccountHolder = EmptyStandardAccountHolder;

  @Output() standardAccountTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;


  ngOnChanges() {
    this.setTitle();
  }


  onCloseButtonClicked() {
    sendEvent(this.standardAccountTabbedViewEvent, StandardAccountTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onStandardAccountViewEvent(event: EventInfo) {
    switch (event.type as StandardAccountViewEventType) {

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onAccountsEditionEvent(event: EventInfo) {
    switch (event.type as AccountsEditionEventType) {

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    const startDate = DateStringLibrary.format(this.data.standardAccount.startDate);

    const status = this.data.standardAccount.status.name === 'Eliminada' ?
      `<span class="tag tag-error tag-small">${this.data.standardAccount.status.name}</span>` :
      `<span class="tag tag-small">${this.data.standardAccount.status.name}</span>`;

    this.title = `${this.data.standardAccount.number}: ${this.data.standardAccount.description} ${status}`;

    this.hint = `<strong>${this.data.standardAccount.type.name} &nbsp; &nbsp; | &nbsp; &nbsp; </strong>` +
      `${this.data.standardAccount.roleType.name} &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${this.data.standardAccount.debtorCreditorType.name} &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${startDate}`;
  }

}
