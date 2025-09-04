/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { FinancialAccountDescriptor } from '@app/models';


export enum AccountsListItemEventType {
  SELECT_CLICKED = 'FinancialAccountListItemComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-cf-accounts-list-item',
  templateUrl: './accounts-list-item.component.html',
  styleUrls: ['./accounts-list-item.component.scss'],
})
export class FinancialAccountListItemComponent {

  @Input() item: FinancialAccountDescriptor;

  @Input() selected = false;

  @Output() accountsListItemEvent = new EventEmitter<EventInfo>();


  onSelectClicked() {
    sendEvent(this.accountsListItemEvent, AccountsListItemEventType.SELECT_CLICKED, { item: this.item });
  }

}
