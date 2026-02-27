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

import { BillDescriptor } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { ListControlsEventType } from '@app/views/_reports-controls/explorer/list-controls.component';


export enum BillsTableEventType {
  SELECT_CLICKED = 'BillsTableComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-ng-bills-table',
  templateUrl: './bills-table.component.html',
})
export class BillsTableComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() dataList: BillDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() queryExecuted = false;

  @Input() isLoading = false;

  @Output() billsTableEvent = new EventEmitter<EventInfo>();

  displayedColumns = ['bill', 'baseEntity', 'issued', 'status'];

  dataSource: TableVirtualScrollDataSource<BillDescriptor>;

  filter = '';


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.setFilter('');
      this.setDataSource();
      this.scrollToTop();
    }
  }


  onListControlsEvent(event: EventInfo) {
    switch (event.type as ListControlsEventType) {
      case ListControlsEventType.FILTER_CHANGED:
        this.setFilter(event.payload.filter);
        this.applyFilter(this.filter);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onSelectButtonClicked(item: BillDescriptor) {
    sendEvent(this.billsTableEvent, BillsTableEventType.SELECT_CLICKED, { item });
  }


  private setDataSource() {
    this.dataSource = new TableVirtualScrollDataSource(this.dataList);
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(-1);
    }
  }


  private setFilter(filter: string) {
    this.filter = filter ?? '';
  }


  private applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }

}
