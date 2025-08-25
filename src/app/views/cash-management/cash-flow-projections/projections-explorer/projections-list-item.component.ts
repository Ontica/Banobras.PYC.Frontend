/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { CashFlowProjectionDescriptor } from '@app/models';


export enum ProjectionsListItemEventType {
  SELECT_CLICKED = 'CashFlowProjectionsListItemComponent.Event.SelectClicked',
  CHECK_CLICKED  = 'CashFlowProjectionsListItemComponent.Event.CheckClicked',
}

@Component({
  selector: 'emp-cf-projections-list-item',
  templateUrl: './projections-list-item.component.html',
  styleUrls: ['./projections-list-item.component.scss'],
})
export class CashFlowProjectionsListItemComponent {

  @Input() item: CashFlowProjectionDescriptor;

  @Input() selected = false;

  @Input() displayControls = true;

  @Output() projectionsListItemEvent = new EventEmitter<EventInfo>();


  onSelectClicked() {
    sendEvent(this.projectionsListItemEvent, ProjectionsListItemEventType.SELECT_CLICKED,
      { item: this.item });
  }


  onCheckClicked() {
    sendEvent(this.projectionsListItemEvent, ProjectionsListItemEventType.CHECK_CLICKED,
      { item: this.item });
  }

}
