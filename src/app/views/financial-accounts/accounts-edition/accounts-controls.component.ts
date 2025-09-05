/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

export enum AccountsControlsEventType {
  FILTER_CHANGED = 'FinancialAccountsControlsComponent.Event.FilterChanged',
  CREATE_CLICKED = 'FinancialAccountsControlsComponent.Event.CreateClicked',
}

@Component({
  selector: 'emp-cf-accounts-controls',
  templateUrl: './accounts-controls.component.html',
})
export class FinancialAccountsControlsComponent {

  @Input() filter = '';

  @Input() canEdit = false;

  @Output() accountsControlsEvent = new EventEmitter<EventInfo>();


  onFilterChanged() {
    sendEvent(this.accountsControlsEvent, AccountsControlsEventType.FILTER_CHANGED,
      { filter: this.filter });
  }


  onClearFilter() {
    this.filter = '';
    this.onFilterChanged();
  }


  onCreateClicked() {
    sendEvent(this.accountsControlsEvent, AccountsControlsEventType.CREATE_CLICKED);
  }

}
