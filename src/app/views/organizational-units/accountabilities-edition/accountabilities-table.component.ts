/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { AccountabilityDescriptor } from '@app/models';


export enum AccountabilitiesTableEventType {
  ITEM_CLICKED   = 'AccountabilitiesTableComponent.Event.ItemClicked',
  REMOVE_CLICKED = 'AccountabilitiesTableComponent.Event.RemoveClicked',
}

@Component({
  selector: 'emp-ng-accountabilities-table',
  templateUrl: './accountabilities-table.component.html',
})
export class AccountabilitiesTableComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() data: AccountabilityDescriptor[] = [];

  @Input() filter = '';

  @Input() canEdit = false;

  @Output() accountabilitiesTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault = ['roleName', 'responsibleName', 'startDate', 'endDate'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: TableVirtualScrollDataSource<AccountabilityDescriptor>;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.setDataTable();
      this.scrollToTop();
    }

    if (changes.filter) {
      this.applyFilter(this.filter);
    }
  }


  onSelectClicked(item: AccountabilityDescriptor) {
    if (window.getSelection().toString().length <= 0) {
      sendEvent(this.accountabilitiesTableEvent, AccountabilitiesTableEventType.ITEM_CLICKED,
        { item });
    }
  }


  onRemoveClicked(item: AccountabilityDescriptor) {
    sendEvent(this.accountabilitiesTableEvent, AccountabilitiesTableEventType.REMOVE_CLICKED,
      { item });
  }


  private setDataTable() {
    this.resetColumns();
    this.dataSource = new TableVirtualScrollDataSource(this.data);
  }


  private resetColumns() {
    this.displayedColumns = this.canEdit ?
      [...this.displayedColumnsDefault, 'actionDelete'] :
      [...this.displayedColumnsDefault];
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(-1);
    }
  }


  private applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }

}
