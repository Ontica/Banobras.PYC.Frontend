/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { CashFlowProjectionDescriptor, CashFlowProjectionsOperationsList } from '@app/models';

import { ListControlsEventType } from '@app/views/_reports-controls/explorer/list-controls.component';

import { ProjectionsListItemEventType } from './projections-list-item.component';

export enum ProjectionsListEventType {
  SELECT_CLICKED            = 'CashFlowProjectionsListComponent.Event.SelectClicked',
  EXECUTE_OPERATION_CLICKED = 'CashFlowProjectionsListComponent.Event.ExecuteOperationClicked',
}

@Component({
  selector: 'emp-cf-projections-list',
  templateUrl: './projections-list.component.html',
})
export class CashFlowProjectionsListComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() dataList: CashFlowProjectionDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() queryExecuted = false;

  @Input() displayControls = true;

  @Output() projectionsListEvent = new EventEmitter<EventInfo>();

  selection = new SelectionModel<CashFlowProjectionDescriptor>(true, []);

  operationsList = CashFlowProjectionsOperationsList;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.scrollToTop();
      this.selection.clear();
    }
  }


  onListControlsEvent(event: EventInfo) {
    switch (event.type as ListControlsEventType) {
      case ListControlsEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        Assertion.assertValue(event.payload.command, 'event.payload.command');
        sendEvent(this.projectionsListEvent, ProjectionsListEventType.EXECUTE_OPERATION_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onProjectionsListItemEvent(event: EventInfo) {
    switch (event.type as ProjectionsListItemEventType) {
      case ProjectionsListItemEventType.SELECT_CLICKED:
        sendEvent(this.projectionsListEvent, ProjectionsListEventType.SELECT_CLICKED, event.payload);
        return;
      case ProjectionsListItemEventType.CHECK_CLICKED:
        Assertion.assertValue(event.payload.item, 'event.payload.projection');
        this.selection.toggle(event.payload.item);
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
