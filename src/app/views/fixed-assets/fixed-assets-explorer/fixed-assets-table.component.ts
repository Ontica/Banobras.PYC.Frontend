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

import { FixedAssetDescriptor, FixedAssetsOperationsList, isEntityStatusInWarning } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { ListControlsEventType } from '@app/views/_reports-controls/explorer/list-controls.component';


export enum FixedAssetsTableEventType {
  SELECT_CLICKED            = 'FixedAssetsTableComponent.Event.SelectClicked',
  EXECUTE_OPERATION_CLICKED = 'FixedAssetsTableComponent.Event.ExecuteOperationClicked',
}

@Component({
  selector: 'emp-pyc-fixed-assets-table',
  templateUrl: './fixed-assets-table.component.html',
})
export class FixedAssetsTableComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() dataList: FixedAssetDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() displayControls = true;

  @Input() displayAssetKeeper = true;

  @Input() queryExecuted = false;

  @Output() fixedAssetsTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['inventoryNo', 'name', 'locationName']; // 'type',

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: TableVirtualScrollDataSource<FixedAssetDescriptor>;

  selection = new SelectionModel<FixedAssetDescriptor>(true, []);

  operationsList = FixedAssetsOperationsList;

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
        sendEvent(this.fixedAssetsTableEvent, FixedAssetsTableEventType.EXECUTE_OPERATION_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onRowClicked(item: FixedAssetDescriptor) {
    sendEvent(this.fixedAssetsTableEvent, FixedAssetsTableEventType.SELECT_CLICKED, { item });
  }


  private clearSelection() {
    this.selection.clear();
  }


  private setDataSource() {
    this.dataSource = new TableVirtualScrollDataSource(this.dataList);
    this.resetColumns();
  }


  private resetColumns() {
    let columns: string[] = [];

    if (this.displayControls) columns.push('check');
    columns = [...columns, ...this.displayedColumnsDefault];
    if (this.displayAssetKeeper) columns = [...columns, ...['assetKeeper', 'assetKeeperOrgUnit']];

    this.displayedColumns = columns;
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(-1);
    }
  }

}
