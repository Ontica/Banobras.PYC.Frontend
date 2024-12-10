/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { ArrayLibrary } from '@app/shared/utils';

import { ContractsDataService } from '@app/data-services';

import { ContractData, ContractDescriptor, ContractsQuery, EmptyContractData, EmptyContractsQuery,
         mapContractDescriptorFromContract } from '@app/models';

import { ContractCreatorEventType } from '../contract/contract-creator.component';

import { ContractsExplorerEventType } from '../contracts-explorer/contracts-explorer.component';

import { ContractTabbedViewEventType } from '../contract-tabbed-view/contract-tabbed-view.component';


@Component({
  selector: 'emp-pmt-contracts-main-page',
  templateUrl: './contracts-main-page.component.html',
})
export class ContractsMainPageComponent {

  query: ContractsQuery = Object.assign({}, EmptyContractsQuery);

  dataList: ContractDescriptor[] = [];

  selectedData: ContractData = EmptyContractData;

  displayTabbedView = false;

  displayCreator = false;

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;


  constructor(private contractsData: ContractsDataService,
              private messageBox: MessageBoxService) { }


  onContractCreatorEvent(event: EventInfo) {
    switch (event.type as ContractCreatorEventType) {
      case ContractCreatorEventType.CLOSE_MODAL_CLICKED:
        this.displayCreator = false;
        return;
      case ContractCreatorEventType.CREATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        this.displayCreator = false;
        this.resolveContractData(event.payload.data as ContractData);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onContractsExplorerEvent(event: EventInfo) {
    switch (event.type as ContractsExplorerEventType) {
      case ContractsExplorerEventType.CREATE_CLICKED:
        this.displayCreator = true;
        return;
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
        this.getContractData(event.payload.item.uid);
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


  onContractTabbedViewEvent(event: EventInfo) {
    switch (event.type as ContractTabbedViewEventType) {
      case ContractTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedData(EmptyContractData);
        return;
      case ContractTabbedViewEventType.DATA_UPDATED:
        Assertion.assertValue(event.payload.contractData, 'event.payload.contractData');
        this.resolveContractData(event.payload.contractData as ContractData);
        return;
      case ContractTabbedViewEventType.DATA_DELETED:
        Assertion.assertValue(event.payload.contractUID, 'event.payload.contractUID');
        this.resolveContractDeleted(event.payload.contractUID);
        return;
      case ContractTabbedViewEventType.REFRESH_DATA:
        Assertion.assertValue(event.payload.contractUID, 'event.payload.contractUID');
        this.refreshSelectedData(event.payload.contractUID);
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
      .then(x => this.setDataList(x, true))
      .finally(() => this.isLoading = false);
  }


  private getContractData(contractUID: string) {
    this.isLoadingSelection = true;

    this.contractsData.getContractData(contractUID)
      .firstValue()
      .then(x => this.setSelectedData(x))
      .finally(() => this.isLoadingSelection = false);
  }


  private resolveContractData(data: ContractData) {
    this.insertItemToList(data);
    this.setSelectedData(data);
  }


  private resolveContractDeleted(contractUID: string) {
    this.removeItemFromList(contractUID);
    this.setSelectedData(EmptyContractData);
  }


  private refreshSelectedData(contractUID: string) {
    this.getContractData(contractUID);
  }


  private setQueryAndClearExplorerData(query: ContractsQuery) {
    this.query = Object.assign({}, query);
    this.setDataList([], false);
    this.setSelectedData(EmptyContractData);
  }


  private setDataList(data: ContractDescriptor[], queryExecuted: boolean = true) {
    this.dataList = data ?? [];
    this.queryExecuted = queryExecuted;
  }


  private setSelectedData(data: ContractData) {
    this.selectedData = data;
    this.displayTabbedView = !isEmpty(this.selectedData.contract);
  }


  private insertItemToList(data: ContractData) {
    const dataToInsert = mapContractDescriptorFromContract(data.contract);
    const dataListNew = ArrayLibrary.insertItemTop(this.dataList, dataToInsert, 'uid');
    this.setDataList(dataListNew, true);
  }


  private removeItemFromList(contractUID: string) {
    const dataListNew = this.dataList.filter(x => x.uid !== contractUID);
    this.setDataList(dataListNew);
  }

}
