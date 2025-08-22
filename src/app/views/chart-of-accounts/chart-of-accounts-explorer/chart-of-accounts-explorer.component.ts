/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { PERMISSIONS } from '@app/main-layout';

import { sendEvent } from '@app/shared/utils';

import { ChartOfAccounts, ChartOfAccountsQuery, EmptyChartOfAccounts,
         EmptyChartOfAccountsQuery } from '@app/models';

import { ChartOfAccountsFilterEventType } from './chart-of-accounts-filter.component';

import { ChartOfAccountsListEventType } from './chart-of-accounts-list.component';


export enum ChartOfAccountsExplorerEventType {
  CREATE_CLICKED = 'ChartOfAccountsExplorerComponent.Event.CreateClicked',
  SEARCH_CLICKED = 'ChartOfAccountsExplorerComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'ChartOfAccountsExplorerComponent.Event.ClearClicked',
  EXPORT_CLICKED = 'ChartOfAccountsExplorerComponent.Event.ExportClicked',
  SELECT_CLICKED = 'ChartOfAccountsExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-cf-chart-of-accounts-explorer',
  templateUrl: './chart-of-accounts-explorer.component.html',
})
export class ChartOfAccountsExplorerComponent implements OnChanges {

  @Input() query: ChartOfAccountsQuery = Object.assign({}, EmptyChartOfAccountsQuery);

  @Input() data: ChartOfAccounts = EmptyChartOfAccounts;

  @Input() selectedUID = '';

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() chartOfAccountsExplorerEvent = new EventEmitter<EventInfo>();

  permissions = PERMISSIONS;

  cardTitle = 'Explorador de cuentas estandar';

  cardHint = 'Seleccionar los filtros';

  showFilters = false;

  PERMISSION_TO_CREATE = PERMISSIONS.NOT_REQUIRED;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.setText();
      this.showFilters = false;
    }
  }


  onCreateButtonClicked() {
    sendEvent(this.chartOfAccountsExplorerEvent, ChartOfAccountsExplorerEventType.CREATE_CLICKED);
  }


  onChartOfAccountsFilterEvent(event: EventInfo) {
    switch (event.type as ChartOfAccountsFilterEventType) {
      case ChartOfAccountsFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.chartOfAccountsExplorerEvent, ChartOfAccountsExplorerEventType.SEARCH_CLICKED,
          event.payload);
        return;
      case ChartOfAccountsFilterEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.chartOfAccountsExplorerEvent, ChartOfAccountsExplorerEventType.CLEAR_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onChartOfAccountsListEvent(event: EventInfo) {
    switch (event.type as ChartOfAccountsListEventType) {
      case ChartOfAccountsListEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, 'event.payload.item');
        sendEvent(this.chartOfAccountsExplorerEvent, ChartOfAccountsExplorerEventType.SELECT_CLICKED,
          event.payload);
        return;
      case ChartOfAccountsListEventType.EXPORT_CLICKED:
        sendEvent(this.chartOfAccountsExplorerEvent, ChartOfAccountsExplorerEventType.EXPORT_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setText() {
    if (!this.queryExecuted) {
      this.cardHint = 'Seleccionar los filtros';
      return;
    }

    this.cardHint = `${this.data.accounts.length} registros encontrados`;
  }

}
