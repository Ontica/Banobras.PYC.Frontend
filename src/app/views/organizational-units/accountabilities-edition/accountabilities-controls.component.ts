/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

export enum AccountabilitiesControlsEventType {
  FILTER_CHANGED = 'AccountabilitiesControlsComponent.Event.FilterChanged',
  CREATE_CLICKED = 'AccountabilitiesControlsComponent.Event.CreateClicked',
}

@Component({
  selector: 'emp-ng-accountabilities-controls',
  templateUrl: './accountabilities-controls.component.html',
})
export class AccountabilitiesControlsComponent {

  @Input() filter = '';

  @Input() canEdit = false;

  @Output() accountabilitiesControlsEvent = new EventEmitter<EventInfo>();


  onFilterChanged() {
    sendEvent(this.accountabilitiesControlsEvent, AccountabilitiesControlsEventType.FILTER_CHANGED,
      { filter: this.filter });
  }


  onClearFilter() {
    this.filter = '';
    this.onFilterChanged();
  }


  onCreateClicked() {
    sendEvent(this.accountabilitiesControlsEvent, AccountabilitiesControlsEventType.CREATE_CLICKED);
  }

}
