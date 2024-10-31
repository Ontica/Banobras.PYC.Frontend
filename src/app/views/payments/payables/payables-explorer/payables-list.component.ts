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

import { PayableDescriptor, PayablesOperationsList } from '@app/models';

import { ListControlsEventType } from '@app/views/_reports-controls/explorer/list-controls.component';

import { PayablesListItemEventType } from './payables-list-item.component';


export enum PayablesListEventType {
  SELECT_CLICKED            = 'PayablesListComponent.Event.SelectClicked',
  EXECUTE_OPERATION_CLICKED = 'PayablesListComponent.Event.ExecuteOperationClicked',
}

@Component({
  selector: 'emp-pmt-payables-list',
  templateUrl: './payables-list.component.html',
})
export class PayablesListComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() dataList: PayableDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() queryExecuted = false;

  @Output() payablesListEvent = new EventEmitter<EventInfo>();

  selection = new SelectionModel<PayableDescriptor>(true, []);

  operationsList = PayablesOperationsList;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.scrollToTop();
      this.selection.clear();
    }
  }


  onListControlsEvent(event: EventInfo) {
    switch (event.type as ListControlsEventType) {
      case ListControlsEventType.EXECUTE_OPERATION_CLICKED:
        sendEvent(this.payablesListEvent, PayablesListEventType.EXECUTE_OPERATION_CLICKED, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onPayablesListItemEvent(event: EventInfo) {
    switch (event.type as PayablesListItemEventType) {
      case PayablesListItemEventType.SELECT_CLICKED:
        sendEvent(this.payablesListEvent, PayablesListEventType.SELECT_CLICKED, event.payload);
        return;
      case PayablesListItemEventType.CHECK_CLICKED:
        Assertion.assertValue(event.payload.payable, 'event.payload.payable');
        this.selection.toggle(event.payload.payable);
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
