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

import { FinancialProjectDescriptor, FinancialProjectsOperationsList,
         isEntityStatusInWarning } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { ListControlsEventType } from '@app/views/_reports-controls/explorer/list-controls.component';


export enum ProjectsTableEventType {
  SELECT_CLICKED            = 'FinancialProjectsTableComponent.Event.SelectClicked',
  EXECUTE_OPERATION_CLICKED = 'FinancialProjectsTableComponent.Event.ExecuteOperationClicked',
}

@Component({
  selector: 'emp-cf-projects-table',
  templateUrl: './projects-table.component.html',
})
export class FinancialProjectsTableComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() dataList: FinancialProjectDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() queryExecuted = false;

  @Output() projectsTableEvent = new EventEmitter<EventInfo>();

  displayedColumns = ['check', 'project', 'manager', 'category', 'program', 'status'];

  dataSource: TableVirtualScrollDataSource<FinancialProjectDescriptor>;

  selection = new SelectionModel<FinancialProjectDescriptor>(true, []);

  operationsList = FinancialProjectsOperationsList;

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
        sendEvent(this.projectsTableEvent, ProjectsTableEventType.EXECUTE_OPERATION_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onSelectButtonClicked(item: FinancialProjectDescriptor) {
    sendEvent(this.projectsTableEvent, ProjectsTableEventType.SELECT_CLICKED, { item });
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
