/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { buildExplorerHint, EmptyFinancialAccountsQuery, ExplorerDisplayedData, FinancialAccountDescriptor,
         FinancialAccountsQuery } from '@app/models';

import { AccountsFilterEventType } from './accounts-filter.component';

import { AccountsListEventType } from './accounts-list.component';


export enum AccountsExplorerEventType {
  SEARCH_CLICKED = 'FinancialAccountsExplorerComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'FinancialAccountsExplorerComponent.Event.ClearClicked',
  EXPORT_CLICKED = 'FinancialAccountsExplorerComponent.Event.ExportClicked',
  SELECT_CLICKED = 'FinancialAccountsExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-financial-accounts-explorer',
  templateUrl: './accounts-explorer.component.html',
})
export class FinancialAccountsExplorerComponent implements OnChanges {

  @Input() query: FinancialAccountsQuery = Object.assign({}, EmptyFinancialAccountsQuery);

  @Input() dataList: FinancialAccountDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() accountsExplorerEvent = new EventEmitter<EventInfo>();

  hint = 'Seleccionar los filtros';

  showFilters = false;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.setText();
      this.showFilters = false;
    }
  }


  onAccountsFilterEvent(event: EventInfo) {
    switch (event.type as AccountsFilterEventType) {
      case AccountsFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.accountsExplorerEvent, AccountsExplorerEventType.SEARCH_CLICKED,
          event.payload);
        return;
      case AccountsFilterEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.accountsExplorerEvent, AccountsExplorerEventType.CLEAR_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onAccountsListEvent(event: EventInfo) {
    switch (event.type as AccountsListEventType) {
      case AccountsListEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, 'event.payload.item');
        sendEvent(this.accountsExplorerEvent, AccountsExplorerEventType.SELECT_CLICKED,
          event.payload);
        return;
      case AccountsListEventType.EXPORT_CLICKED:
        sendEvent(this.accountsExplorerEvent, AccountsExplorerEventType.EXPORT_CLICKED,
          event.payload);
        return;
      case AccountsListEventType.DISPLAYED_DATA:
        Assertion.assertValue(event.payload.totalCount, 'event.payload.totalCount');
        Assertion.assertValue(event.payload.displayedCount, 'event.payload.displayedCount');
        this.setText(event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setText(displayedData: ExplorerDisplayedData = null) {
    const displayedMessage = displayedData && displayedData.displayedCount !== displayedData.totalCount ?
      `${displayedData.displayedCount} de ${displayedData.totalCount} registros encontrados` : null;

    this.hint = buildExplorerHint(this.queryExecuted, this.dataList.length, displayedMessage);
  }

}
