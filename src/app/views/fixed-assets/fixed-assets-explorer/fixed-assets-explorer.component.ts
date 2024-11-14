/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyFixedAssetsQuery, FixedAssetDescriptor, FixedAssetsQuery } from '@app/models';

import { FixedAssetsFilterEventType } from './fixed-assets-filter.component';

import { FixedAssetsTableEventType } from './fixed-assets-table.component';


export enum FixedAssetsExplorerEventType {
  SEARCH_CLICKED            = 'FixedAssetsExplorerComponent.Event.SearchClicked',
  CLEAR_CLICKED             = 'FixedAssetsExplorerComponent.Event.ClearClicked',
  EXECUTE_OPERATION_CLICKED = 'FixedAssetsExplorerComponent.Event.ExecuteOperationClicked',
  SELECT_CLICKED            = 'FixedAssetsExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-pyc-fixed-assets-explorer',
  templateUrl: './fixed-assets-explorer.component.html',
})
export class FixedAssetsExplorerComponent implements OnChanges {

  @Input() query: FixedAssetsQuery = Object.assign({}, EmptyFixedAssetsQuery);

  @Input() dataList: FixedAssetDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() fixedAssetsExplorerEvent = new EventEmitter<EventInfo>();

  cardTitle = 'Explorador de activos fijos';

  cardHint = 'Seleccionar los filtros';

  showFilters = false;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.setText();
      this.showFilters = false;
    }
  }


  onFixedAssetsFilterEvent(event: EventInfo) {
    switch (event.type as FixedAssetsFilterEventType) {
      case FixedAssetsFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.fixedAssetsExplorerEvent, FixedAssetsExplorerEventType.SEARCH_CLICKED,
          event.payload);
        return;

      case FixedAssetsFilterEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.fixedAssetsExplorerEvent, FixedAssetsExplorerEventType.CLEAR_CLICKED,
          event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onFixedAssetsTableEvent(event: EventInfo) {
    switch (event.type as FixedAssetsTableEventType) {
      case FixedAssetsTableEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, 'event.payload.item');
        sendEvent(this.fixedAssetsExplorerEvent, FixedAssetsExplorerEventType.SELECT_CLICKED,
          event.payload);
        return;

      case FixedAssetsTableEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        sendEvent(this.fixedAssetsExplorerEvent, FixedAssetsExplorerEventType.EXECUTE_OPERATION_CLICKED,
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
