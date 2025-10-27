/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, Empty, EventInfo, Identifiable } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { FinancialConceptsQuery, EmptyFinancialConceptsQuery, FinancialConceptsData,
         EmptyFinancialConceptsData } from '@app/models';

import { FinancialConceptsFilterEventType } from './financial-concepts-filter.component';

import { DataTableEventType } from '@app/views/_reports-controls/data-table/data-table.component';


export enum FinancialConceptsExplorerEventType {
  SEARCH_CLICKED = 'FinancialConceptsExplorerComponent.Event.SearchClicked',
  CLEAR_CLICKED  = 'FinancialConceptsExplorerComponent.Event.ClearClicked',
  EXPORT_CLICKED = 'FinancialConceptsExplorerComponent.Event.ExportClicked',
  SELECT_CLICKED = 'FinancialConceptsExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-financial-concepts-explorer',
  templateUrl: './financial-concepts-explorer.component.html',
})
export class FinancialConceptsExplorerComponent implements OnChanges {

  @Input() group: Identifiable = Object.assign({}, Empty);

  @Input() query: FinancialConceptsQuery = Object.assign({}, EmptyFinancialConceptsQuery);

  @Input() data: FinancialConceptsData = Object.assign({}, EmptyFinancialConceptsData);

  @Input() selectedUID = '';

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() conceptsExplorerEvent = new EventEmitter<EventInfo>();

  cardTitle = 'Reglas de agrupación';

  cardHint = 'Seleccionar los filtros';


  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.setText();
    }
  }


  onFinancialConceptsFilterEvent(event: EventInfo) {
    switch (event.type as FinancialConceptsFilterEventType) {
      case FinancialConceptsFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.conceptsExplorerEvent, FinancialConceptsExplorerEventType.SEARCH_CLICKED,
          event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onFinancialConceptsTableEvent(event: EventInfo) {
    switch (event.type as DataTableEventType) {
      case DataTableEventType.COUNT_FILTERED_ENTRIES:
        Assertion.assertValue(event.payload.displayedEntriesMessage, 'event.payload.displayedEntriesMessage');
        this.setText(event.payload.displayedEntriesMessage as string);
        return;
      case DataTableEventType.ENTRY_CLICKED:
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');
        sendEvent(this.conceptsExplorerEvent, FinancialConceptsExplorerEventType.SELECT_CLICKED,
          event.payload);
        return;
      case DataTableEventType.EXPORT_DATA:
        sendEvent(this.conceptsExplorerEvent, FinancialConceptsExplorerEventType.EXPORT_CLICKED);
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

    if (displayedEntriesMessage) {
      this.cardHint = `${this.group.name} - ${displayedEntriesMessage}`;
      return;
    }

    this.cardHint = `${this.group.name} - ${this.data.entries.length} registros encontrados`;
  }

}
