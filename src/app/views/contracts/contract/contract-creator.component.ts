/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { SkipIf } from '@app/shared/decorators';

import { ContractsDataService } from '@app/data-services';

import { ContractFields } from '@app/models';

import { ContractHeaderEventType } from './contract-header.component';


export enum ContractCreatorEventType {
  CLOSE_MODAL_CLICKED = 'ContractCreatorComponent.Event.CloseModalClicked',
  CREATED             = 'ContractCreatorComponent.Event.ContractCreated',
}

@Component({
  selector: 'emp-pmt-contract-creator',
  templateUrl: './contract-creator.component.html',
})
export class ContractCreatorComponent {

  @Output() contractCreatorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private contractData: ContractsDataService) { }


  onCloseModalClicked() {
    sendEvent(this.contractCreatorEvent, ContractCreatorEventType.CLOSE_MODAL_CLICKED);
  }


  @SkipIf('submitted')
  onContractHeaderEvent(event: EventInfo) {
    switch (event.type as ContractHeaderEventType) {
      case ContractHeaderEventType.CREATE:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.createContract(event.payload.dataFields as ContractFields);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private createContract(dataFields: ContractFields) {
    this.submitted = true;

    this.contractData.createContract(dataFields)
      .firstValue()
      .then(x => sendEvent(this.contractCreatorEvent, ContractCreatorEventType.CREATED, { data: x }))
      .finally(() => this.submitted = false);
  }

}
