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

import { AssetDescriptor, AssetsOperationsList, isEntityStatusInWarning } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { ListControlsEventType } from '@app/views/_reports-controls/explorer/list-controls.component';


export enum AssetsTableEventType {
  SELECT_CLICKED            = 'AssetsTableComponent.Event.SelectClicked',
  EXECUTE_OPERATION_CLICKED = 'AssetsTableComponent.Event.ExecuteOperationClicked',
  EXPORT_DATA_CLICKED       = 'AssetsTableComponent.Event.ExportDataClicked',
}

@Component({
  selector: 'emp-pyc-assets-table',
  templateUrl: './assets-table.component.html',
})
export class AssetsTableComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() dataList: AssetDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() queryExecuted = false;

  @Input() displayAssignmentData = true;

  @Output() assetsTableEvent = new EventEmitter<EventInfo>();

  displayedColumns = ['check', 'assetNo', 'name', 'locationName', 'assignedTo', 'assignedToOrgUnit'];

  dataSource: TableVirtualScrollDataSource<AssetDescriptor>;

  selection = new SelectionModel<AssetDescriptor>(true, []);

  operationsList = AssetsOperationsList;

  isEntityStatusInWarning = isEntityStatusInWarning;


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
        sendEvent(this.assetsTableEvent, AssetsTableEventType.EXECUTE_OPERATION_CLICKED,
          event.payload);
        return;
      case ListControlsEventType.EXPORT_BUTTON_CLICKED:
        sendEvent(this.assetsTableEvent, AssetsTableEventType.EXPORT_DATA_CLICKED);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onSelectButtonClicked(item: AssetDescriptor) {
    sendEvent(this.assetsTableEvent, AssetsTableEventType.SELECT_CLICKED, { item });
  }


  private clearSelection() {
    this.selection.clear();
  }


  private setDataSource() {
    this.dataSource = new TableVirtualScrollDataSource(this.dataList);

    this.displayedColumns = this.displayAssignmentData ?
      ['check', 'assetNo', 'name', 'locationName', 'assignedTo', 'assignedToOrgUnit'] :
      ['assetNo', 'name'];
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(-1);
    }
  }

}
