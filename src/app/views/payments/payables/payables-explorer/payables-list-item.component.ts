/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { PayableDescriptor } from '@app/models';


export enum PayablesListItemEventType {
  SELECT_CLICKED = 'PayablesListItemComponent.Event.SelectClicked',
  CHECK_CLICKED  = 'PayablesListItemComponent.Event.CheckClicked',
}

@Component({
  selector: 'emp-pmt-payables-list-item',
  templateUrl: './payables-list-item.component.html',
  styleUrls: ['./payables-list-item.component.scss'],
})
export class PayablesListItemComponent {

  @Input() payable: PayableDescriptor;

  @Input() selected = false;

  @Output() payablesListItemEvent = new EventEmitter<EventInfo>();


  onSelectClicked() {
    sendEvent(this.payablesListItemEvent, PayablesListItemEventType.SELECT_CLICKED,
      { payable: this.payable });
  }


  onCheckClicked() {
    sendEvent(this.payablesListItemEvent, PayablesListItemEventType.CHECK_CLICKED,
      { payable: this.payable });
  }

}
