/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { SelectionModel } from '@angular/cdk/collections';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyRequestDescriptor, RequestDescriptor } from '@app/models';

import { RequestsListControlsEventType } from './requests-list-controls.component';

import { RequestsListItemEventType } from './requests-list-item.component';

export enum RequestsListEventType {
  ITEM_CLICKED              = 'RequestsListComponent.Event.ItemClicked',
  EXECUTE_OPERATION_CLICKED = 'RequestsListComponent.Event.ExecuteOperationClicked',
}

@Component({
  selector: 'emp-pyc-requests-list',
  templateUrl: './requests-list.component.html',
})
export class RequestsListComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() requestsData: RequestDescriptor[] = [];

  @Input() selectedRequest: RequestDescriptor = EmptyRequestDescriptor;

  @Input() queryExecuted = false;

  @Output() requestsListEvent = new EventEmitter<EventInfo>();

  selection = new SelectionModel<RequestDescriptor>(true, []);


  ngOnChanges(changes: SimpleChanges) {
    if (changes.requestsData) {
      this.scrollToTop();
      this.selection.clear();
    }
  }


  isSelected(request: RequestDescriptor) {
    return (this.selectedRequest.uid === request.uid);
  }


  onRequestsListControlsEvent(event: EventInfo) {
    switch (event.type as RequestsListControlsEventType) {
      case RequestsListControlsEventType.EXECUTE_OPERATION_CLICKED:
        sendEvent(this.requestsListEvent, RequestsListEventType.EXECUTE_OPERATION_CLICKED,
          event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onRequestsListItemEvent(event: EventInfo) {
    switch (event.type as RequestsListItemEventType) {
      case RequestsListItemEventType.ITEM_CLICKED:
        sendEvent(this.requestsListEvent, RequestsListEventType.ITEM_CLICKED,
          event.payload);
        return;

      case RequestsListItemEventType.CHECK_CLICKED:
        Assertion.assertValue(event.payload.request, 'event.payload.request');
        this.selection.toggle(event.payload.request);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(0);
    }
  }

}
