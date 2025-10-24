/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output,
         SimpleChanges, ViewChild } from '@angular/core';

import { EventInfo, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { ChartOfAccounts, EmptyChartOfAccounts } from '@app/models';

import { ListControlsEventType } from '@app/views/_reports-controls/explorer/list-controls.component';

import { ChartOfAccountsListItemEventType } from './chart-of-accounts-list-item.component';


export enum ChartOfAccountsListEventType {
  SELECT_CLICKED            = 'ChartOfAccountsList.Event.SelectClicked',
  EXPORT_CLICKED            = 'ChartOfAccountsList.Event.ExportClicked',
  EXECUTE_OPERATION_CLICKED = 'ChartOfAccountsList.Event.ExecuteOperationClicked',
}

@Component({
  selector: 'emp-financial-chart-of-accounts-list',
  templateUrl: './chart-of-accounts-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartOfAccountsListComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() data: ChartOfAccounts = EmptyChartOfAccounts;

  @Input() selectedUID = '';

  @Input() queryExecuted = false;

  @Output() chartOfAccountsListEvent = new EventEmitter<EventInfo>();

  maxLevel = 6;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.scrollToTop()
      this.setMaxLevel()
    }
  }


  onListControlsEvent(event: EventInfo) {
    switch (event.type as ListControlsEventType) {
      case ListControlsEventType.EXPORT_BUTTON_CLICKED:
        sendEvent(this.chartOfAccountsListEvent, ChartOfAccountsListEventType.EXPORT_CLICKED);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onChartOfAccountsListItemEvent(event: EventInfo) {
    switch (event.type as ChartOfAccountsListItemEventType) {
      case ChartOfAccountsListItemEventType.SELECT_CLICKED:
        sendEvent(this.chartOfAccountsListEvent, ChartOfAccountsListEventType.SELECT_CLICKED, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setMaxLevel() {
    if (!isEmpty(this.data) && this.data.accounts.length > 0) {
      this.maxLevel = this.data.accounts
        .reduce((prev, current) => (prev.level > current.level) ? prev : current).level;
    }
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(0);
    }
  }

}
