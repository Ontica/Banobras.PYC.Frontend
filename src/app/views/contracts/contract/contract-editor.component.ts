/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { SkipIf } from '@app/shared/decorators';

import { ContractsDataService } from '@app/data-services';

import { ContractActions, Contract, ContractFields, EmptyContractActions, EmptyContract } from '@app/models';

import { ContractHeaderEventType } from './contract-header.component';


export enum ContractEditorEventType {
  UPDATED = 'ContractEditorComponent.Event.ContractUpdated',
  DELETED = 'ContractEditorComponent.Event.ContractDeleted',
}

@Component({
  selector: 'emp-pmt-contract-editor',
  templateUrl: './contract-editor.component.html',
})
export class ContractEditorComponent {

  @Input() contract: Contract = EmptyContract;

  @Input() actions: ContractActions = EmptyContractActions;

  @Output() contractEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private contractData: ContractsDataService) { }


  get isSaved(): boolean {
    return !isEmpty(this.contract);
  }


  @SkipIf('submitted')
  onContractHeaderEvent(event: EventInfo) {
    switch (event.type as ContractHeaderEventType) {
      case ContractHeaderEventType.UPDATE:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.updateContract(event.payload.dataFields as ContractFields);
        return;
      case ContractHeaderEventType.DELETE:
        this.deleteContract();
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private updateContract(contractFields: ContractFields) {
    this.submitted = true;

    this.contractData.updateContract(this.contract.uid, contractFields)
      .firstValue()
      .then(x => sendEvent(this.contractEditorEvent, ContractEditorEventType.UPDATED, { contractData: x }))
      .finally(() => this.submitted = false);
  }


  private deleteContract() {
    this.submitted = true;

    this.contractData.deleteContract(this.contract.uid)
      .firstValue()
      .then(() =>
        sendEvent(this.contractEditorEvent, ContractEditorEventType.DELETED, {contractUID: this.contract.uid})
      )
      .finally(() => this.submitted = false);
  }

}
