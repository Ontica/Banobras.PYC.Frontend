/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyPayablesQuery, PayableDescriptor, PayablesQuery } from '@app/models';

import { PayablesFilterEventType } from './payables-filter.component';

import { PayablesListEventType } from './payables-list.component';

export enum PayablesExplorerEventType {
  SEARCH_CLICKED            = 'PayablesExplorerComponent.Event.SearchClicked',
  CLEAR_CLICKED             = 'PayablesExplorerComponent.Event.ClearClicked',
  EXECUTE_OPERATION_CLICKED = 'PayablesExplorerComponent.Event.ExecuteOperationClicked',
  SELECT_CLICKED            = 'PayablesExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-pmt-payables-explorer',
  templateUrl: './payables-explorer.component.html',
})
export class PayablesExplorerComponent implements OnChanges {

  @Input() query: PayablesQuery = Object.assign({}, EmptyPayablesQuery);

  @Input() dataList: PayableDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() payablesExplorerEvent = new EventEmitter<EventInfo>();

  cardTitle = 'Obligaciones de pago';

  cardHint = 'Seleccionar los filtros';

  showFilters = false;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.setText();
      this.showFilters = false;
    }
  }


  onPayablesFilterEvent(event: EventInfo) {
    switch (event.type as PayablesFilterEventType) {
      case PayablesFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.payablesExplorerEvent, PayablesExplorerEventType.SEARCH_CLICKED,
          event.payload);
        return;

      case PayablesFilterEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.payablesExplorerEvent, PayablesExplorerEventType.CLEAR_CLICKED,
          event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onPayablesListEvent(event: EventInfo) {
    switch (event.type as PayablesListEventType) {
      case PayablesListEventType.SELECT_ITEM:
        Assertion.assertValue(event.payload.item, 'event.payload.item');
        sendEvent(this.payablesExplorerEvent, PayablesExplorerEventType.SELECT_CLICKED,
          event.payload);
        return;

      case PayablesListEventType.EXECUTE_OPERATION:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        sendEvent(this.payablesExplorerEvent, PayablesExplorerEventType.EXECUTE_OPERATION_CLICKED,
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

    this.cardHint = `${this.dataList.length} registros encontrados`;
  }

}
