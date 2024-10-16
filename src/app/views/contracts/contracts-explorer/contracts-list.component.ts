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

import { ContractDescriptor, ContractsOperationsList } from '@app/models';

import { ListControlsEventType } from '@app/views/_reports-controls/explorer/list-controls.component';

import { ContractsListItemEventType } from './contracts-list-item.component';


export enum ContractsListEventType {
  SELECT_ITEM = 'ContractsListComponent.Event.SelectItem',
  EXECUTE_OPERATION = 'ContractsListComponent.Event.ExecuteOperation',
}

@Component({
  selector: 'emp-pmt-contracts-list',
  templateUrl: './contracts-list.component.html',
})
export class ContractsListComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() dataList: ContractDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() queryExecuted = false;

  @Output() contractsListEvent = new EventEmitter<EventInfo>();

  selection = new SelectionModel<ContractDescriptor>(true, []);

  operationsList = ContractsOperationsList;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.scrollToTop();
      this.selection.clear();
    }
  }


  onListControlsEvent(event: EventInfo) {
    switch (event.type as ListControlsEventType) {
      case ListControlsEventType.EXECUTE_OPERATION_CLICKED:
        sendEvent(this.contractsListEvent, ContractsListEventType.EXECUTE_OPERATION, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onContractsListItemEvent(event: EventInfo) {
    switch (event.type as ContractsListItemEventType) {
      case ContractsListItemEventType.ITEM_CLICKED:
        sendEvent(this.contractsListEvent, ContractsListEventType.SELECT_ITEM,
          event.payload);
        return;

      case ContractsListItemEventType.CHECK_CLICKED:
        Assertion.assertValue(event.payload.item, 'event.payload.item');
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
