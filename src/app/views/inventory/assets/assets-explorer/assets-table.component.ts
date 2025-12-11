/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';

import { EventInfo } from '@app/core';

import { AssetDescriptor } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { ListControlsEventType } from '@app/views/_reports-controls/explorer/list-controls.component';


export enum AssetsTableEventType {
  SELECT_CLICKED      = 'AssetsTableComponent.Event.SelectClicked',
  EXPORT_DATA_CLICKED = 'AssetsTableComponent.Event.ExportDataClicked',
}

@Component({
  selector: 'emp-inv-assets-table',
  templateUrl: './assets-table.component.html',
})
export class AssetsTableComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() dataList: AssetDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() queryExecuted = false;

  @Output() assetsTableEvent = new EventEmitter<EventInfo>();

  displayedColumns = ['asset', 'location', 'assignedTo'];

  dataSource: TableVirtualScrollDataSource<AssetDescriptor>;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.setDataSource();
      this.scrollToTop();
    }
  }


  onListControlsEvent(event: EventInfo) {
    switch (event.type as ListControlsEventType) {
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


  private setDataSource() {
    this.dataSource = new TableVirtualScrollDataSource(this.dataList);
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(-1);
    }
  }

}
