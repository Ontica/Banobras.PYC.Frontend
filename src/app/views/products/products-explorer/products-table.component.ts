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

import { isStatusInWarning, ProductDescriptor, ProductsOperationsList } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { ListControlsEventType } from '@app/views/_reports-controls/explorer/list-controls.component';


export enum ProductsTableEventType {
  SELECT_CLICKED            = 'ProductsTableComponent.Event.SelectClicked',
  EXECUTE_OPERATION_CLICKED = 'ProductsTableComponent.Event.ExecuteOperationClicked',
}

@Component({
  selector: 'emp-ng-products-table',
  templateUrl: './products-table.component.html',
})
export class ProductsTableComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() dataList: ProductDescriptor[] = [];

  @Input() queryExecuted = false;

  @Output() productsTableEvent = new EventEmitter<EventInfo>();

  displayedColumns: string[] = ['check', 'product', 'type', 'manager', 'description', 'status'];

  dataSource: TableVirtualScrollDataSource<ProductDescriptor>;

  selection = new SelectionModel<ProductDescriptor>(true, []);

  operationsList = ProductsOperationsList;

  isStatusInWarning = isStatusInWarning;


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
        sendEvent(this.productsTableEvent, ProductsTableEventType.EXECUTE_OPERATION_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
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
