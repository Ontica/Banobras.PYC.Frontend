/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { RecordSearchResult } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { RecordSearchListItemEventType } from './record-search-list-item.component';

export enum RecordSearchListEventType {
  SELECT_RECORD = 'RecordSearchListComponent.Event.SelectRecord',
}

@Component({
  selector: 'emp-pyc-record-search-list',
  templateUrl: './record-search-list.component.html',
})
export class RecordSearchListComponent {

  @Input() recordsList: RecordSearchResult[] = [];

  @Input() recordSearchType: string;

  @Input() queryExecuted = false;

  @Input() isLoading = false;

  @Output() recordSearchListEvent = new EventEmitter<EventInfo>();


  onRecordSearchListItemEvent(event: EventInfo) {
    switch (event.type as RecordSearchListItemEventType) {
      case RecordSearchListItemEventType.RECORD_CLICKED:
        Assertion.assertValue(event.payload.record, 'event.payload.record');
        sendEvent(this.recordSearchListEvent, RecordSearchListEventType.SELECT_RECORD, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
