/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { SelectionModel } from '@angular/cdk/collections';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';

import { EventInfo } from '@app/core';

import { ProvisionDescriptor, ProvisionsOperationsList, ObjectTypes, ProvisionQueryTypes,
         ProvisionsOperationType, } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { ListControlsEventType } from '@app/views/_reports-controls/explorer/list-controls.component';


export enum ProvisionsDataEventType {
  SELECT_CLICKED            = 'ProvisionsDataComponent.Event.SelectClicked',
  EXECUTE_OPERATION_CLICKED = 'ProvisionsDataComponent.Event.ExecuteOperationClicked',
}

@Component({
  selector: 'emp-ng-provisions-data',
  templateUrl: './provisions-data.component.html',
})
export class ProvisionsDataComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() queryType: ProvisionQueryTypes = ProvisionQueryTypes.All;

  @Input() dataList: ProvisionDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() queryExecuted = false;

  @Output() provisionsDataEvent = new EventEmitter<EventInfo>();

  displayedColumns: string[] = ['check', 'order', 'especif', 'description', 'status'];

  dataSource: TableVirtualScrollDataSource<ProvisionDescriptor>;

  selection = new SelectionModel<ProvisionDescriptor>(true, []);

  operationsList = ProvisionsOperationsList;

  OrderType = ObjectTypes;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.clearSelection();
      this.setDataSource();
      this.scrollToTop();
    }

    if (changes.queryType) {
      this.setOperationsList();
    }
  }


  onListControlsEvent(event: EventInfo) {
    switch (event.type as ListControlsEventType) {
      case ListControlsEventType.EXECUTE_OPERATION_CLICKED:
        sendEvent(this.provisionsDataEvent, ProvisionsDataEventType.EXECUTE_OPERATION_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onItemClicked(item: ProvisionDescriptor) {
    sendEvent(this.provisionsDataEvent, ProvisionsDataEventType.SELECT_CLICKED, { item });
  }


  private clearSelection() {
    this.selection.clear();
  }


  private setDataSource() {
    this.dataSource = new TableVirtualScrollDataSource(this.dataList);
  }


  private setOperationsList() {
    let valids = [];

    switch (this.queryType) {
      case ProvisionQueryTypes.Procurement:
        valids = [ProvisionsOperationType.provision, ProvisionsOperationType.deprovision,];
        this.operationsList =
          [...ProvisionsOperationsList.filter(x => valids.includes(x.uid as ProvisionsOperationType))];
        return;
      case ProvisionQueryTypes.Budget:
        valids = [ProvisionsOperationType.reject, ProvisionsOperationType.accept];
        this.operationsList =
          [...ProvisionsOperationsList.filter(x => valids.includes(x.uid as ProvisionsOperationType))];
        return;
      case ProvisionQueryTypes.All:
      default:
        this.operationsList = [...ProvisionsOperationsList];
        return;
    }
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(-1);
    }
  }

}
