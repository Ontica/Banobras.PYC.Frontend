/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { CashFlowProjectionEntryDescriptor, TotalItemTypeList } from '@app/models';


export enum ProjectionEntriesTableEventType {
  SELECT_ENTRY_CLICKED = 'CashFlowProjectionEntriesTableComponent.Event.SelectEntryClicked',
  REMOVE_ENTRY_CLICKED = 'CashFlowProjectionEntriesTableComponent.Event.RemoveEntryClicked',
}

@Component({
  selector: 'emp-cf-projection-entries-table',
  templateUrl: './projection-entries-table.component.html',
})
export class CashFlowProjectionEntriesTableComponent implements OnChanges {

  @Input() entries: CashFlowProjectionEntryDescriptor[] = [];

  @Input() filter = '';

  @Input() canDelete = false;

  @Output() projectionEntriesTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['cashFlowAccount', 'year', 'monthName', 'projectionColumn',
    'inflowAmount', 'outflowAmount'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<CashFlowProjectionEntryDescriptor>;

  totalItemTypeList = TotalItemTypeList;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.entries) {
      this.setDataTable();
    }

    if (changes.filter) {
      this.applyFilter(this.filter);
    }
  }


  onSelectEntryClicked(entry: CashFlowProjectionEntryDescriptor) {
    if (window.getSelection().toString().length <= 0 && !TotalItemTypeList.includes(entry.itemType)) {
      sendEvent(this.projectionEntriesTableEvent, ProjectionEntriesTableEventType.SELECT_ENTRY_CLICKED,
        { entry });
    }
  }


  onRemoveEntryClicked(entry: CashFlowProjectionEntryDescriptor) {
    sendEvent(this.projectionEntriesTableEvent, ProjectionEntriesTableEventType.REMOVE_ENTRY_CLICKED,
      { entry });
  }


  private setDataTable() {
    this.resetColumns();
    this.dataSource = new MatTableDataSource(this.entries);
  }


  private resetColumns() {
    this.displayedColumns = this.canDelete ?
      [...this.displayedColumnsDefault, 'actionDelete'] :
      [...this.displayedColumnsDefault];
  }


  private applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }

}
