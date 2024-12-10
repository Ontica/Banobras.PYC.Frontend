/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { ContractsDataService } from '@app/data-services';

import { ContractItem, EmptyContractItem, ContractItemFields, Contract, EmptyContract } from '@app/models';

import { ContractItemsTableEventType } from './contract-items-table.component';

import { ContractItemEditorEventType } from './contract-item-editor.component';


export enum ContractItemsEditionEventType {
  ITEMS_UPDATED = 'ContractItemsEditionComponent.Event.ItemsUpdated',
}

@Component({
  selector: 'emp-pmt-contract-items-edition',
  templateUrl: './contract-items-edition.component.html',
})
export class ContractItemsEditionComponent {

  @Input() contract: Contract = EmptyContract;

  @Input() items: ContractItem[] = [];

  @Input() canEdit = false;

  @Output() contractItemsEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;

  displayItemEditor = false;

  selectedItem = EmptyContractItem;


  constructor(private contractsData: ContractsDataService) { }


  onAddItemButtonClicked() {
    this.setSelectedItem(EmptyContractItem, true);
  }


  onContractItemEditorEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as ContractItemEditorEventType) {
      case ContractItemEditorEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedItem(EmptyContractItem);
        return;
      case ContractItemEditorEventType.ADD_ITEM:
        Assertion.assertValue(event.payload.contractUID, 'event.payload.contractUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.addContractItem(event.payload.contractUID, event.payload.dataFields);
        return;
      case ContractItemEditorEventType.UPDATE_ITEM:
        Assertion.assertValue(event.payload.contractUID, 'event.payload.contractUID');
        Assertion.assertValue(event.payload.contractItemUID, 'event.payload.contractItemUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.updateContractItem(event.payload.contractUID, event.payload.contractItemUID,
          event.payload.dataFields);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onContractItemsTableEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as ContractItemsTableEventType) {
      case ContractItemsTableEventType.SELECT_ITEM_CLICKED:
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        this.setSelectedItem(event.payload.item as ContractItem);
        return;
      case ContractItemsTableEventType.REMOVE_ITEM_CLICKED:
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        this.removeContractItem(this.contract.uid, event.payload.item.uid);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }



  private addContractItem(contractUID: string, dataFields: ContractItemFields) {
    this.submitted = true;

    this.contractsData.addContractItem(contractUID, dataFields)
      .firstValue()
      .then(x => this.resolveContractUpdated())
      .finally(() => this.submitted = false);
  }


  private updateContractItem(contractUID: string, contractItemUID: string, dataFields: ContractItemFields) {
    this.submitted = true;

    this.contractsData.updateContractItem(contractUID, contractItemUID, dataFields)
      .firstValue()
      .then(x => this.resolveContractUpdated())
      .finally(() => this.submitted = false);
  }


  private removeContractItem(contractUID: string, contractItemUID: string) {
    this.submitted = true;

    this.contractsData.removeContractItem(contractUID, contractItemUID)
      .firstValue()
      .then(x => this.resolveContractUpdated())
      .finally(() => this.submitted = false);
  }


  private resolveContractUpdated() {
    const payload = { contractUID: this.contract.uid };
    sendEvent(this.contractItemsEditionEvent, ContractItemsEditionEventType.ITEMS_UPDATED, payload);
    this.setSelectedItem(EmptyContractItem);
  }


  private setSelectedItem(item: ContractItem, display?: boolean) {
    this.selectedItem = item;
    this.displayItemEditor = display ?? !isEmpty(item);
  }

}
