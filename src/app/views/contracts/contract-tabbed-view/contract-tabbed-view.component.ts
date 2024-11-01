/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, DateStringLibrary, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { ContractData, EmptyContractData } from '@app/models';

import { ContractEditorEventType } from '../contract/contract-editor.component';


export enum ContractTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'ContractTabbedViewComponent.Event.CloseButtonClicked',
  CONTRACT_UPDATED = 'ContractTabbedViewComponent.Event.ContractUpdated',
  CONTRACT_DELETED = 'ContractTabbedViewComponent.Event.ContractDeleted',
}

@Component({
  selector: 'emp-pmt-contract-tabbed-view',
  templateUrl: './contract-tabbed-view.component.html',
})
export class ContractTabbedViewComponent implements OnChanges {

  @Input() contractData: ContractData = EmptyContractData;

  @Output() contractTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;


  ngOnChanges() {
    this.setTitle();
  }


  onCloseButtonClicked() {
    sendEvent(this.contractTabbedViewEvent, ContractTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onContractEditorEvent(event: EventInfo) {
    switch (event.type as ContractEditorEventType) {
      case ContractEditorEventType.UPDATED:
        Assertion.assertValue(event.payload.contractUID, 'event.payload.contractUID');
        sendEvent(this.contractTabbedViewEvent,
          ContractTabbedViewEventType.CONTRACT_UPDATED, event.payload);
        return;
      case ContractEditorEventType.DELETED:
        Assertion.assertValue(event.payload.contractUID, 'event.payload.contractUID');
        sendEvent(this.contractTabbedViewEvent,
          ContractTabbedViewEventType.CONTRACT_DELETED, event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    const signDate = !this.contractData.contract.signDate ?
      'N/D' : DateStringLibrary.format(this.contractData.contract.signDate);

    const status = this.contractData.contract.status.name === 'Eliminado' ?
      `<span class="tag tag-error tag-small">${this.contractData.contract.status.name}</span>` :
      `<span class="tag tag-small">${this.contractData.contract.status.name}</span>`;

    this.title = `${this.contractData.contract.contractNo}: ${this.contractData.contract.name}` + status;

    this.hint = `<strong>${this.contractData.contract.contractType.name} </strong> &nbsp; &nbsp; | &nbsp; &nbsp;` +
      `${this.contractData.contract.supplier.name} &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${signDate}`;
  }

}
