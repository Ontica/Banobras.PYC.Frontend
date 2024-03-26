/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { EventInfo } from '@app/core';

import { EmptySubject, Subject } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';

export enum SubjectsTableEventType {
  SUBJECT_CLICKED = 'SubjectsTableComponent.Event.SubjectClicked',
}

@Component({
  selector: 'emp-ng-subjects-table',
  templateUrl: './subjects-table.component.html',
})
export class SubjectsTableComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() dataList: Subject[] = [];

  @Input() selected: Subject = EmptySubject;

  @Output() subjectsTableEvent = new EventEmitter<EventInfo>();

  displayedColumns: string[] = ['subject', 'workarea', 'email'];

  dataSource: TableVirtualScrollDataSource<Subject>;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.dataSource = new TableVirtualScrollDataSource(this.dataList);
      this.scrollToTop();
    }
  }


  onItemClicked(subject: Subject) {
    sendEvent(this.subjectsTableEvent, SubjectsTableEventType.SUBJECT_CLICKED, {item: subject});
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(-1);
    }
  }

}
