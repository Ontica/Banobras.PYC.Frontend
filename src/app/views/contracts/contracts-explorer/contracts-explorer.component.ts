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

import { ContractDescriptor, ContractsQuery, EmptyContractsQuery, buildExplorerHint } from '@app/models';

import { ContractsFilterEventType } from './contracts-filter.component';

import { ContractsListEventType } from './contracts-list.component';


export enum ContractsExplorerEventType {
  CREATE_CLICKED            = 'ContractsExplorerComponent.Event.CreateClicked',
  SEARCH_CLICKED            = 'ContractsExplorerComponent.Event.SearchClicked',
  CLEAR_CLICKED             = 'ContractsExplorerComponent.Event.ClearClicked',
  EXECUTE_OPERATION_CLICKED = 'ContractsExplorerComponent.Event.ExecuteOperationClicked',
  SELECT_CLICKED            = 'ContractsExplorerComponent.Event.SelectClicked',
}

@Component({
  selector: 'emp-pmt-contracts-explorer',
  templateUrl: './contracts-explorer.component.html',
})
export class ContractsExplorerComponent implements OnChanges {

  @Input() query: ContractsQuery = Object.assign({}, EmptyContractsQuery);

  @Input() dataList: ContractDescriptor[] = [];

  @Input() selectedUID = '';

  @Input() isLoading = false;

  @Input() queryExecuted = false;

  @Output() contractsExplorerEvent = new EventEmitter<EventInfo>();

  hint = 'Seleccionar los filtros';

  showFilters = false;

  PERMISSION_TO_CREATE = PERMISSIONS.NOT_REQUIRED;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataList) {
      this.setText();
      this.showFilters = false;
    }
  }


  onCreateContractClicked() {
    sendEvent(this.contractsExplorerEvent, ContractsExplorerEventType.CREATE_CLICKED);
  }


  onContractsFilterEvent(event: EventInfo) {
    switch (event.type as ContractsFilterEventType) {
      case ContractsFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.contractsExplorerEvent, ContractsExplorerEventType.SEARCH_CLICKED,
          event.payload);
        return;

      case ContractsFilterEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        sendEvent(this.contractsExplorerEvent, ContractsExplorerEventType.CLEAR_CLICKED,
          event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onContractsListEvent(event: EventInfo) {
    switch (event.type as ContractsListEventType) {
      case ContractsListEventType.SELECT_ITEM:
        Assertion.assertValue(event.payload.item, 'event.payload.item');
        sendEvent(this.contractsExplorerEvent, ContractsExplorerEventType.SELECT_CLICKED,
          event.payload);
        return;

      case ContractsListEventType.EXECUTE_OPERATION:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        sendEvent(this.contractsExplorerEvent, ContractsExplorerEventType.EXECUTE_OPERATION_CLICKED,
          event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setText() {
    this.hint = buildExplorerHint(this.queryExecuted, this.dataList.length);
  }

}
