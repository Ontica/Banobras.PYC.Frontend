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

import { FinancialRulesQuery, EmptyFinancialRulesQuery, FinancialRulesData,
         EmptyFinancialRulesData } from '@app/models';

import { DataTableEventType } from '@app/views/_reports-controls/data-table/data-table.component';

import { FinancialRulesFilterEventType } from './rules-filter.component';


export enum FinancialRulesExplorerEventType {
  CREATE_CLICKED = 'FinancialRulesExplorerComponent.Event.CreateClicked',
  SEARCH_CLICKED = 'FinancialRulesExplorerComponent.Event.SearchClicked',
  EXPORT_CLICKED = 'FinancialRulesExplorerComponent.Event.ExportClicked',
  SELECT_CLICKED = 'FinancialRulesExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-financial-rules-explorer',
  templateUrl: './rules-explorer.component.html',
})
export class FinancialRulesExplorerComponent implements OnChanges {

  @Input() query: FinancialRulesQuery = Object.assign({}, EmptyFinancialRulesQuery);

  @Input() data: FinancialRulesData = Object.assign({}, EmptyFinancialRulesData);

  @Input() selectedUID = '';

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() rulesExplorerEvent = new EventEmitter<EventInfo>();

  cardTitle = 'Reglas contables';

  cardHint = 'Seleccionar los filtros';

  PERMISSION_TO_CREATE = PERMISSIONS.NOT_REQUIRED;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.setText();
    }
  }


  onCreateButtonClicked() {
    sendEvent(this.rulesExplorerEvent, FinancialRulesExplorerEventType.CREATE_CLICKED);
  }


  onRulesFilterEvent(event: EventInfo) {
    switch (event.type as FinancialRulesFilterEventType) {
      case FinancialRulesFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.rulesExplorerEvent, FinancialRulesExplorerEventType.SEARCH_CLICKED, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onRulesTableEvent(event: EventInfo) {
    switch (event.type as DataTableEventType) {
      case DataTableEventType.COUNT_FILTERED_ENTRIES:
        Assertion.assertValue(event.payload.displayedEntriesMessage, 'event.payload.displayedEntriesMessage');
        this.setText(event.payload.displayedEntriesMessage as string);
        return;
      case DataTableEventType.ENTRY_CLICKED:
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');
        sendEvent(this.rulesExplorerEvent, FinancialRulesExplorerEventType.SELECT_CLICKED, event.payload);
        return;
      case DataTableEventType.EXPORT_DATA:
        sendEvent(this.rulesExplorerEvent, FinancialRulesExplorerEventType.EXPORT_CLICKED);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setText(displayedEntriesMessage?: string) {
    if (!this.queryExecuted) {
      this.cardHint = 'Seleccionar los filtros';
      return;
    }

    this.cardHint = displayedEntriesMessage ?
      `${displayedEntriesMessage}` :
      `${this.data.entries.length} registros encontrados`;
  }

}
