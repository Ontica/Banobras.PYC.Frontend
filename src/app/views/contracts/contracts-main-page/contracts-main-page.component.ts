/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { ContractsDataService } from '@app/data-services';

import { ContractDescriptor, ContractsQuery, EmptyContractsQuery } from '@app/models';

import { ContractsExplorerEventType } from '../contracts-explorer/contracts-explorer.component';

@Component({
  selector: 'emp-pmt-contracts-main-page',
  templateUrl: './contracts-main-page.component.html',
})
export class ContractsMainPageComponent {

  query: ContractsQuery = Object.assign({}, EmptyContractsQuery);

  dataList: ContractDescriptor[] = [];

  selectedUID = '';

  isLoading = false;

  queryExecuted = false;


  constructor(private contractsData: ContractsDataService,
              private messageBox: MessageBoxService) { }


  onContractsExplorerEvent(event: EventInfo) {
    switch (event.type as ContractsExplorerEventType) {
      case ContractsExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as ContractsQuery);
        this.searchContracts(this.query);
        return;

      case ContractsExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as ContractsQuery);
        return;

      case ContractsExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, ' event.payload.item');
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        this.messageBox.showInDevelopment('Detalle de la obligación de pago', event.payload);
        return;

      case ContractsExplorerEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        this.messageBox.showInDevelopment('Ejecutar operación', event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchContracts(query: ContractsQuery) {
    this.isLoading = true;

    this.contractsData.searchContracts(query)
      .firstValue()
      .then(x => this.resolveSearchContracts(x))
      .finally(() => this.isLoading = false);
  }


  private resolveSearchContracts(data: ContractDescriptor[]) {
    this.setContractsList(data, true);
  }


  private setQueryAndClearExplorerData(query: ContractsQuery) {
    this.query = Object.assign({}, query);
    this.clearContractsList();
  }


  private clearContractsList() {
    this.setContractsList([], false);
  }


  private setContractsList(data: ContractDescriptor[], queryExecuted: boolean = true) {
    this.dataList = data ?? [];
    this.queryExecuted = queryExecuted;
  }

}
