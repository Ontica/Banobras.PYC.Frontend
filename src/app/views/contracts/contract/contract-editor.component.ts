/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo, isEmpty } from '@app/core';

import { Contract, EmptyContract } from '@app/models';

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

  @Output() contractEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  get isSaved(): boolean {
    return !isEmpty(this.contract);
  }


  onContractHeaderEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as ContractHeaderEventType) {

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
