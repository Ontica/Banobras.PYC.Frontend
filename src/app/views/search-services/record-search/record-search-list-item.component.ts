/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { RecordSearchResult } from '@app/models';

import { sendEvent } from '@app/shared/utils';

export enum RecordSearchListItemEventType {
  RECORD_CLICKED = 'RecordSearchListItemComponent.Event.RecordClicked',
}


@Component({
  selector: 'emp-pyc-record-search-list-item',
  templateUrl: './record-search-list-item.component.html',
})
export class RecordSearchListItemComponent {

  @Input() recordSearchType: string;

  @Input() record: RecordSearchResult;

  @Output() recordSearchListItemEvent = new EventEmitter<EventInfo>();


  onRecordClicked() {
    sendEvent(this.recordSearchListItemEvent,
      RecordSearchListItemEventType.RECORD_CLICKED, {record: this.record});
  }

}
