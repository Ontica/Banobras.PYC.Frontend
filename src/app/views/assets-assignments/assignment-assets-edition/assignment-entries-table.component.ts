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

import { AssetsTransactionEntry, AssetsOperationsList, isEntityStatusInWarning } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { ListControlsEventType } from '@app/views/_reports-controls/explorer/list-controls.component';


export enum AssignmentEntriesTableEventType {
  SELECT_CLICKED            = 'AssetsAssignmentEntriesTableComponent.Event.SelectClicked',
  EXECUTE_OPERATION_CLICKED = 'AssetsAssignmentEntriesTableComponent.Event.ExecuteOperationClicked',
}

@Component({
  selector: 'emp-inv-assignment-entries-table',
  templateUrl: './assignment-entries-table.component.html',
})
export class AssetsAssignmentEntriesTableComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() entries: AssetsTransactionEntry[] = [];

  @Input() displayOperations = false;

  @Output() assignmentEntriesTableEvent = new EventEmitter<EventInfo>();

  displayedColumns = ['check', 'assetNo', 'name', 'previousCondition', 'releasedCondition'];

  dataSource: TableVirtualScrollDataSource<AssetsTransactionEntry>;

  selection = new SelectionModel<AssetsTransactionEntry>(true, []);

  operationsList = AssetsOperationsList;

  isEntityStatusInWarning = isEntityStatusInWarning;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.entries) {
      this.clearSelection();
      this.setDataSource();
      this.scrollToTop();
    }
  }


  get displayControls(): boolean {
    return (this.displayOperations && this.selection.selected.length > 0);
  }


  onListControlsEvent(event: EventInfo) {
    switch (event.type as ListControlsEventType) {
      case ListControlsEventType.EXECUTE_OPERATION_CLICKED:
        sendEvent(this.assignmentEntriesTableEvent, AssignmentEntriesTableEventType.EXECUTE_OPERATION_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onSelectButtonClicked(entry: AssetsTransactionEntry) {
    sendEvent(this.assignmentEntriesTableEvent, AssignmentEntriesTableEventType.SELECT_CLICKED, { entry });
  }


  private clearSelection() {
    this.selection.clear();
  }


  private setDataSource() {
    this.dataSource = new TableVirtualScrollDataSource(this.entries);

    let columns = this.displayOperations ? ['check', 'assetNo', 'name', 'previousCondition', 'releasedCondition'] :
      ['assetNo', 'name', 'previousCondition', 'releasedCondition'];

    this.displayedColumns = columns;
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(-1);
    }
  }

}
