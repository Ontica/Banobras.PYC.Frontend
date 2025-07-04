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

import { AssetsAssignmentDescriptor, AssetsAssignmentsOperationsList } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { ListControlsEventType } from '@app/views/_reports-controls/explorer/list-controls.component';


export enum AssetsAssignmentTableEventType {
  SELECT_CLICKED            = 'AssetsAssignmentTableComponent.Event.SelectClicked',
  EXECUTE_OPERATION_CLICKED = 'AssetsAssignmentTableComponent.Event.ExecuteOperationClicked',
  EXPORT_DATA_CLICKED       = 'AssetsAssignmentTableComponent.Event.ExportDataClicked',
}

@Component({
  selector: 'emp-pyc-assignments-table',
  templateUrl: './assignments-table.component.html',
})
export class AssetsAssignmentTableComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() dataList: AssetsAssignmentDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() queryExecuted = false;

  @Output() assetsAssignmentTableEvent = new EventEmitter<EventInfo>();

  displayedColumns = ['check', 'assignedToName', 'assignedToOrgUnitName', 'locationName'];

  dataSource: TableVirtualScrollDataSource<AssetsAssignmentDescriptor>;

  selection = new SelectionModel<AssetsAssignmentDescriptor>(true, []);

  operationsList = AssetsAssignmentsOperationsList;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.clearSelection();
      this.setDataSource();
      this.scrollToTop();
    }
  }


  onListControlsEvent(event: EventInfo) {
    switch (event.type as ListControlsEventType) {
      case ListControlsEventType.EXECUTE_OPERATION_CLICKED:
        sendEvent(this.assetsAssignmentTableEvent, AssetsAssignmentTableEventType.EXECUTE_OPERATION_CLICKED,
          event.payload);
        return;
      case ListControlsEventType.EXPORT_BUTTON_CLICKED:
        sendEvent(this.assetsAssignmentTableEvent, AssetsAssignmentTableEventType.EXPORT_DATA_CLICKED);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onSelectButtonClicked(item: AssetsAssignmentDescriptor) {
    sendEvent(this.assetsAssignmentTableEvent, AssetsAssignmentTableEventType.SELECT_CLICKED, { item });
  }


  private clearSelection() {
    this.selection.clear();
  }


  private setDataSource() {
    this.dataSource = new TableVirtualScrollDataSource(this.dataList);
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(-1);
    }
  }

}
